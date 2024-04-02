from flask import Flask, render_template, request, jsonify, g
from flask_sockets import Sockets
from flask_wtf import CSRFProtect

from flask_cors import CORS
from flask_cors import cross_origin

import gevent
from gevent import pywsgi
import threading  # Import the threading module
import queue

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine, select, String, Column, text, Integer, Float
#from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, declarative_base, validates

import datetime
import json
import numpy as np
import re
from decimal import *
import time
import gc
import base64
import io
import matplotlib
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('Agg') # don't show plot

#import scipy.io as sio
#import csv

from CoolProp.CoolProp import PropsSI

import main_calcALL
import genPosition

import scipy.io as sio

# create and initalize Flask app
app = Flask(__name__)

# Initialize CORS
CORS(app)

# Allow all origins (not recommended for production)
CORS(app, resources={r"/*": {"origins": "*"}})

# Specify a list of allowed origins
#CORS(app, resources={r"/*": {"origins": ["http://localhost:8080", "https://example.com"]}})

# Allow specific HTTP methods
CORS(app, resources={r"/*": {"methods": ["GET", "POST", "PUT", "DELETE"]}})

# Allow specific request headers
CORS(app, resources={r"/*": {"allowed_headers": "Content-Type"}})

# load the config
app.config.from_object(__name__)

app.config.from_pyfile('settings.py')

app.secret_key = b'_53oi3uriq9pifpff;apl'
csrf = CSRFProtect(app)

LOCALDB_URI="mysql://root:@localhost:3306/velocity?charset=utf8mb4"
CLEARDB_URI="mysql://b903c6b1bc6e97:75951fe8@us-cluster-east-01.k8s.cleardb.net/heroku_d3be27c2ed92331?charset=utf8mb4"
URI = LOCALDB_URI

app.config['SQLALCHEMY_DATABASE_URI'] = URI

engine = create_engine(URI, pool_pre_ping=False, echo=False)
Session = sessionmaker(bind=engine)
session = Session()

# create the database
db = SQLAlchemy(app)
from models import Convergence
db.create_all()
from models import Velocity
db.create_all()
from models import Pressure
db.create_all()
from models import Displacement
db.create_all()

class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

class npEncoder(json.JSONEncoder):
        def default(self, obj):
            if isinstance(obj, np.integer):
                return int(obj)
            if isinstance(obj, np.floating):
                return float(obj)
            if isinstance(obj, np.ndarray):
                return obj.tolist()
            return super(npEncoder, self).default(obj)

def trunc(values, decs=0):
    return np.trunc(values*10**decs)/(10**decs)

""" These 3 fxns can be combined """
def chkVfxn(simname, rowID, colID): #change
    #stmt = select(Velocity.simname).filter_by(simname=simname) #change
    #rows = session.
    # execute(stmt)
    if (simname == 'default'):
        rows = session.query(Velocity).filter_by(
                simname=simname,
                rowID=rowID,
                #colID=colID, # may not need
            )
    else:
        rows = session.query(Velocity).filter_by(simname=simname)

    chk = False
    """ can be one-liner """
    for row in rows:
        chk = True

    msg = None
    if (chk == True):
        msg = f"The simulation already exists. Would you like to update '{simname}'?"

    session.close()
    engine.dispose()

    return {"msg": msg, "chk": chk}

def chkPfxn(simname, rowID, colID): #change
    #stmt = select(Velocity.simname).filter_by(simname=simname) #change
    #rows = session.
    # execute(stmt)
    if (simname == 'default'):
        rows = session.query(Pressure).filter_by(
                simname=simname,
                rowID=rowID,
                #colID=colID, # may not need
            )
    else:
        rows = session.query(Pressure).filter_by(simname=simname)

    chk = False
    """ can be one-liner """
    for row in rows:
        chk = True

    msg = None
    if (chk == True):
        msg = f"The simulation already exists. Would you like to update '{simname}'?"

    session.close()
    engine.dispose()

    return {"msg": msg, "chk": chk}

def chkDfxn(simname, rowID, colID): #change
    #stmt = select(Velocity.simname).filter_by(simname=simname) #change
    #rows = session.
    # execute(stmt)
    if (simname == 'default'):
        rows = session.query(Displacement).filter_by(
                simname=simname,
                rowID=rowID,
                #colID=colID, # may not need
            )
    else:
        rows = session.query(Displacement).filter_by(simname=simname)

    chk = False
    """ can be one-liner """
    for row in rows:
        chk = True

    msg = None
    if (chk == True):
        msg = f"The simulation already exists. Would you like to update '{simname}'?"

    session.close()
    engine.dispose()

    return {"msg": msg, "chk": chk}

def chkCfxn(simname, rowID, colID): #change
    #stmt = select(Velocity.simname).filter_by(simname=simname) #change
    #rows = session.
    # execute(stmt)
    if (simname == 'default'):
        rows = session.query(Convergence).filter_by(
                simname=simname,
                #colID=colID, # may not need
            )
    else:
        rows = session.query(Convergence).filter_by(simname=simname)

    chk = False
    """ can be one-liner """
    for row in rows:
        chk = True

    msg = None
    if (chk == True):
        msg = f"The simulation already exists. Would you like to update '{simname}'?"

    session.close()
    engine.dispose()

    return {"msg": msg, "chk": chk}

def packVel(u, v, N):
    #uL = u[np.tril_indices(2*N+1, k = 0)]; vL = v[np.tril_indices(2*N+1, k = 0)]
    #uU = u[np.triu_indices(2*N+1, k = 1)]; vU = v[np.triu_indices(2*N+1, k = 1)]
    u_flat = ["%.8f" % number for number in u.flatten('C')]
    v_flat = ["%.8f" % number for number in v.flatten('C')]

    #ulist = [[0]*(2*N+1)]*(2*N+1)
    ulists = [[0 for i in range(2*N+1)] for j in range(2*N+1)]
    vlists = [[0 for i in range(2*N+1)] for j in range(2*N+1)]

    ctr = 0
    for i in range(0,2*N+1):
        for j in range(0,2*N+1):
            ulists[i][j] = u_flat[ctr]
            vlists[i][j] = v_flat[ctr]
            #print(f"ulist[i][j]: {ulists[i][j]} :: uflat[i][j]: {u_flat[ctr]} {bcolors.WARNING} :: i = {i}, j = {j} :: ctr = {ctr} {bcolors.ENDC}")
            ctr += 1

    #print(f"{bcolors.OKCYAN} ulist: {ulists[-1]}, len(ulist): {len(ulists)} {bcolors.ENDC}")

    ulists_pkg = [[0 for i in range(int((2*N+1)/2))] for j in range(2*N+1)]
    vlists_pkg = [[0 for i in range(int((2*N+1)/2))] for j in range(2*N+1)]

    ctr = 0; inc = 2
    for i in range(0, int((2*N+1)/2)):
        ulists_pkg[i] = {
            "first": ulists[ctr],
            "second": ulists[ctr+1]
        }
        vlists_pkg[i] = {
            "first": vlists[ctr],
            "second": vlists[ctr+1]
        }
        # print(f"len(ulists[ctr]): {ulists[ctr]}\nlen(ulists_pkg[ctr+1]): {ulists[ctr+1]}\nulists_pkg[i] {bcolors.WARNING}{ulists_pkg[i]}, i: {i} :: ctr: {ctr}{bcolors.ENDC}")
        ctr += inc

    # could be problematic for N odd
    ulists_pkg[i+1] = {"first": ulists[ctr], "second": None}
    vlists_pkg[i+1] = {"first": vlists[ctr], "second": None}

    return ulists_pkg, vlists_pkg

""" COULD USE TUPLES! """

def packPressure(P, x, y, N):

    P_flat = ["%.8f" % number for number in P.flatten('C')]
    x_flat = ["%.8f" % number for number in x.flatten('C')]
    y_flat = ["%.8f" % number for number in y.flatten('C')]

    #ulist = [[0]*(2*N+1)]*(2*N+1)
    Plists = [[0 for i in range(N)] for j in range(N)]
    xlists = [[0 for i in range(N)] for j in range(N)]
    ylists = [[0 for i in range(N)] for j in range(N)]

    xlists_pkg = xlists
    ylists_pkg = ylists

    ctr1D = 0
    ctr2D = 0
    for i in range(0,N):
        xlists[i] = x_flat[ctr1D]
        ylists[i] = y_flat[ctr1D]
        for j in range(0,N):
            Plists[i][j] = P_flat[ctr2D]
            #print(f"ulist[i][j]: {ulists[i][j]} :: uflat[i][j]: {u_flat[ctr]} {bcolors.WARNING} :: i = {i}, j = {j} :: ctr = {ctr} {bcolors.ENDC}")
            ctr2D += 1
        ctr1D += 1

    xlists_pkg = { "x": xlists }
    ylists_pkg = { "y": ylists }

    #print(f"{bcolors.OKCYAN} ulist: {ulists[-1]}, len(ulist): {len(ulists)} {bcolors.ENDC}")

    Plists_pkg = [[0 for i in range(int((N)/2))] for j in range(N)]

    ctr = 0; inc = 2
    for i in range(0, int((N)/2)):
        Plists_pkg[i] = {
            "first": Plists[ctr],
            "second": Plists[ctr+1]
        }
        # print(f"len(ulists[ctr]): {ulists[ctr]}\nlen(ulists_pkg[ctr+1]): {ulists[ctr+1]}\nulists_pkg[i] {bcolors.WARNING}{ulists_pkg[i]}, i: {i} :: ctr: {ctr}{bcolors.ENDC}")
        ctr += inc

    # could be problematic for N odd
    #Plists_pkg[i+1] = {"first": Plists[ctr], "second": None}

    return Plists_pkg, xlists_pkg, ylists_pkg

def packDisp(x, y, Np, Nint):

    x_flat = ["%.8f" % number for number in x.flatten('C')]
    y_flat = ["%.8f" % number for number in y.flatten('C')]

    xlists = [[0 for i in range(Nint)] for j in range(Np)]
    ylists = [[0 for i in range(Nint)] for j in range(Np)]

    #ctr = 0
    """ for i in range(0, 1):
        #xlists[i][0:-1] = x_flat[ctr:(ctr + Nint)]
        #ylists[i][0:-1] = y_flat[ctr:(ctr + Nint)]
        #ctr += Nint
        #print(f"{bcolors.WARNING} ctr: {ctr} {bcolors.ENDC} {bcolors.OKCYAN}:: x_flat[]: {x_flat[ctr:(ctr + Nint)]}  :: xlists[i] {xlists[i]}{bcolors.ENDC}")
        for j in range(0, Nint):
            #print(f"{bcolors.WARNING}:: x_flat[1000]: {x_flat[1000]}{bcolors.ENDC}")
            xlists[i][j] = x_flat[ctr]
            ylists[i][j] = y_flat[ctr]
            print(f"ulist[i][j]: {xlists[i][j]} :: uflat[i][j]: {x_flat[ctr]} {bcolors.WARNING} :: i = {i}, j = {j} :: ctr = {ctr} {bcolors.ENDC}")
            ctr += 1 """

    ctrX = 0; ctrY = 0
    # something with i iter when end is Np
    for i in range(0, Np): # iterate over x_flat
        ctry = 0
        for j in range(ctrY, ctrY + Nint):
            xlists[i][ctry] = x_flat[j]
            ylists[i][ctry] = y_flat[j]
            #print(f"{bcolors.WARNING} i: {i}, j: {j}, test: {test}  {bcolors.ENDC} {bcolors.OKCYAN}:: x_flat[j]: {x_flat[j]}  :: xlists[i][test] {xlists[i][test]}{bcolors.ENDC}")
            ctry += 1
        ctrY += Nint

    #print(f"{bcolors.OKCYAN} ulist: {ulists[-1]}, len(ulist): {len(ulists)} {bcolors.ENDC}")

    xlists_pkg = [[0 for i in range(Np)] for j in range(Nint)]
    ylists_pkg = [[0 for i in range(Np)] for j in range(Nint)]
    ctr = 0; inc = 2
    for i in range(0, int(Np/2)):
        #print(f"{bcolors.WARNING}i: {i} :: ctr: {ctr}{bcolors.ENDC}")

        xlists_pkg[i] = {
            "first": xlists[ctr],
            "second": xlists[ctr+1]
        }
        ylists_pkg[i] = {
            "first": ylists[ctr],
            "second": ylists[ctr+1]
        }
        #print(f"len(xlists[ctr]): {xlists[ctr]}\nlen(xlists_pkg[ctr+1]): {xlists[ctr+1]}\nulists_pkg[i] {bcolors.WARNING}{xlists_pkg[i]}, i: {i} :: ctr: {ctr}{bcolors.ENDC}")
        ctr += inc

    # could be problematic for N odd
    xlists_pkg[i+1] = {"first": xlists[-1], "second": None}
    ylists_pkg[i+1] = {"first": ylists[-1], "second": None}

    return xlists_pkg, ylists_pkg

def getSims():

    rows = session.query(Convergence.simname)
    rows = rows.all()

    # Extract the values from the results
    simnames = [row[0] for row in rows]

    #print(simnames)
    return simnames

def getDataV(simname):

    print(f"{bcolors.OKGREEN}Retreiving {simname} velocity... {bcolors.ENDC}")

    """ retreive u and v velocities from DB """
    #stmt = select(Velocity).filter_by(simname=simname)
    #rows = session.execute(stmt)

    rows = session.query(Velocity).filter_by(simname=simname)
    rows = rows.all()

    N = int(len(rows) - 1)
    #print(f"{bcolors.WARNING} len(rows) {len(rows)} :: N {N} {bcolors.ENDC}")
    u = np.asfortranarray(np.zeros((2*N+1,2*N+1)), dtype='float32')
    v = np.asfortranarray(np.zeros((2*N+1,2*N+1)), dtype='float32')

    #ctr = 0
    #for i in range(0, len(u)):
    #    for j in range(0, len(v)):
    #        """ Need to change these for any call to getDataV """
    #        u[i][j] = float(rows[i].axisU['u'][j])
    #        v[i][j] = float(rows[i].axisV['v'][j])
#
    #    ctr += 1

    #print(type(float(rows[-1].axisU['u']['first'][-1 - 1])))

    params = {
        "U": rows[0].U,
        "Re": rows[0].Re,
        "N": rows[0].N,
        "Np": rows[0].Np,
        "Nint": int(250),
        "simname": rows[0].simname,
    }

    ctr = 0; inc = 2
    for i in range(0, int((2*N+1)/2)):
        """ print(f"{bcolors.WARNING} i: {i} :: ctr: {ctr}\n \
                rows[{bcolors.FAIL}{i}{bcolors.ENDC}].axisU['u']['first'][{bcolors.FAIL}1{bcolors.ENDC}]: \
                {rows[i].axisU['u']['first'][1]}\n \
                rows[{bcolors.FAIL}{i}{bcolors.ENDC}].axisU['u']['second'][{bcolors.FAIL}1{bcolors.ENDC}]: \
                {rows[i].axisU['u']['second'][1]}") """

        for j in range(0, int((2*N+1))):
            u[ctr][j] = float(rows[i].axisU['u']['first'][j])
            v[ctr][j] = float(rows[i].axisV['v']['first'][j])
            u[ctr+1][j] = float(rows[i].axisU['u']['second'][j])
            v[ctr+1][j] = float(rows[i].axisV['v']['second'][j])

        #print(f"u[{bcolors.FAIL}{ctr}{bcolors.ENDC}]: {u[ctr]}\n:: u[{bcolors.FAIL}{ctr+1}{bcolors.ENDC}]: {u[ctr+1]}")

        ctr += inc
    #print(f"{bcolors.OKBLUE} ulists: {u[0][0]} {bcolors.ENDC}")
    #print(f"{bcolors.OKBLUE} ulists: {u[-1][-1]} {bcolors.ENDC}")

    print(f"{bcolors.OKGREEN} '{simname}' velocity successfully retreived.{bcolors.ENDC}")

    obj = {"u": u, "v": v, "params": params}

    """
    print(Velocity.__table__.columns.keys(), Velocity.metadata.tables['cfd'].columns.keys())
    keys = Velocity.__table__.columns.keys()
    for key in keys:
        json.loads(key.obj)
        newObj = {
    } """

    return obj

    #for i in range(0, len(ulists)):

        #print(f"{bcolors.WARNING} row: {row.axisU['u']},\nlen(row.axisU): {len(row.axisU['u'])} {bcolors.ENDC}")

        #ustrs = row.axisU['u']

        #ulist = [[0]*(2*N+1)]*(2*N+1)

        #getcontext().prec = 6
        #exp = "(?:(?<=,)|(?<=^))[+-]?\d+\.?\d*(?:E[+-]?\d+)?(?=,|$)"

        #print(f"{bcolors.OKBLUE} ulist: {len(ulist)} {bcolors.ENDC}")
        #ctrI = 0
        #for i in range(0,len(ustrs)):
        #    print(f"{bcolors.OKBLUE} ustr: {ustrs[i]}, ctrI: {ctrI} {bcolors.ENDC}")
        #    ctrI += 1; ctrJ = 0
        #    for j in range(0,len(ustrs[i])):
        #
        #         #print(f"{bcolors.WARNING} dummy: {type(ustrs[i][j])}, ctrJ: {ctrJ} {bcolors.ENDC}")
        #         ctrJ += 1
        #         ulist[i][j] = float(ustrs[i][j])
        #         #print(f"{bcolors.WARNING} dummy: {type(ulist)} {bcolors.ENDC}")

        #print(f"{bcolors.OKBLUE} ulist: {ulist},\nctrI: {ctrI},\nctrJ: {ctrJ} {bcolors.ENDC}")

        #uflat = ["%.2f" % number for number in u.flatten('C')]
        #ustr = ', '.join(u.flatten('C'))
        #u = np.fromstring(test, dtype = float, sep = ', ' )
        #print(f"{bcolors.WARNING} type(u): {type(u[0][0])} \n len(u): {len(u)} \n {u} {bcolors.ENDC}")
        #tokens = re.findall(exp, velObj['u'])
        #id = row[2]
        #u = np.asfortranarray(np.zeros((len(tokens))), dtype='float32')
        #v = u
        #cmd = f"""for p in tokens: {id}[ctr] = float(p); ctr += 1"""
        #exec(cmd)


    #for row in rows:
    #    tokens = re.findall(exp, row[1])
    #    print(f"{bcolors.WARNING} tokens: {tokens} {bcolors.ENDC}")
    #    id = row[2]
    #    u = np.asfortranarray(np.zeros((len(tokens))), dtype='float32')
    #    v = u
    #
    #    cmd = f"""for p in tokens: {id}[ctr] = float(p); ctr += 1"""
    #    exec(cmd)
    #
    #    #eval("u = np.asfortranarray(np.zeros((len(tokens))), dtype='float32');")
    #
    #    print(f"{bcolors.OKGREEN} \
    #            id: {id}, \n \
    #            len(tokens): {len(tokens)} \n \
    #                len({id}): {len(eval(id))} \
    #                    {bcolors.ENDC}")

       # """ #for p in tokens:
       # #    u[ctr] = float(p)
       # #    ctr += 1
       #     #print(f"{bcolors.WARNING} ctr: {ctr} {bcolors.ENDC}")
       #     #print(f"{bcolors.WARNING} {ctr} {float(p)} {len(tokens)} {u} {bcolors.ENDC}")
       #     #result = np.fromstring(re.findall(exp, row[1]), dtype=float, sep=',')
       #     #result = np.fromstring(row[1], dtype=float, sep=',')
       #     #print(f"{bcolors.OKGREEN} shape(result): {result[-1]} {bcolors.ENDC}") """

    #print(Velocity.__table__.columns.keys(), Velocity.metadata.tables['cfd'].columns.keys())
    #keys = Velocity.__table__.columns.keys()

def getDataD(simname, Np, Nint):

    print(f"{bcolors.OKGREEN}Retreiving {simname} displacement... {bcolors.ENDC}")
    """ retreive x and y displacements from DB """

    rows = session.query(Displacement).filter_by(simname=simname)
    rows = rows.all()

    x = np.asfortranarray(np.zeros((Np, Nint)), dtype='float32')
    y = np.asfortranarray(np.zeros((Np, Nint)), dtype='float32')

    params = {
        "U": rows[0].U,
        "Re": rows[0].Re,
        "N": rows[0].N,
        "Np": rows[0].Np,
        "Nint": int(250),
        "simname": rows[0].simname,
        }

    ctr = 0; inc = 2
    for i in range(0, int((Np/2))):

        """ if (i < 5):
            print(f"{bcolors.WARNING} i: {i} :: ctr: {ctr}\n \
                rows[{bcolors.FAIL}{i}{bcolors.ENDC}].axisX['x']['first'][{bcolors.FAIL}1{bcolors.ENDC}]: \
                {rows[i].axisX['x']['first'][1]}\n \
                rows[{bcolors.FAIL}{i}{bcolors.ENDC}].axisX['x']['second'][{bcolors.FAIL}1{bcolors.ENDC}]: \
                {rows[i].axisX['x']['second'][1]}") """

        for j in range(0, Nint):
            x[ctr][j] = float(rows[i].axisX['x']['first'][j])
            y[ctr][j] = float(rows[i].axisY['y']['first'][j])
            x[ctr+1][j] = float(rows[i].axisX['x']['second'][j])
            y[ctr+1][j] = float(rows[i].axisY['y']['second'][j])

        """ if (i < 5):
            print(f"x[{bcolors.FAIL}{ctr}{bcolors.ENDC}]: {x[ctr][1]}\n:: x[{bcolors.FAIL}{ctr+1}{bcolors.ENDC}]: {x[ctr+1][1]}") """

        ctr += inc

    #print(f"{bcolors.OKCYAN} params: {params} {bcolors.ENDC}")

    print(f"{bcolors.OKGREEN} '{simname}' displacement successfully retreived.{bcolors.ENDC}")

    data = { "x": x, "y": y }

    obj = { "x": x, "y": y, "params": params }

    session.close()
    engine.dispose()

    return obj

def getDataP(simname):

    print(f"{bcolors.OKGREEN}Retreiving {simname} pressure... {bcolors.ENDC}")

    """ retreive 2D pressure field from DB """
    #stmt = select(Velocity).filter_by(simname=simname)
    #rows = session.execute(stmt)

    rows = session.query(Pressure).filter_by(simname=simname)
    rows = rows.all()

    N = int(2*len(rows))
    print(f"{bcolors.WARNING} len(rows) {len(rows)} :: N {N} {bcolors.ENDC}")
    P = np.asfortranarray(np.zeros((N,N)), dtype='float32')

    params = {
        "U": rows[0].U,
        "Re": rows[0].Re,
        "N": rows[0].N,
        "Np": rows[0].Np,
        "Nint": int(250),
        "simname": rows[0].simname,
    }

    ctr = 0; inc = 2
    for i in range(0, int((N/2))):
        """ print(f"{bcolors.WARNING} i: {i} :: ctr: {ctr}\n \
                rows[{bcolors.FAIL}{i}{bcolors.ENDC}].axisU['u']['first'][{bcolors.FAIL}1{bcolors.ENDC}]: \
                {rows[i].axisU['u']['first'][1]}\n \
                rows[{bcolors.FAIL}{i}{bcolors.ENDC}].axisU['u']['second'][{bcolors.FAIL}1{bcolors.ENDC}]: \
                {rows[i].axisU['u']['second'][1]}") """

        for j in range(0, int((N))):
            P[ctr][j] = float(rows[i].axisP['p']['first'][j])
            P[ctr+1][j] = float(rows[i].axisP['p']['second'][j])

        #print(f"u[{bcolors.FAIL}{ctr}{bcolors.ENDC}]: {u[ctr]}\n:: u[{bcolors.FAIL}{ctr+1}{bcolors.ENDC}]: {u[ctr+1]}")

        ctr += inc

    #print(f"{bcolors.OKBLUE} ulists: {u[0][0]} {bcolors.ENDC}")
    #print(f"{bcolors.OKBLUE} ulists: {u[-1][-1]} {bcolors.ENDC}")

    print(f"{bcolors.OKGREEN} '{simname}' pressure successfully retreived.{bcolors.ENDC}")

    obj = {"P": P, "params": params}

    return obj

def getDataC(simname):

    print(f"{bcolors.OKGREEN}Retreiving {simname} displacement... {bcolors.ENDC}")
    """ retreive x and y displacements from DB """

    rows = session.query(Convergence).filter_by(simname=simname)
    rows = rows.all()

    params = {
        "U": rows[0].U,
        "Re": rows[0].Re,
        "N": rows[0].N,
        "Np": rows[0].Np,
        "Nint": int(250),
        "simname": rows[0].simname,
        }

    print(f"{bcolors.OKCYAN} params: {params} {bcolors.ENDC}")

    obj = { "resid": rows[0].resid, "params": params }

    session.close()
    engine.dispose()

    return obj

def saveDefaultConvergence(obj):

    simname = obj['simname']; newname = obj['newname']; N = obj['N']
    resid = obj['resid']

    flag = False
    #print(f"{bcolors.WARNING} flag, {flag}, simname: {simname}, newname: {newname}{bcolors.ENDC}")
    if (newname != None):
        flag = True
        simname = newname
        chk = chkCfxn(simname=simname, rowID=None, colID=None)
    else: chk = chkCfxn(simname, None, None)

    #print(f"{bcolors.OKCYAN} flag, {flag}, chk: {chk['chk']}, simname: {simname}, newname: {newname}{bcolors.ENDC}")

    msg = "Unsuccessful write to database."

    """ saving or updating from save button """
    if (flag == True):
        if (chk['chk'] == True): # change
            ctr = 0
            rows = session.query(Convergence).filter_by(simname='default')
            for row in rows:
                session.query(Convergence).filter_by(simname = simname).update({ Convergence.U: row.U })
                session.query(Convergence).filter_by(simname = simname).update({ Convergence.Re: row.Re })
                session.query(Convergence).filter_by(simname = simname).update({ Convergence.N: row.N })
                session.query(Convergence).filter_by(simname = simname).update({ Convergence.Np: row.Np })
                session.query(Convergence).filter_by(simname = simname).update({ Convergence.resid: row.resid })
                session.query(Convergence).filter_by(simname = simname).update({ Convergence.simname: simname })
                session.query(Convergence).filter_by(simname = simname).update({ Convergence.DT: datetime.datetime.utcnow() })

                session.commit()

                msg = f"{simname} updated."
                ctr += 1
            #print(f"ctr: {ctr}")
        else:
            rows = session.query(Convergence).filter_by(simname='default')

            for row in rows:
                p = Convergence(
                        U = row.U,
                        Re = row.Re,
                        N = row.N,
                        Np = row.Np,
                        resid = row.resid,
                        src = 'cfd',
                        simname = newname,
                        DT = None,
                    )

                session.add(p)

                session.commit()

            msg = f"{simname} saved."
    else:
        """ saving or updating from fvm """
        if (chk['chk'] == True):
            rows = session.query(Convergence).filter_by(simname=simname)

            for row in rows:
                session.query(Convergence).filter_by(simname=simname).update({ Convergence.U: obj['U'] })
                session.query(Convergence).filter_by(simname=simname).update({ Convergence.Re: obj['Re'] })
                session.query(Convergence).filter_by(simname=simname).update({ Convergence.N: obj['N'] })
                session.query(Convergence).filter_by(simname=simname).update({ Convergence.Np: obj['Np'] })
                session.query(Convergence).filter_by(simname=simname).update({ Convergence.resid: resid})
                session.query(Convergence).filter_by(simname=simname).update({ Convergence.simname: simname })
                session.query(Convergence).filter_by(simname=simname).update({ Convergence.DT: datetime.datetime.utcnow() })

                session.commit()

                msg = f"{simname} updated."
        else:
            p = Convergence(
                    U = obj['U'],
                    Re = obj['Re'],
                    N = obj['N'],
                    Np = obj['Np'],
                    resid = obj['resid'],
                    src = 'cfd',
                    simname = simname,
                    DT = None,
                )

            session.add(p)

            session.commit()

            msg = f"{simname} saved."

    session.close()

    engine.dispose()

    print(f"{bcolors.OKGREEN}:: {msg} ::{bcolors.ENDC}")

    return msg

def saveDefaultVelocity(obj):

    simname = obj['simname']; newname = obj['newname']; N = obj['N']
    rowID = obj['rowID']; colID = obj['colID']
    flag = False
    #print(f"{bcolors.WARNING} flag, {flag}, simname: {simname}, newname: {newname}\nrowID: {rowID}, colID: {colID} {bcolors.ENDC}")
    if (newname != None):
        flag = True
        simname = newname
        chk = chkVfxn(simname=simname, rowID=None, colID=None)
    else: chk = chkVfxn(simname, rowID, colID)

    #print(f"{bcolors.FAIL} flag: {flag}, chk: {chk['chk']}, simname: {simname}, newname: {newname}\nrowID: {rowID}, colID: {colID} {bcolors.ENDC}")

    msg = "Unsuccessful write to database."

    """ saving or updating from save button """
    if (flag == True):
        if (chk['chk'] == True): # change
            ctr = 0
            rows = session.query(Velocity).filter_by(simname='default')
            for row in rows:
                session.query(Velocity).filter_by(simname = simname, rowID=row.rowID).update({ Velocity.U: row.U })
                session.query(Velocity).filter_by(simname = simname, rowID=row.rowID).update({ Velocity.Re: row.Re })
                session.query(Velocity).filter_by(simname = simname, rowID=row.rowID).update({ Velocity.N: row.N })
                session.query(Velocity).filter_by(simname = simname, rowID=row.rowID).update({ Velocity.Np: row.Np})
                session.query(Velocity).filter_by(simname = simname, rowID=row.rowID).update({ Velocity.axisU: row.axisU })
                session.query(Velocity).filter_by(simname = simname, rowID=row.rowID).update({ Velocity.axisV: row.axisV })
                session.query(Velocity).filter_by(simname = simname, rowID=row.rowID).update({ Velocity.simname: simname })
                session.query(Velocity).filter_by(simname = simname, rowID=row.rowID).update({ Velocity.DT: datetime.datetime.utcnow() })

                session.commit()

                msg = f"{simname} updated."
                ctr += 1
            #print(f"ctr: {ctr}")
        else:
            rows = session.query(Velocity).filter_by(simname='default')

            for row in rows:
                p = Velocity(
                        U = row.U,
                        Re = row.Re,
                        N = row.N,
                        Np = row.Np,
                        rowID = row.rowID,
                        colID = row.colID,
                        axisU = row.axisU,
                        axisV = row.axisV,
                        axisID = 'uv',
                        src = 'cfd',
                        simname = newname,
                        DT = None,
                    )

                session.add(p)

                session.commit()

            msg = f"{simname} saved."
    else:
        """ saving or updating from fvm """
        if (chk['chk'] == True):
            rows = session.query(Velocity).filter_by(simname=simname, rowID=rowID)

            for row in rows:
                session.query(Velocity).filter_by(simname=simname, rowID=row.rowID).update({ Velocity.U: obj['U'] })
                session.query(Velocity).filter_by(simname=simname, rowID=row.rowID).update({ Velocity.Re: obj['Re'] })
                session.query(Velocity).filter_by(simname=simname, rowID=row.rowID).update({ Velocity.N: obj['N'] })
                session.query(Velocity).filter_by(simname=simname, rowID=row.rowID).update({ Velocity.Np: obj['Np'] })
                session.query(Velocity).filter_by(simname=simname, rowID=row.rowID).update({ Velocity.axisU: obj['axisU'] })
                session.query(Velocity).filter_by(simname=simname, rowID=row.rowID).update({ Velocity.axisV: obj['axisV'] })
                session.query(Velocity).filter_by(simname=simname, rowID=row.rowID).update({ Velocity.simname: simname })
                session.query(Velocity).filter_by(simname=simname, rowID=row.rowID).update({ Velocity.DT: datetime.datetime.utcnow() })

                session.commit()

                msg = f"{simname} updated."
        else:
            p = Velocity(
                    U = obj['U'],
                    Re = obj['Re'],
                    N = obj['N'],
                    Np = obj['Np'],
                    rowID = obj['rowID'],
                    colID = obj['colID'],
                    axisU = obj['axisU'],
                    axisV = obj['axisV'],
                    axisID = 'uv',
                    src = 'cfd',
                    simname = simname,
                    DT = None,
                )

            session.add(p)

            session.commit()

            msg = f"{simname} saved."

    session.close()

    engine.dispose()

    if (rowID == int((2*N+1)/2) - 1):
        print(f"{bcolors.OKGREEN}:: {msg} ::{bcolors.ENDC}")

    return msg

def saveDefaultPressure(obj):
    simname = obj['simname']; newname = obj['newname']; N = obj['N']
    rowID = obj['rowID']; colID = obj['colID']
    flag = False
    #print(f"{bcolors.WARNING} flag, {flag}, simname: {simname}, newname: {newname}\nrowID: {rowID}, colID: {colID} {bcolors.ENDC}")
    if (newname != None):
        flag = True
        simname = newname
        chk = chkPfxn(simname=simname, rowID=None, colID=None)
    else: chk = chkPfxn(simname, rowID, colID)

    #print(f"{bcolors.FAIL} flag: {flag}, chk: {chk['chk']}, simname: {simname}, newname: {newname}\nrowID: {rowID}, colID: {colID} {bcolors.ENDC}")

    msg = "Unsuccessful write to database."

    """ saving or updating from save button """
    if (flag == True):
        if (chk['chk'] == True): # change
            ctr = 0
            rows = session.query(Pressure).filter_by(simname='default')
            for row in rows:
                session.query(Pressure).filter_by(simname = simname, rowID=row.rowID).update({ Pressure.U: row.U })
                session.query(Pressure).filter_by(simname = simname, rowID=row.rowID).update({ Pressure.Re: row.Re })
                session.query(Pressure).filter_by(simname = simname, rowID=row.rowID).update({ Pressure.N: row.N })
                session.query(Pressure).filter_by(simname = simname, rowID=row.rowID).update({ Pressure.Np: row.Np})
                session.query(Pressure).filter_by(simname = simname, rowID=row.rowID).update({ Pressure.axisP: row.axisP })
                session.query(Pressure).filter_by(simname = simname, rowID=row.rowID).update({ Pressure.axisX: row.axisX })
                session.query(Pressure).filter_by(simname = simname, rowID=row.rowID).update({ Pressure.axisY: row.axisY })
                session.query(Pressure).filter_by(simname = simname, rowID=row.rowID).update({ Pressure.simname: simname })
                session.query(Pressure).filter_by(simname = simname, rowID=row.rowID).update({ Pressure.DT: datetime.datetime.utcnow() })

                session.commit()

                msg = f"{simname} updated."
                ctr += 1
            #print(f"ctr: {ctr}")
        else:
            rows = session.query(Pressure).filter_by(simname='default')

            for row in rows:
                p = Pressure(
                        U = row.U,
                        Re = row.Re,
                        N = row.N,
                        Np = row.Np,
                        rowID = row.rowID,
                        colID = row.colID,
                        axisP = row.axisP,
                        axisX = row.axisX,
                        axisY = row.axisY,
                        axisID = 'p',
                        src = 'cfd',
                        simname = newname,
                        DT = None,
                    )

                session.add(p)

                session.commit()

            msg = f"{simname} saved."
    else:
        """ saving or updating from fvm """
        if (chk['chk'] == True):
            rows = session.query(Pressure).filter_by(simname=simname, rowID=rowID)

            for row in rows:
                session.query(Pressure).filter_by(simname=simname, rowID=row.rowID).update({ Pressure.U: obj['U'] })
                session.query(Pressure).filter_by(simname=simname, rowID=row.rowID).update({ Pressure.Re: obj['Re'] })
                session.query(Pressure).filter_by(simname=simname, rowID=row.rowID).update({ Pressure.N: obj['N'] })
                session.query(Pressure).filter_by(simname=simname, rowID=row.rowID).update({ Pressure.Np: obj['Np'] })
                session.query(Pressure).filter_by(simname=simname, rowID=row.rowID).update({ Pressure.axisP: obj['axisP'] })
                session.query(Pressure).filter_by(simname=simname, rowID=row.rowID).update({ Pressure.axisX: obj['axisX'] })
                session.query(Pressure).filter_by(simname=simname, rowID=row.rowID).update({ Pressure.axisY: obj['axisY'] })
                session.query(Pressure).filter_by(simname=simname, rowID=row.rowID).update({ Pressure.simname: simname })
                session.query(Pressure).filter_by(simname=simname, rowID=row.rowID).update({ Pressure.DT: datetime.datetime.utcnow() })

                session.commit()

                msg = f"{simname} updated."
        else:
            p = Pressure(
                    U = obj['U'],
                    Re = obj['Re'],
                    N = obj['N'],
                    Np = obj['Np'],
                    rowID = obj['rowID'],
                    colID = obj['colID'],
                    axisP = obj['axisP'],
                    axisX = obj['axisX'],
                    axisY = obj['axisY'],
                    axisID = 'p',
                    src = 'cfd',
                    simname = simname,
                    DT = None,
                )

            session.add(p)

            session.commit()

            msg = f"{simname} saved."

    session.close()

    engine.dispose()

    if (rowID == int((N)/2) - 1):
        print(f"{bcolors.OKGREEN}:: {msg} ::{bcolors.ENDC}")

    return msg

def saveDefaultDisplacement(obj):

    simname = obj['simname']; newname = obj['newname']
    Np = obj['Np']
    rowID = obj['rowID']; colID = obj['colID']

    flag = False
    #print(f"{bcolors.WARNING} flag, {flag}, simname: {simname}, newname: {newname}\nrowID: {rowID}, colID: {colID} {bcolors.ENDC}")
    if (newname != None):
        flag = True
        simname = newname
        chk = chkDfxn(simname=simname, rowID=None, colID=None)
    else: chk = chkDfxn(simname, rowID, colID)

    #print(f"{bcolors.FAIL} flag: {flag}, chk: {chk['chk']}, simname: {simname}, newname: {newname}\nrowID: {rowID}, colID: {colID} {bcolors.ENDC}")

    msg = "Unsuccessful write to database."

    """ saving or updating from save button """
    if (flag == True):
        if (chk['chk'] == True): # change
            ctr = 0
            rows = session.query(Displacement).filter_by(simname='default')

            for row in rows:
                session.query(Displacement).filter_by(simname=simname, rowID=row.rowID).update({ Displacement.U: row.U })
                session.query(Displacement).filter_by(simname=simname, rowID=row.rowID).update({ Displacement.Re: row.Re })
                session.query(Displacement).filter_by(simname=simname, rowID=row.rowID).update({ Displacement.N: row.N })
                session.query(Displacement).filter_by(simname=simname, rowID=row.rowID).update({ Displacement.Np: row.Np})
                session.query(Displacement).filter_by(simname=simname, rowID=row.rowID).update({ Displacement.axisX: row.axisX })
                session.query(Displacement).filter_by(simname=simname, rowID=row.rowID).update({ Displacement.axisY: row.axisY })
                session.query(Displacement).filter_by(simname=simname, rowID=row.rowID).update({ Displacement.simname: simname })
                session.query(Displacement).filter_by(simname=simname, rowID=row.rowID).update({ Displacement.DT: datetime.datetime.utcnow() })

                session.commit()

                msg = f"{simname} updated."
                ctr += 1
            #print(f"ctr: {ctr}")
        else:
            rows = session.query(Displacement).filter_by(simname='default')
            for row in rows:
                p = Displacement(
                        U = row.U,
                        Re = row.Re,
                        N = row.N,
                        Np = row.Np,
                        rowID = row.rowID,
                        colID = row.colID,
                        axisX = row.axisX,
                        axisY = row.axisY,
                        axisID = 'xy',
                        src = 'integration',
                        simname = newname,
                        DT = None,
                    )

                session.add(p)

                session.commit()

            msg = f"{simname} displacment saved."
    else:
        """ saving or updating from genP or genS """
        if (chk['chk'] == True):
            rows = session.query(Displacement).filter_by(simname=simname, rowID=rowID)

            for row in rows:
                session.query(Displacement).filter_by(simname=simname, rowID=row.rowID).update({ Displacement.U: obj['U'] })
                session.query(Displacement).filter_by(simname=simname, rowID=row.rowID).update({ Displacement.Re: obj['Re'] })
                session.query(Displacement).filter_by(simname=simname, rowID=row.rowID).update({ Displacement.N: obj['N'] })
                session.query(Displacement).filter_by(simname=simname, rowID=row.rowID).update({ Displacement.Np: obj['Np'] })
                session.query(Displacement).filter_by(simname=simname, rowID=row.rowID).update({ Displacement.axisX: obj['axisX'] })
                session.query(Displacement).filter_by(simname=simname, rowID=row.rowID).update({ Displacement.axisY: obj['axisY'] })
                session.query(Displacement).filter_by(simname=simname, rowID=row.rowID).update({ Displacement.simname: simname })
                session.query(Displacement).filter_by(simname=simname, rowID=row.rowID).update({ Displacement.DT: datetime.datetime.utcnow()})

                session.commit()

                msg = f"{simname} updated."
        else:
            p = Displacement(
                    U = obj['U'],
                    Re = obj['Re'],
                    N = obj['N'],
                    Np = obj['Np'],
                    rowID = obj['rowID'],
                    colID = obj['colID'],
                    axisX = obj['axisX'],
                    axisY = obj['axisY'],
                    axisID = 'xy',
                    src = 'integration',
                    simname = simname,
                    DT = None,
                )

            session.add(p)

            session.commit()

            msg = f"{simname} saved."

    session.close()

    engine.dispose()

    if (rowID == (int(Np/2 - 1))):
        print(f"{bcolors.OKGREEN}:: {msg} ::{bcolors.ENDC}")

    return msg

def generateStreamlines(objS, objP):
    u = objS['u']; v = objS['v']; P = objP['P']
    N = objS['N']

    L = 1

    """ Generate 2D pressure field plot """

    xP = np.linspace(0, L, N)
    yP = np.linspace(0, L, N)
    XP, YP = np.meshgrid(xP, yP)

    # Create the plot
    figP = plt.figure()
    axP = plt.subplot(111)

    img_buf = io.BytesIO()
    print(": ", P.shape)
    # Plot the filled contour plot for the pressure field
    contour = axP.contourf(XP, YP, P,
                           density = 3,
                           linewidth = 0.6,
                           cmap='gist_rainbow',
                           levels=N
                        )
    #cbar = plt.colorbar(contour, label='Normalized Pressure')

    # Add contour lines
    contours = axP.contour(XP, YP, P, colors='k', levels=N, linewidths=0.5)

    # Add a legend for the contour lines
    axP.clabel(contours, inline=True, fontsize=8, fmt='%1.2f', rightside_up=True)

    # Add labels and a title
    #axP.set_xlabel('X')
    #axP.set_ylabel('Y')

    axP.set_xlim((0, L)); axP.set_ylim((0, L))
    axP.set_aspect('equal')
    axP.get_xaxis().set_visible(False); axP.get_yaxis().set_visible(False)

    plt.axis('off')
    plt.savefig(img_buf, format='png', dpi=300, bbox_inches='tight', pad_inches=0, transparent=True)

    encoded_string = base64.b64encode(img_buf.getvalue())
    # must send decoded string
    decoded_string = encoded_string.decode()
    imgP_src = "data:image/png;base64,{0}".format(decoded_string)

    #plt.show()

    x_mat, y_mat = np.mgrid[0:L:((2*N+1)*1j), 0:L:((2*N+1)*1j)]
    #x_mat = np.transpose(x_mat); y_mat=np.transpose(y_mat)

    def velocity_fieldStream():
        vx = u
        vy = v
        #vx = u.reshape((N,N))
        #vy = v.reshape((N,N))
        return (vx, vy)

    # pack meshgrid
    xy = np.asfortranarray((x_mat.transpose(), y_mat.transpose()), dtype='float32')
    x_dot, y_dot = velocity_fieldStream()

    speed = np.sqrt(x_dot ** 2 + y_dot ** 2)

    # Suppress/hide the warning for divide by 0 in u_n & v_n
    np.seterr(invalid='ignore')
    u_n = x_dot / speed
    v_n = y_dot / speed

    # unpack x and y
    x, y = xy

    img_buf = io.BytesIO()
    fig = plt.figure()
    ax = plt.subplot(111)
    ax.streamplot(x, y, u_n, v_n,
        density = 3,
        linewidth = 0.6,
        color = speed,
        cmap = 'gist_rainbow',
        broken_streamlines = False,
        integration_direction = 'both',
    )

    #plt.show(block=False)
    #ax.set_xlabel('x'); ax.set_ylabel('y')
    ax.set_xlim((0, L)); ax.set_ylim((0, L))
    ax.set_aspect('equal')
    ax.get_xaxis().set_visible(False); ax.get_yaxis().set_visible(False)
    plt.axis('off')
    plt.savefig(img_buf, format='png', dpi=300, bbox_inches='tight', pad_inches=0, transparent=True)
    #im = Image.open(img_buf)

    # image is binary
    #encoded_string = base64.b64encode(img.read())
    encoded_string = base64.b64encode(img_buf.getvalue())

    #with open('./media/Streamplot.png', 'rb') as image_file:
    #    encoded_string = base64.b64encode(image_file.read())

    # must send decoded string
    decoded_string = encoded_string.decode()
    img_src = "data:image/png;base64,{0}".format(decoded_string)

    #print(len(img_src))

    return img_src, imgP_src

def find_max(matrix):
    max_value = float("-inf")
    max_row, max_col = -1, -1

    for row in range(len(matrix)):
        for col in range(len(matrix[row])):
            if matrix[row][col] > max_value:
                max_value = matrix[row][col]
                max_row, max_col = row, col

    return max_row, max_col, max_value


sockets = Sockets(app)

@sockets.route('/chk')
def chk(ws):
    while not ws.closed:
        message = ws.receive() # receive message from form submit
        if message is None:  # message is "None" if the client has closed.
            continue

        res = json.loads(message)
        print(":: req.method =", request.method)
        if request.method == 'POST':
            print(":: in if statement ::")

        #print(f"{bcolors.WARNING} res: {res['flag']} {bcolors.ENDC}")

        simname = res['simname']

        obj = chkVfxn(simname=simname, rowID=1, colID=None)

        event = {"msg": obj['msg'], "chk": obj['chk']}

        clients = ws.handler.server.clients.values()
        for client in clients:
            client.ws.send(json.dumps(event, cls=npEncoder)) # send

        ws.close()

save_clients = set()
@sockets.route('/save')
def save(ws):
    save_clients.add(ws)
    try:
        while not ws.closed:
            message = ws.receive() # receive message from form submit
            res = json.loads(message)
            if res['flag'] == 'saveupdate':
                print(":: req.method =", request.method)
                if request.method == 'POST':
                    print(":: in if statement ::")

                #print(f"{bcolors.WARNING} res: {res['flag']} {bcolors.ENDC}")

                ubn = float(res['U'])
                Re = float(res['Re'])
                N = int(res['N'])
                Np = int(res['Np'])

                simname = res['simname']; newname = res['newname']

                obj = {
                    "simname": simname,
                    "newname": newname,
                    "U": ubn,
                    "Re": Re,
                    "N": N,
                    "Np": Np,
                    "rowID": 0,
                    "colID": None,
                    "axisU": { "u": None },
                    "axisV": { "v": None },
                    "axisID": 'uv',
                    }

                t1 = time.time()
                saveDefaultVelocity(obj)

                print(f"{bcolors.OKCYAN} Write time = {time.time() - t1}[s] {bcolors.ENDC}")

                t1 = time.time()

                obj = {
                    "simname": simname,
                    "newname": newname,
                    "U": ubn,
                    "Re": Re,
                    "N": N,
                    "Np": Np,
                    "rowID": 0,
                    "colID": None,
                    "axisP": { "p": None },
                    "axisX": { "x": None },
                    "axisY": { "y": None },
                    "axisID": 'p',
                }

                saveDefaultPressure(obj)

                print(f"{bcolors.OKCYAN}Write time = {time.time() - t1}[s]{bcolors.ENDC}")

                t1 = time.time()
                #for i in range(0, int(Np/2)):
                obj = {
                        "simname": simname,
                        "newname": newname,
                        "U": ubn,
                        "Re": Re,
                        "N": N,
                        "Np": Np,
                        "rowID": None,
                        "colID": None,
                        "axisX": {"x": None},
                        "axisY": {"y": None},
                    }

                saveDefaultDisplacement(obj)

                print(f"{bcolors.OKCYAN}Write time = {time.time() - t1}[s]{bcolors.ENDC}")

                t1 = time.time()

                obj = {
                    "simname": simname,
                    "newname": newname,
                    "U": ubn,
                    "Re": Re,
                    "N": N,
                    "Np": Np,
                    "resid": {
                        "u": None,
                        "v": None,
                        "c": None,
                    },
                    "src": 'cfd',
                }

                msg = saveDefaultConvergence(obj)

                print(f"{bcolors.OKCYAN}Write time = {time.time() - t1}[s]{bcolors.ENDC}")

                #print(f"{bcolors.OKGREEN}:: {msg} ::{bcolors.ENDC}")

                event = {"msg": msg}

                clients = ws.handler.server.clients.values()
                for client in clients:
                    client.ws.send(json.dumps(event, cls=npEncoder)) # send

                ws.close()
    except Exception:
        pass
    finally:
        save_clients.remove(ws)

load_clients = set()
@sockets.route('/load')
def load(ws):
    load_clients.add(ws)
    try:
        while not ws.closed:
            message = ws.receive() # receive message from form submit
            res = json.loads(message)
            if res['flag'] == 'simnames':
                if request.method == 'POST':
                    print(":: in if statement ::")

                print(f"{bcolors.OKCYAN} res: {res['flag']}, req.method: {request.method} {bcolors.ENDC}")

                simnames = getSims()

                event = simnames

                #clients = ws.handler.server.clients.values()
                #for client in clients:
                #    client.ws.send(json.dumps(event, cls=npEncoder)) # send
                ws.send(json.dumps(event, cls=npEncoder))
                ws.close()
    except Exception:
        pass
    finally:
        load_clients.remove(ws)

# WebSocket clients for retreive
retreive_clients = set()
@sockets.route('/retreive')
def retreive(ws):
    retreive_clients.add(ws)
    try:
        while not ws.closed:
            message = ws.receive()
            res = json.loads(message)
            print(f"{bcolors.WARNING} res['flag']: {res['flag']}{bcolors.ENDC}")
            if res['flag'] == 'retreive':
                simname = res['simname']
                objV = getDataV(simname=simname)
                params = objV['params']
                N = params['N']; Np = params['Np']
                u = objV['u']; v = objV['v']

                print(f"{bcolors.OKBLUE}From retreive :: N = {N} :: simname = {simname} {bcolors.ENDC}")

                objP = getDataP(simname=simname)

                P = objP['P']
                row, col, Pmax = find_max(abs(P))

                objC = getDataC(simname=simname)

                objS = {
                    "u": u,
                    "v": v,
                    "N": N,
                }

                img_src, imgP_src = generateStreamlines(objS, objP)

                objD = getDataD(simname=simname,Np=Np,Nint=int(250))

                x = np.linspace(0,1,N); y = np.linspace(0,1,N)

                Nuv = int(len(u)/2)
                cfd = {
                    "yu": [],
                    "xv": [],
                }

                y = np.linspace(0,1,Nuv)
                x = np.linspace(0,1,Nuv)

                cfd["yu"] = np.zeros((Nuv, 2))
                cfd["xv"] = np.zeros((Nuv, 2))

                for i in range(0, Nuv):
                    cfd["yu"][i][0] = y[i]
                    cfd["yu"][i][1] = u[i][Nuv]/float(params['U'])
                    cfd["xv"][i][0] = x[i]
                    cfd["xv"][i][1] = v[Nuv][i]/float(params['U'])

                x = np.linspace(0,1,N); y = np.linspace(0,1,N)

                event = {
                    "msg": f"Simulation {simname} loaded.",
                    "objV": objV,
                    "objD": objD,
                    "objC": objC,
                    "objP": objP,
                    "cfd": cfd,
                    "eye": { 'x': x[col], 'y': y[row], 'value': Pmax },
                    "img_src": img_src,
                    "imgP_src": imgP_src,
                    "params": params,
                }

                #clients = ws.handler.server.clients.values()
                #for client in clients:
                #    client.ws.send(json.dumps(event, cls=npEncoder)) # send
                ws.send(json.dumps(event, cls=npEncoder))

                session.close()
                engine.dispose()

                ws.close()
    except Exception:
        pass
    finally:
        retreive_clients.remove(ws)

""" /fvm route START """

#@sockets.on('connect', namespace='/fvm')


@app.route('/simulate', methods=['GET', 'POST'])
@cross_origin()
def simulate():
    return render_template('simulate.html')

running_loop = False

#from flask_socketio import SocketIO

""" try the other websockets flaskmm """
#@sockets.route('/start_fvm', methods=['GET', 'POST'])
#socketio = SocketIO(app)

start_fvm_clients = set()

def start_fvm(ws):
    start_fvm_clients.add(ws)
    try:
        while not ws.closed:
            message = ws.receive()
            res = json.loads(message)
            if res['flag'] == 'fvm':
                main_error = np.asfortranarray(np.ones(1000), dtype='float32')

                N = int(res['N'])

                NI = N
                NJ = N
                velNI = 2*NI + 1
                velNJ = 2*NJ + 1

                u = []
                P = []; P_prime = []
                uresid = []; vresid = []; cresid = []

                #u = np.asfortranarray(np.zeros((2*NI+1,2*NJ+1)), dtype='float32')
                v = np.asfortranarray(np.zeros((2*NI+1,2*NJ+1)), dtype='float32')

                Np = int(res['Np'])

                T = 60
                # Define fluid properites
                #mu = PropsSI('V','T',float(T)+273.15,'P',101325,'Water')
                mu = 1.12e-3
                #ro = PropsSI('D','T',float(T)+273.15,'P',101325,'Water')
                ro = 100

                # Define flow conditions
                #print(f"{bcolors.FAIL} res['Re']: {float(res['Re'])} {bcolors.ENDC}")
                #Re = float(res['Re'])
                #ubn = float(res['U'])
                #Re = float(res['Re'])
                #ubn = float(res['U'])

                ubn = float(res['U'])
                Re = float(res['Re'])

                L = (Re*mu)/(ro*ubn)

                print(":: mu:", mu, " :: ro:", ro, ":: Re:", Re, " :: ubn:", ubn)

                dx = L / NI
                dy = L / NJ

                Fu = np.zeros((velNI, velNJ))
                Fv = np.zeros((velNI, velNJ))

                """ for i in range(1,N):
                    u[i] = u[i-1] + 0.5*dy
                    v[i] = v[i-1] + 0.5*dx """

                Nmax = 2 # can scale Nmax based on coarseness of mesh
                check = True
                ctr = 0
                iter_prev = 0
                gc.collect()
                #time.sleep(10)
                t1 = time.time()

                clients = ws.handler.server.clients.values()
                print("clients: ", clients)

                #for i in range(0,10000):
                global running_loop
                running_loop = not running_loop
                print(f"{bcolors.WARNING} running loop: {running_loop}{bcolors.ENDC}")
                while running_loop:

                    time.sleep(1e-6)
                    #print("loop running: ", ctr)

                    main_error = 0
                    [u_out,v_out,P_out,P_prime_out,cresid_out,vresid_out,uresid_out,main_error,iter] = main_calcALL.main(N,Nmax,ctr,u,v,P,P_prime,mu,ro,Re,ubn)

                    u = u_out; v = v_out
                    P = P_out; P_prime = P_prime_out

                    main_error_old = main_error[-1]

                    #print(":: iter =", iter)
                    j = -1

                    uresid.append(uresid_out[j])
                    vresid.append(vresid_out[j])
                    cresid.append(cresid_out[j])

                    event = {
                        "x": ctr,
                        "total": main_error[j],
                        "pressure": cresid[j],
                        "umom": uresid[j],
                        "vmom": vresid[j],
                    }

                    # Send the message to all clients connected to this webserver
                    # process. (To support multiple processes or instances, an
                    # extra-instance storage or messaging system would be required.)

                    ws.send(json.dumps(event, cls=npEncoder))
                    #for client in clients:
                    #    client.ws.send(json.dumps(event, cls=npEncoder)) # send message back to onmessage

                    # Put the received message into the queue
                    #message_queue.put(message)

                    if main_error[iter[-1]-1] < 1e-2 or ctr > 10000:
                        if main_error[iter[-1]-1] < 1e-2:
                            print(f"{bcolors.OKGREEN}FVM converged.{bcolors.ENDC}")
                        else:
                            print(f"{bcolors.WARNING}Maximum iterations (10000) reached. FVM calculations suspended.{bcolors.ENDC}")

                        for ii in range(0, velNI):
                            for jj in range(0, velNJ):
                                Fu[ii, jj] = ro*dy*u[ii, jj]
                                Fv[ii, jj] = ro*dx*v[ii, jj]

                        for ii in range(0, NI):
                            m = 2*ii + 1
                            mvn = 2*ii + 2
                            for jj in range(0, NJ - 1):
                                q = 2*jj + 2
                                nvn = 2*jj + 2
                                Feu = Fu[m, q + 2] + np.dot(0.5,(Fv[m + 1,q + 1] - Fv[m - 1,q + 1]))
                                Fwu = Fu[m, q - 2] + np.dot(0.5,(Fv[m - 1,q - 1] - Fv[m + 1,q - 1]))
                                Fnu = np.dot(0.5,(Fv[m + 1, q - 1] + Fv[m + 1, q + 1]))
                                Fsu = np.dot(0.5,(Fv[m - 1, q - 1] + Fv[m - 1, q + 1]))
                                v[mvn, nvn] = Fnu / (np.dot(ro, dx))
                                v[m, nvn] = (Fnu + np.dot(0.5, (Feu - Fwu))) / (np.dot(ro, dx))
                                u[m, q - 1] = Fwu / (np.dot(ro, dy))
                                u[m, q + 1] = Feu / (np.dot(ro, dy))

                        for ii in range(0, NI - 1):
                            m = 2*ii + 2
                            mue = 2*ii + 2
                            for jj in range(0, NJ):
                                q = 2*jj + 1
                                nue = 2*jj + 2
                                Fnv = Fv[m + 2, q] + np.dot(0.5, (Fu[m + 1, q + 1] - Fu[m + 1, q - 1]))
                                Fsv = Fv[m - 2, q] + np.dot(0.5, (Fu[m - 1, q - 1] - Fu[m - 1, q + 1]))
                                Fev = np.dot(0.5,(Fu[m + 1,q + 1] + Fu[m - 1,q + 1]))
                                Fwv = np.dot(0.5,(Fu[m + 1,q - 1] + Fu[m - 1,q - 1]))
                                u[mue,nue] = Fev / (np.dot(ro, dy))
                                u[mue,q] = (Fev + np.dot(0.5, (Fnv - Fsv))) / (np.dot(ro, dy))
                                v[m + 1,q] = Fnv / (np.dot(ro, dy))
                                v[m - 1,q] = Fsv / (np.dot(ro, dy))

                        t1 = time.time()

                        try:
                            # delete previous default velocity data in DB
                            session.query(Velocity).filter(Velocity.simname == 'default').delete()
                            session.query(Pressure).filter(Pressure.simname == 'default').delete()
                            session.query(Displacement).filter(Displacement.simname == 'default').delete()
                            session.commit()
                        except:
                            print("default table does not exist")

                        # pack lists
                        ulists_pkg, vlists_pkg = packVel(u, v, N)

                        #for i in range(0, 2*N):
                        for i in range(0, int((2*N+1)/2)+1):
                            # update lists
                            #ulist, vlist = list
                            ulist = ulists_pkg[i]
                            vlist = vlists_pkg[i]
                            #ctr += 1

                            obj = {
                                "simname": 'default',
                                "newname": None,
                                "U": ubn,
                                "Re": Re,
                                "N": N,
                                "Np": Np,
                                "rowID": i,
                                "colID": None,
                                "axisU": { "u": ulist },
                                "axisV": { "v": vlist },
                                "axisID": 'uv',
                            }

                            saveDefaultVelocity(obj)

                        print(f"{bcolors.OKCYAN}Write time = {time.time() - t1}[s]{bcolors.ENDC}")

                        t1 = time.time()

                        obj = {
                            "U": ubn,
                            "Re": Re,
                            "N": N,
                            "Np": Np,
                            "resid": {
                                "u": uresid,
                                "v": vresid,
                                "c": cresid,
                            },
                            "src": 'cfd',
                            "simname": 'default',
                            "newname": None,
                        }

                        saveDefaultConvergence(obj)

                        print(f"{bcolors.OKCYAN}Write time = {time.time() - t1}[s]{bcolors.ENDC}")

                        t1 = time.time()

                        x = np.linspace(0,1,N); y = np.linspace(0,1,N)

                        #Pmax = abs(P).max()
                        row, col, Pmax = find_max(abs(P))

                        # pack lists
                        Plists_pkg, xlists_pkg, ylists_pkg = packPressure(P/Pmax, x, y, N)
                        #for i in range(0, 2*N):
                        for i in range(0, int((N)/2)):
                            # update lists
                            #ulist, vlist = list
                            Plist = Plists_pkg[i]
                            xlist = xlists_pkg
                            ylist = ylists_pkg
                            #ctr += 1

                            obj = {
                                "simname": 'default',
                                "newname": None,
                                "U": ubn,
                                "Re": Re,
                                "N": N,
                                "Np": Np,
                                "rowID": i,
                                "colID": None,
                                "axisP": { "p": Plist },
                                "axisX": { "x": xlist },
                                "axisY": { "y": ylist },
                                "axisID": 'p',
                            }

                            saveDefaultPressure(obj)

                        print(f"{bcolors.OKCYAN}Write time = {time.time() - t1}[s]{bcolors.ENDC}")

                        """ send u and v velocties to FE """
                        event = { 'u': u, 'v': v, 'Pmax': { 'x': x[col], 'y': y[row], 'value': Pmax } }

                        for client in clients:
                            client.ws.send(json.dumps(event, cls=npEncoder))

                        print(f"{bcolors.OKGREEN}Elapsed (CFD) = {(time.time() - t1)*1000} ms {bcolors.ENDC}")

                        running_loop = not running_loop

                        del(N,Nmax,ctr,u,v,P,P_prime)
                        gc.collect()
                        check = False
                        ws.close()
                        break

                    ctr = ctr + 1
                    #print("ctr =", ctr)
                    iter_prev = iter[-1]

            """ try:
                while not ws.closed:
                    #message = ws.receive()
                    print("message: ", message)
                    if message:
                        message_queue.put(message)
                        print("HIIIIII")
                        # Check the shared queue for messages
                        message = message_queue.get()
                        print("message in handle_start_fvm: ", message)

                        #while not ws.closed:
                        #message = ws.receive()
                        print("message: ", message)

            except Exception as e:
                print(f"WebSocket closed unexpectedly: {e}")
                # Perform cleanup and handle the closure """
    except Exception:
        pass
    finally:
        start_fvm_clients.remove(ws)

""" /start_fvm route END """

""" /genP route START """

@sockets.route('/genP')
def genP_socket(ws):
    while not ws.closed:

        clients = ws.handler.server.clients.values()

        message = ws.receive() # receive message
        if message is None:  # message is "None" if the client has closed.
            continue
        res = json.loads(message)

        simname = res['simname']

        N = int(res['N'])
        Np = int(res['Np'])
        Nint = int(res['Nint'])

        print(f"{bcolors.OKBLUE}:: N = {N} :: Np {Np} :: Nint = {Nint} :: simname = {simname} {bcolors.ENDC}")

        obj = getDataV(simname=simname)
        u = obj['u']; v = obj['v']
        params = obj['params']

        #N = params['N']; Np = params['Np']; Nint = params['Nint']

        L = 1
        x_mat, y_mat = np.mgrid[0:L:((2*N+1)*1j), 0:L:((2*N+1)*1j)]

        # pack meshgrid
        xy = np.asfortranarray((x_mat.transpose(), y_mat.transpose()), dtype='float32')

        """ Integrate Velocity Field to Generate Particle Positions """

        # Initialize particles
        solx0 = np.asfortranarray(np.random.uniform(low=0.01, high=0.99, size=(Np,)), dtype='float32')
        soly0 = np.asfortranarray(np.random.uniform(low=0.01, high=0.99, size=(Np,)), dtype='float32')

        x_out = np.asfortranarray(np.zeros((Np, Nint)), dtype='float32')
        y_out = np.asfortranarray(np.zeros((Np, Nint)), dtype='float32')

        t1 = time.time()
        for j in range(0, Np):
            #[x_out[j], y_out[j]] = genPosition.main(N, 1, Nint, u, v, solx0[j], soly0[j])
            [x_out[j], y_out[j]] = genPosition.main(N, 1, Nint, u, v, solx0[j], soly0[j])
            event = {'ctr': j}
            #print(":: event ::", event)
            #print(":: x_out[j].shape ::", x_out[j].shape
            ws.send(json.dumps(event, cls=npEncoder)) # send message back to onmessage

        print(":: Elapsed (integration, s) =", time.time() - t1)

        [xlists_pkg, ylists_pkg] = packDisp(x_out, y_out, Np, Nint)

        t1 = time.time()
        for i in range(0, int(Np/2)):
            xlist = xlists_pkg[i]
            ylist = ylists_pkg[i]
            obj = {
                    "simname": 'default',
                    "newname": None,
                    "U": params['U'],
                    "Re": params['Re'],
                    "N": params['N'],
                    "Np": params['Np'],
                    "rowID": i,
                    "colID": None,
                    "axisX": {"x": xlist},
                    "axisY": {"y": ylist},
                }


            saveDefaultDisplacement(obj)

        print(f"{bcolors.OKCYAN}Write time = {time.time() - t1}[s]{bcolors.ENDC}")

        """ Everything good up to here """

        event = {
            'x': x_out,
            'y': y_out
        }

        # Send the message to all clients connected to this webserver
        # process. (To support multiple processes or instances, an
        # extra-instance storage or messaging system would be required.)

        #for client in clients:
        #    client.ws.send(json.dumps(event, cls=npEncoder)) # send message back to onmessage

        #ws.send(json.dumps(event, cls=npEncoder)) # send message back to onmessage
        ws.close()

""" /genP route END """

""" /genS route START """

genS_clients = set()
@sockets.route('/genS', methods=['GET', 'POST'])
def genS_socket(ws):
    try:
        while not ws.closed:
            t1 = time.time()
            message = ws.receive() # receive message
            res = json.loads(message)

            if res['flag'] == 'streamline':
                event = {
                    "confirm": 0,
                }

                # Send the message to all clients connected to this webserver
                # process. (To support multiple processes or instances, an
                # extra-instance storage or messaging system would be required.)
                #for client in clients:
                #    client.ws.send(json.dumps(event, cls=npEncoder)) # send message back to onmessage
                ws.send(json.dumps(event, cls=npEncoder))

                simname = res['simname']
                N = int(res['N'])
                Nint = int(res['Nint'])

                objV = getDataV(simname=simname)
                u = objV['u']; v = objV['v']

                params = objV['params']; Np = params['Np']

                print(f"{bcolors.OKBLUE}:: N = {N} :: simname = {simname} {bcolors.ENDC}")

                objP = getDataP(simname=simname)
                P = objP['P']

                objS = {
                    "u": u,
                    "v": v,
                    "N": N,
                }

                img_src, imgP_src = generateStreamlines(objS, objP)

                objD = getDataD(simname=simname,Np=Np,Nint=Nint)

                params = objD['params']

                obj = {
                    "simname": simname,
                    "newname": None,
                    "U": None,
                    "Re": None,
                    "N": None,
                    "Np": Np,
                    "rowID": None,
                    "colID": None,
                    "axisX": {"x": None},
                    "axisY": {"y": None},
                    }

                saveDefaultDisplacement(obj)

                Nuv = int(len(u)/2)
                cfd = {
                    "yu": [],
                    "xv": [],
                }

                y = np.linspace(0,1,Nuv)
                x = np.linspace(0,1,Nuv)

                cfd["yu"] = np.zeros((Nuv, 2))
                cfd["xv"] = np.zeros((Nuv, 2))

                for i in range(0, Nuv):
                    cfd["yu"][i][0] = y[i]
                    cfd["yu"][i][1] = u[i][Nuv]/float(params['U'])
                    cfd["xv"][i][0] = x[i]
                    cfd["xv"][i][1] = v[Nuv][i]/float(params['U'])

                x = np.linspace(0,1,N); y = np.linspace(0,1,N)

                #Pmax = abs(P).max()
                row, col, Pmax = find_max(abs(P))

                print(f"{bcolors.WARNING}{row, col, Pmax, x[col], y[row]}{bcolors.ENDC}")

                event = {
                    'x': objD['x'],
                    'y': objD['y'],
                    'img_src': img_src,
                    'imgP_src': imgP_src,
                    'cfd': cfd,
                    'eye': { 'x': x[col], 'y': y[row], 'value': Pmax }
                }

                # Send the message to all clients connected to this webserver
                # process. (To support multiple processes or instances, an
                # extra-instance storage or messaging system would be required.)
                #clients = ws.handler.server.clients.values()
                #print("clients: ", clients)
                #for client in clients:
                #    client.ws.send(json.dumps(event, cls=npEncoder)) # send message back to onmessage
                ws.send(json.dumps(event, cls=npEncoder))
                ws.close()
                #for client in clients:
                #    client.ws.send(json.dumps(event, cls=npEncoder)) # send message back to onmessage
    except Exception:
        pass
    finally:
        save_clients.remove(ws)

""" /genS route END """

@sockets.route('/getRe')
def getRe_socket(ws):
    while not ws.closed:
        message = ws.receive()
        if message is None:
            continue

        LOCALDB_URI="mysql://root:@localhost:3306/gaia"
        #MONGODB_URI="mongodb://mongouser:mongo@cluster0.myvgies.mongodb.net/cfdApp?retryWrites=true&w=majority"
        URI = LOCALDB_URI

        engine = create_engine(URI, pool_pre_ping=True, echo=False)

        Session = sessionmaker(bind=engine)
        session = Session()

        db = SQLAlchemy(app)
        #print(f"{bcolors.OKGREEN} {db} {bcolors.ENDC}")

        Base = declarative_base()

        class Gaia1982(Base):
            __tablename__ = "gaia1982"
            id = db.Column(db.Integer, primary_key=True, autoincrement=True)
            Re = db.Column(db.Integer, unique=False, nullable=False)
            axisID = db.Column(db.String(2), unique=False, nullable=False)
            axisX = db.Column(db.Float, unique=False, nullable=False)
            axisVel = db.Column(db.Float, unique=False, nullable=False)
            src = db.Column(db.String(100), unique=False, nullable=False)
            def __init__(self, Re, axisID, axisX, axisVel, src):
                self.Re = Re
                self.axisID = axisID
                self.axisX = axisX
                self.axisVel = axisVel
                self.src = src
            def __repr__(self):
                return f"({self.id}) {self.Re} {self.axisID} {self.axisX} {self.axisVel} {self.src}"

        # create metadata objects for all tables
        #Base.metadata.create_all(bind=engine)
        """ N: Changed 'yu' to 'u' and 'uv' to 'v' 09/19/23 4:30PM """
        N = 120
        cfd = {
            '400': {
                "u": [],
                "v": [],
            },
            '1000': {
                "u": [],
                "v": [],
            },
            '3200': {
                "u": [],
                "v": [],
            },
            '5000': {
                "u": [],
                "v": [],
            },
        }

        gaia1982 = {
            '400': {
                'u': [],
                'v': []
            },
            '1000': {
                'u': [],
                'v': []
            },
            '3200': {
                'u': [],
                'v': []
            },
            '5000': {
                'u': [],
                'v': []
            },
        }

        Re = ['400','1000','3200','5000']
        #print(f"{bcolors.WARNING} {gaia1982[Re[0]]['u']} {bcolors.ENDC}")

        for i in range(0,len(Re)):

            """ Grab gaia1982 and cfd data """
            axisID = 'yu'
            # gaia1982 data
            stmt = select(Gaia1982.axisX, Gaia1982.axisVel, Gaia1982.Re).filter_by(
                Re=int(Re[i]),
                axisID=axisID,
                src='gaia1982')

            rows = session.execute(stmt).all()
            gaia1982[Re[i]]['u'] = np.zeros((len(rows),2))

            j = 0
            for row in rows:
                gaia1982[Re[i]]['u'][j][0] = row[0] # horizontal axis data (axisX)
                gaia1982[Re[i]]['u'][j][1] = row[1] # vertical axis data (axisVel)
                j = j + 1

            # cfd data
            stmt = select(Gaia1982.axisX, Gaia1982.axisVel, Gaia1982.Re).filter_by(
                Re=int(Re[i]),
                axisID=axisID,
                src='cfd')

            rows = session.execute(stmt).all()

            cfd[Re[i]]['u'] = np.zeros((len(rows),2))
            j = 0
            for row in rows:
                cfd[Re[i]]['u'][j][0] = row[0] # horizontal axis data (axisX)
                cfd[Re[i]]['u'][j][1] = row[1] # vertical axis data (axisVel)
                j = j + 1

            """ Grab gaia1982 and cfd v data """
            axisID = 'xv'
            # gaia1982 data
            stmt = select(Gaia1982.axisX, Gaia1982.axisVel, Gaia1982.Re).filter_by(
                Re=int(Re[i]),
                axisID=axisID,
                src='gaia1982')

            rows = session.execute(stmt).all()
            gaia1982[Re[i]]['v'] = np.zeros((len(rows),2))

            j = 0
            for row in rows:
                gaia1982[Re[i]]['v'][j][0] = row[0]
                gaia1982[Re[i]]['v'][j][1] = row[1]
                j = j + 1

            # cfd data
            stmt = select(Gaia1982.axisX, Gaia1982.axisVel, Gaia1982.Re).filter_by(
                Re=int(Re[i]),
                axisID=axisID,
                src='cfd')

            rows = session.execute(stmt).all()

            cfd[Re[i]]['v'] = np.zeros((len(rows),2))
            j = 0
            for row in rows:
                #if (Re[i] == '400'):
                #    print(f"{bcolors.WARNING} {row[0]} {row[1]} {bcolors.ENDC}")

                cfd[Re[i]]['v'][j][0] = row[0]
                cfd[Re[i]]['v'][j][1] = row[1]
                j = j + 1

        event = {'cfd': cfd, 'Gaia': gaia1982}; print(event)
        clients = ws.handler.server.clients.values()
        for client in clients:
            client.ws.send(json.dumps(event, cls=npEncoder)) # send message back to onmessage

        session.close()
        engine.dispose()

        print(f"{bcolors.OKGREEN}******************{bcolors.ENDC}")
        print(f"{bcolors.OKGREEN}session closed / engine disposed{bcolors.ENDC}")
        print(f"{bcolors.OKGREEN}******************{bcolors.ENDC}")

        ws.close()

@app.route('/', methods=['GET', 'POST'])
@cross_origin()
def index():
    return render_template('index.html')

@app.route('/test')
@cross_origin()
def test():
    return render_template('test.html')

""" def start_app():
    app.run(host='127.0.0.1', port=5000)

if __name__ == '__main__':
    threading.Thread(target=start_app).start() """

if __name__ == '__main__':
    from gunicorn.app.wsgiapp import WSGIApplication

    gunicorn_app = WSGIApplication()
    gunicorn_app.load("app:app")
    gunicorn_app.run()

""" if __name__ == "__main__":
    from gevent import pywsgi
    from geventwebsocket.handler import WebSocketHandler

    server = pywsgi.WSGIServer(('', 5000), app, handler_class=WebSocketHandler)
    server.serve_forever() """

""" if __name__ == '__main__':
    gevent.spawn(send_messages)
    server = pywsgi.WSGIServer(('127.0.0.1', 5000), app, handler=sockets.handler)
    server.serve_forever() """

""" if __name__ == '__main__':
    app.run(ssl_context=('localhost.crt', 'localhost.pem')) """