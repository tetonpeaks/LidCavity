from flask import Flask, render_template, request, jsonify, send_file, g, redirect, url_for, flash
from flask_socketio import SocketIO, emit, send, join_room, close_room

from flask_wtf import FlaskForm
from flask_wtf import CSRFProtect
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import DataRequired, Email

from flask_cors import CORS
from flask_cors import cross_origin

import traceback

import zlib

import threading
from multiprocessing import Process, Queue
from queue import Empty

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
#matplotlib.use('TkAgg') # non-blocking

#import scipy.io as sio
#import csv

from CoolProp.CoolProp import PropsSI

import main_calcALL
import genPosition

import scipy.io as sio

# create and initalize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = b'_53oi3uriq9pifpff;apl'
crsf = CSRFProtect(app)

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
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

engine = create_engine(URI, pool_pre_ping=False, echo=False)
Session = sessionmaker(bind=engine)
session = Session()

# create the database
db = SQLAlchemy(app)
db.init_app(app)

from models import Convergence
db.create_all()
from models import Velocity
db.create_all()
from models import Pressure
db.create_all()
from models import Displacement
db.create_all()
from models import StreamlineImg
db.create_all()
from models import StreamlineImgP
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

def chkImgfxn(simname, rowID, colID): #change
    #stmt = select(Velocity.simname).filter_by(simname=simname) #change
    #rows = session.
    # execute(stmt)
    #print(f"{bcolors.OKCYAN} simname (chkImgfxn):{bcolors.ENDC}{simname}")
    if (simname == 'default'):
        rows = session.query(StreamlineImg).filter_by(
                simname=simname,
                rowID=rowID,
                #colID=colID, # may not need
            )
    else:
        rows = session.query(StreamlineImg).filter_by(simname=simname)

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

def chkImgPfxn(simname, rowID, colID): #change
    #stmt = select(Velocity.simname).filter_by(simname=simname) #change
    #rows = session.
    # execute(stmt)
    #print(f"{bcolors.OKCYAN} simname (chkImgPfxn):{bcolors.ENDC}{simname}")
    if (simname == 'default'):
        rows = session.query(StreamlineImgP).filter_by(
                simname=simname,
                rowID=rowID,
                #colID=colID, # may not need
            )
    else:
        rows = session.query(StreamlineImgP).filter_by(simname=simname)

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

    print(f"{bcolors.OKGREEN} '{simname}' displacement successfully retreived.{bcolors.ENDC}")

    data = { "x": x, "y": y }

    obj = { "x": x, "y": y, "params": params}

    session.close()
    engine.dispose()

    return obj

def getDataImg(simname):

    print(f"{bcolors.OKGREEN}Retreiving {simname} StreamlineImg... {bcolors.ENDC}")

    """ retreive chunked img_src from DB """

    rows = session.query(StreamlineImg).filter_by(simname=simname)
    rows = rows.all()

    print(f"{bcolors.WARNING}len(rows): {len(rows)} {bcolors.ENDC}")

    params = {
            "U": rows[0].U,
            "Re": rows[0].Re,
            "N": rows[0].N,
            "Np": rows[0].Np,
            "Nint": int(250),
            "simname": rows[0].simname,
        }

    #for row in rows:

    img_chunks = []
    for row in rows:
        if row.img_src is not None:  # Check if img_src is not None
            img_chunks.append(row.img_src.decode())

    #print(img_chunks)

    img_src = ''.join(img_chunks)

    # Reconstruct img_src by concatenating the encoded chunks and then decoding
    #img_src = b''.join(img_chunks).decode('utf-8')  # Decoding from bytes to string

    print(f"{bcolors.OKGREEN} '{simname}' streamline image successfully retreived.{bcolors.ENDC}")

    #data = { "x": x, "y": y }

    obj = { "img_src": img_src, "params": params}

    session.close()
    engine.dispose()

    return obj

def getDataImgP(simname):

    print(f"{bcolors.OKGREEN}Retreiving {simname} StreamlineImg... {bcolors.ENDC}")

    """ retreive chunked img_src from DB """

    rows = session.query(StreamlineImgP).filter_by(simname=simname)
    rows = rows.all()

    #print(f"{bcolors.WARNING}len(rows): {len(rows)} {bcolors.ENDC}")

    params = {
            "U": rows[0].U,
            "Re": rows[0].Re,
            "N": rows[0].N,
            "Np": rows[0].Np,
            "Nint": int(250),
            "simname": rows[0].simname,
        }

    #for row in rows:

    imgP_chunks = []
    for row in rows:
        if row.imgP_src is not None:  # Check if img_src is not None
            imgP_chunks.append(row.imgP_src.decode())

    imgP_src = ''.join(imgP_chunks)

    # Reconstruct img_src by concatenating the encoded chunks and then decoding
    #img_src = b''.join(img_chunks).decode('utf-8')  # Decoding from bytes to string

    print(f"{bcolors.OKGREEN} '{simname}' streamline imageP successfully retreived.{bcolors.ENDC}")

    #data = { "x": x, "y": y }

    obj = { "imgP_src": imgP_src, "params": params}

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
    #print(f"{bcolors.WARNING} len(rows) {len(rows)} :: N {N} {bcolors.ENDC}")
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
                session.query(Displacement).filter_by(simname=simname, rowID=row.rowID).update({ Displacement.img_zlib: row.img_zlib })
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
                        img_zlib = row.img_zlib,
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
                session.query(Displacement).filter_by(simname=simname, rowID=row.rowID).update({ Displacement.img_zlib: obj['img_zlib'] })
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
                    img_zlib = obj['img_zlib'],
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

def saveDefaultStreamlineImg(obj):

    simname = obj['simname']; newname = obj['newname']
    Np = obj['Np']
    rowID = obj['rowID']; colID = obj['colID']

    flag = False
    #print(f"{bcolors.WARNING} flag, {flag}, simname: {simname}, newname: {newname}\nrowID: {rowID}, colID: {colID} {bcolors.ENDC}")
    if (newname != None):
        flag = True
        simname = newname
        chk = chkImgfxn(simname=simname, rowID=None, colID=None)
    else: chk = chkImgfxn(simname, rowID, colID)

    #print(f"{bcolors.OKCYAN} img, flag: {flag}, chk: {chk['chk']}, simname: {simname}, newname: {newname}\nrowID: {rowID}, colID: {colID} {bcolors.ENDC}")

    msg = "Unsuccessful write to database."

    """ saving or updating from save button """
    if (flag == True):
        if (chk['chk'] == True): # change
            ctr = 0
            rows = session.query(StreamlineImg).filter_by(simname='default')

            for row in rows:
                session.query(StreamlineImg).filter_by(simname=simname, rowID=row.rowID).update({ StreamlineImg.U: row.U })
                session.query(StreamlineImg).filter_by(simname=simname, rowID=row.rowID).update({ StreamlineImg.Re: row.Re })
                session.query(StreamlineImg).filter_by(simname=simname, rowID=row.rowID).update({ StreamlineImg.N: row.N })
                session.query(StreamlineImg).filter_by(simname=simname, rowID=row.rowID).update({ StreamlineImg.Np: row.Np})
                session.query(StreamlineImg).filter_by(simname=simname, rowID=row.rowID).update({ StreamlineImg.img_src: row.img_src })
                session.query(StreamlineImg).filter_by(simname=simname, rowID=row.rowID).update({ StreamlineImg.simname: simname })
                session.query(StreamlineImg).filter_by(simname=simname, rowID=row.rowID).update({ StreamlineImg.DT: datetime.datetime.utcnow() })

                session.commit()

                msg = f"{simname} updated."
                ctr += 1
            #print(f"ctr: {ctr}")
        else:
            rows = session.query(StreamlineImg).filter_by(simname='default')
            for row in rows:
                p = StreamlineImg(
                        U = row.U,
                        Re = row.Re,
                        N = row.N,
                        Np = row.Np,
                        rowID = row.rowID,
                        colID = row.colID,
                        axisID = 'sl',
                        img_src = row.img_src,
                        src = 'streamline',
                        simname = newname,
                        DT = None,
                    )

                session.add(p)

                session.commit()

            msg = f"{simname} displacment saved."
    else:
        """ saving or updating from genS """
        if (chk['chk'] == True):
            rows = session.query(StreamlineImg).filter_by(simname=simname, rowID=rowID)
            for row in rows:
                session.query(StreamlineImg).filter_by(simname=simname, rowID=row.rowID).update({ StreamlineImg.U: obj['U'] })
                session.query(StreamlineImg).filter_by(simname=simname, rowID=row.rowID).update({ StreamlineImg.Re: obj['Re'] })
                session.query(StreamlineImg).filter_by(simname=simname, rowID=row.rowID).update({ StreamlineImg.N: obj['N'] })
                session.query(StreamlineImg).filter_by(simname=simname, rowID=row.rowID).update({ StreamlineImg.Np: obj['Np'] })
                session.query(StreamlineImg).filter_by(simname=simname, rowID=row.rowID).update({ StreamlineImg.img_src: obj['img_src'] })
                session.query(StreamlineImg).filter_by(simname=simname, rowID=row.rowID).update({ StreamlineImg.simname: simname })
                session.query(StreamlineImg).filter_by(simname=simname, rowID=row.rowID).update({ StreamlineImg.DT: datetime.datetime.utcnow()})

                session.commit()

                msg = f"{simname} updated."
        else:
            p = StreamlineImg(
                    U = obj['U'],
                    Re = obj['Re'],
                    N = obj['N'],
                    Np = obj['Np'],
                    rowID = obj['rowID'],
                    colID = obj['colID'],
                    axisID = 'sl',
                    img_src = obj['img_src'],
                    src = 'streamline',
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

def saveDefaultStreamlineImgP(obj):

    simname = obj['simname']; newname = obj['newname']
    Np = obj['Np']
    rowID = obj['rowID']; colID = obj['colID']

    flag = False
    #print(f"{bcolors.WARNING} flag, {flag}, simname: {simname}, newname: {newname}\nrowID: {rowID}, colID: {colID} {bcolors.ENDC}")
    if (newname != None):
        flag = True
        simname = newname
        chk = chkImgPfxn(simname=simname, rowID=None, colID=None)
    else: chk = chkImgPfxn(simname, rowID, colID)

    #print(f"{bcolors.WARNING} imgP, flag: {flag}, chk: {chk['chk']}, simname: {simname}, newname: {newname}\nrowID: {rowID}, colID: {colID} {bcolors.ENDC}")

    msg = "Unsuccessful write to database."

    """ saving or updating from save button """
    if (flag == True):
        if (chk['chk'] == True): # change
            ctr = 0
            rows = session.query(StreamlineImgP).filter_by(simname='default')

            for row in rows:
                session.query(StreamlineImgP).filter_by(simname=simname, rowID=row.rowID).update({ StreamlineImgP.U: row.U })
                session.query(StreamlineImgP).filter_by(simname=simname, rowID=row.rowID).update({ StreamlineImgP.Re: row.Re })
                session.query(StreamlineImgP).filter_by(simname=simname, rowID=row.rowID).update({ StreamlineImgP.N: row.N })
                session.query(StreamlineImgP).filter_by(simname=simname, rowID=row.rowID).update({ StreamlineImgP.Np: row.Np})
                session.query(StreamlineImgP).filter_by(simname=simname, rowID=row.rowID).update({ StreamlineImgP.imgP_src: row.imgP_src })
                session.query(StreamlineImgP).filter_by(simname=simname, rowID=row.rowID).update({ StreamlineImgP.simname: simname })
                session.query(StreamlineImgP).filter_by(simname=simname, rowID=row.rowID).update({ StreamlineImgP.DT: datetime.datetime.utcnow() })

                session.commit()

                msg = f"{simname} updated."
                ctr += 1
            #print(f"ctr: {ctr}")
        else:
            rows = session.query(StreamlineImgP).filter_by(simname='default')
            for row in rows:
                p = StreamlineImgP(
                        U = row.U,
                        Re = row.Re,
                        N = row.N,
                        Np = row.Np,
                        rowID = row.rowID,
                        colID = row.colID,
                        axisID = 'sl',
                        imgP_src = row.imgP_src,
                        src = 'streamline',
                        simname = newname,
                        DT = datetime.datetime.utcnow(),
                    )

                session.add(p)

                session.commit()

            msg = f"{simname} displacment saved."
    else:
        """ saving or updating from genS """
        if (chk['chk'] == True):
            rows = session.query(StreamlineImgP).filter_by(simname=simname, rowID=rowID)
            for row in rows:
                session.query(StreamlineImgP).filter_by(simname=simname, rowID=row.rowID).update({ StreamlineImgP.U: obj['U'] })
                session.query(StreamlineImgP).filter_by(simname=simname, rowID=row.rowID).update({ StreamlineImgP.Re: obj['Re'] })
                session.query(StreamlineImgP).filter_by(simname=simname, rowID=row.rowID).update({ StreamlineImgP.N: obj['N'] })
                session.query(StreamlineImgP).filter_by(simname=simname, rowID=row.rowID).update({ StreamlineImgP.Np: obj['Np'] })
                session.query(StreamlineImgP).filter_by(simname=simname, rowID=row.rowID).update({ StreamlineImgP.imgP_src: obj['imgP_src'] })
                session.query(StreamlineImgP).filter_by(simname=simname, rowID=row.rowID).update({ StreamlineImgP.simname: simname })
                session.query(StreamlineImgP).filter_by(simname=simname, rowID=row.rowID).update({ StreamlineImgP.DT: datetime.datetime.utcnow()})

                session.commit()

                msg = f"{simname} updated."
        else:
            p = StreamlineImgP(
                    U = obj['U'],
                    Re = obj['Re'],
                    N = obj['N'],
                    Np = obj['Np'],
                    imgP_src = obj['imgP_src'],
                    rowID = obj['rowID'],
                    colID = obj['colID'],
                    axisID = 'sl',
                    src = 'streamline',
                    simname = simname,
                    DT = datetime.datetime.utcnow(),
                )

            session.add(p)

            session.commit()

            msg = f"{simname} saved."

    session.close()

    engine.dispose()

    if (rowID == (int(Np/2 - 1))):
        print(f"{bcolors.OKGREEN}:: {msg} ::{bcolors.ENDC}")

    return msg

#Q = Queue()

def chunk_string(string, chunk_size):
    return [string[i:i + chunk_size] for i in range(0, len(string), chunk_size)]

def generateStreamlines(objS, objP):
    t1 = time.time()

    u = objS['u']; v = objS['v']; P = objP['P']
    N = objS['N']

    L = 1

    """ Generate 2D pressure field plot """

    xP = np.linspace(0, L, N)
    yP = np.linspace(0, L, N)
    XP, YP = np.meshgrid(xP, yP)

    # Create the plot
    imgP_buf = io.BytesIO()
    figP = plt.figure()
    axP = plt.subplot(111)

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
    plt.savefig(imgP_buf, format='png', dpi=300, bbox_inches='tight', pad_inches=0, transparent=True)

    encoded_string = base64.b64encode(imgP_buf.getvalue())
    # must send decoded string
    decoded_string = encoded_string.decode()
    imgP_src = "data:image/png;base64,{0}".format(decoded_string)
    plt.close(figP)

    imgP_chunks = chunk_string(imgP_src, 60000)

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

    #plt.ion()

    ax.streamplot(x, y, u_n, v_n,
        density = 3,
        linewidth = 0.6,
        color = speed,
        cmap = 'gist_rainbow',
        broken_streamlines = False,
        integration_direction = 'both',
    )

    #plt.pause(0.001)

    #plt.show(block=False)
    #ax.set_xlabel('x'); ax.set_ylabel('y')
    ax.set_xlim((0, L)); ax.set_ylim((0, L))
    ax.set_aspect('equal')
    ax.get_xaxis().set_visible(False); ax.get_yaxis().set_visible(False)
    plt.axis('off')
    plt.savefig(img_buf, format='png', dpi=300, bbox_inches='tight', pad_inches=0, transparent=True)
    #im = Image.open(img_buf)
    #print(f"{bcolors.WARNING} type(img_buf): {bcolors.ENDC}{len(img_buf.getvalue())}")

    # image is binary
    #encoded_string = base64.b64encode(img.read())
    encoded_string = base64.b64encode(img_buf.getvalue())

    #with open('./media/Streamplot.png', 'rb') as image_file:
    #    encoded_string = base64.b64encode(image_file.read())

    # must send decoded string
    decoded_string = encoded_string.decode()
    img_src = "data:image/png;base64,{0}".format(decoded_string)
    plt.close(fig)

    # Convert the string to bytes
    #string_bytes = decoded_string.encode()

    # Compress the bytes
    #compressed_data = zlib.compress(string_bytes)
    #img_src = compressed_data

    img_chunks = chunk_string(img_src, 60000)

    #print(f"{bcolors.WARNING}len(img_src): {len(img_src)}{bcolors.ENDC}")
    #for img_chunk in img_chunks:
        #print(f"{bcolors.WARNING}len(img_chunk): {len(img_chunk)}{bcolors.ENDC}")
    """ The length of all data in img_chunks is verified """
    #print(f"{bcolors.WARNING}len(img_chunks): {len(img_chunks)}{bcolors.ENDC}")
    #print(f"{bcolors.WARNING}len(imgP_chunks): {len(imgP_chunks)}{bcolors.ENDC}")

    # To decompress the data, you can use zlib.decompress
    #decompressed_data = zlib.decompress(compressed_data)

    # Convert the decompressed bytes back to a string
    #decompressed_string = decompressed_data.decode()

    #print(f"{bcolors.WARNING}:: len(encoded_string): {len(encoded_string)} \n:: len(decoded): {len(decoded_string)}\n:: len(img_src): {len(img_src)}\n:: len(compressed_data): {len(compressed_data)}\n:: len(decompressed_data): {len(decompressed_data)}{bcolors.ENDC}")

    #print(len(img_src))

    return img_chunks, imgP_chunks, img_src, imgP_src

def find_max(matrix):
    max_value = float("-inf")
    max_row, max_col = -1, -1

    for row in range(len(matrix)):
        for col in range(len(matrix[row])):
            if matrix[row][col] > max_value:
                max_value = matrix[row][col]
                max_row, max_col = row, col

    return max_row, max_col, max_value

socketio = SocketIO(app, reconnection=True)

class LoginForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Login')

@app.route('/')
def root():
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
@cross_origin()
def login():
    form = LoginForm()

    if request.method == 'POST' and form.validate_on_submit():
        # Perform authentication (replace with your authentication logic)
        username = form.username.data
        password = form.password.data

        # Your authentication logic goes here

        if username == '1' and password == '1':
            flash('Login successful!', 'success')
            return redirect(url_for('test'))
        else:
            flash('Invalid username or password', 'danger')

    return render_template('login.html', form=form)

class RegistrationForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    email = StringField('Email', validators=[DataRequired(), Email()])
    submit = SubmitField('Register')

@app.route('/register', methods=['GET', 'POST'])
def register():
    form = RegistrationForm()

    if request.method == 'POST' and form.validate_on_submit():
        # Add registration logic here (e.g., create a new user in the database)
        flash('Registration successful! You can now log in.', 'success')
        return redirect(url_for('login'))

    return render_template('register.html', form=form)

@app.route('/index', methods=['GET', 'POST'])
@cross_origin()
def index():
    return render_template('index.html')

@app.route('/simulate', methods=['GET', 'POST'])
@cross_origin()
def simulate():
    return render_template('simulate.html')

@app.route('/get_pdf')
def get_pdf():
    # Replace 'path/to/your/pdf.pdf' with the actual path to your PDF file
    pdf_path = '/Users/stephenhodson/Downloads/SIMPLE-ALGORITHM-FOR-SYMMETRIC-DRIVEN-CAVITY-NEW.pdf'
    #pdf_path = '/Users/stephenhodson/FSO/Portfolio/heroku_lidcavity_github/LidCavity/templates/Stephen-Hodson-CV-GSR.pdf'
    #pdf_path = '/Users/stephenhodson/FSO/Portfolio/heroku_lidcavity_github/LidCavity/templates/SIMPLE-ALGORITHM-FOR-SYMMETRIC-DRIVEN-CAVITY-NEW.pdf'
    return send_file(pdf_path, mimetype='application/pdf')

@app.route('/test')
@cross_origin()
def test():
    return render_template('gptGrid.html')

chk_clients = set()

@socketio.on('connect', namespace='/chk')
def chk_connect():
    print("CONNECTED to chk: ", request.sid)
     # Get the client's SID
    sid = request.sid
    chk_clients.add(sid)
    emit('sid', {'sid': sid}, room=request.sid)

@socketio.on('disconnect', namespace='/chk')
def chk_disconnect():
    print("DISCONNECTED from chk")
    chk_clients.remove(request.sid)

@socketio.on('reconnect', namespace='/chk')
def chk_handle_reconnect():
    # Handle reconnection logic (e.g., resuming simulation)
    print("Client reconnected to /chk")

@socketio.on('message', namespace='/chk')
def chk(message):
    try:
        socketio.sleep(0.5)

        res = message

        simname = res['simname']

        obj = chkVfxn(simname=simname, rowID=1, colID=None)

        event = {"msg": obj['msg'], "chk": obj['chk']}

        emit('response', json.dumps(event, cls=npEncoder), room=request.sid)  # Emit to a specific client
    except Exception as e:
        print(f"An exception occurred: {str(e)}")
        traceback.print_exc()
    finally:
        print("poop /chk")

save_clients = set()

@socketio.on('connect', namespace='/save')
def save_connect():
    print("CONNECTED tosave: ", request.sid)
     # Get the client's SID
    sid = request.sid
    save_clients.add(sid)
    emit('sid', {'sid': sid}, room=request.sid)

@socketio.on('disconnect', namespace='save')
def save_disconnect():
    print("DISCONNECTED fromsave")
    save_clients.remove(request.sid)

@socketio.on('reconnect', namespace='save')
def save_handle_reconnect():
    # Handle reconnection logic (e.g., resuming simulation)
    print("Client reconnected to save")

@socketio.on('message', namespace='/save')
def save(message):
    try:
        socketio.sleep(0.5)

        res = message

        print(f"{bcolors.WARNING} res: {res['flag']} {bcolors.ENDC}")

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
            "img_src": None,
            "src": 'streamline',
        }

        msg = saveDefaultStreamlineImg(obj)

        print(f"{bcolors.OKCYAN}Write time = {time.time() - t1}[s]{bcolors.ENDC}")

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
            "imgP_src": None,
            "src": 'streamline',
        }

        msg = saveDefaultStreamlineImgP(obj)

        print(f"{bcolors.OKCYAN}Write time = {time.time() - t1}[s]{bcolors.ENDC}")

        #print(f"{bcolors.OKGREEN}:: {msg} ::{bcolors.ENDC}")

        event = {"msg": msg}

        emit('response', json.dumps(event, cls=npEncoder), room=request.sid)  # Emit to a specific client

    except Exception as e:
        print(f"An exception occurred: {str(e)}")
        traceback.print_exc()
    finally:
        print("poop /save")

load_clients = set()

@socketio.on('connect', namespace='/load')
def connect_load():
    print("CONNECTED to load: ", request.sid)

    try:
        sid = request.sid
        load_clients.add(sid)

        simnames = getSims()
        print("simnames: ", simnames)

        emit('response', {'sid': sid, "simnames": simnames}, room=request.sid)
    except Exception as e:
        print(f"An exception occurred: {str(e)}")
        traceback.print_exc()
    finally:
        print("poop connect_load")

@socketio.on('disconnect', namespace='/load')
def disconnect_load():
    print("DISCONNECTED from load")
    load_clients.remove(request.sid)

@socketio.on('reconnect', namespace='/load')
def handle_reconnect_load():
    # Handle reconnection logic (e.g., resuming simulation)
    print("Client reconnected to /load")

@socketio.on('close_connection')
def close_connection_load(data):
    # Close a specific connection by SID
    sid_to_close = data['sid']  # Replace with the SID of the client to close
    close_room(sid_to_close)

retreive_clients = set()

@socketio.on('connect', namespace='/retreive')
def connect_retreive():

    try:
        sid = request.sid
        retreive_clients.add(sid)

        #emit('response',
        #     {"sid": sid, "msg": f"Client sid: {sid} connected"},
        #     room=request.sid)
    except Exception as e:
        print(f"An exception occurred: {str(e)}")
        traceback.print_exc()
        #pass
    finally:
        print("poop retreive")

    # Add the client to start_fvm room (not needed for now)
    #join_room('start_fvm', sid=sid)

    #emit('sid', {'sid': sid}, room=sid)

@socketio.on('disconnect', namespace='/retreive')
def disconnect_retreive():
    print("DISCONNECTED")

@socketio.on('reconnect', namespace='/retreive')
def handle_reconnect_reteive():
    # Handle reconnection logic (e.g., resuming simulation)
    print("Client reconnected to /retreive")

@socketio.on('close_connection')
def close_connection_retreive(data):
    # Close a specific connection by SID
    sid_to_close = data['sid']  # Replace with the SID of the client to close
    close_room(sid_to_close)

# WebSocket clients for retreive
@socketio.on('message', namespace='/retreive')
def retreive(message):
    print("messaga retreive: ", message)
    try:
        res = message

        print(f"{bcolors.WARNING} res['flag']: {res['flag']}{bcolors.ENDC}")

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

        objImg = getDataImg(simname)
        objImgP = getDataImgP(simname)

        event = {
            "msg": f"Simulation {simname} loaded.",
            "objV": objV,
            "objD": objD,
            "objC": objC,
            "objP": objP,
            "cfd": cfd,
            "eye": { 'x': x[col], 'y': y[row], 'value': Pmax },
            "img_src": objImg['img_src'],
            "imgP_src": objImgP['imgP_src'],
            "params": params,
            "sid": request.sid,
        }

        emit('response', json.dumps(event, cls=npEncoder), room=request.sid)  # Emit to a specific client

        session.close()
        engine.dispose()

    except Exception as e:
        print(f"An exception occurred: {str(e)}")
        traceback.print_exc()
    finally:
        print("poop /retreive")

""" /fvm route START """

start_fvm_clients = set()

@socketio.on('connect', namespace='/start_fvm')
def start_fvm_connect():
    print("CONNECTED to start_fvm: ", request.sid)
     # Get the client's SID
    sid = request.sid
    start_fvm_clients.add(sid)
    emit('sid', {'sid': sid}, room=request.sid)

@socketio.on('disconnect', namespace='/start_fvm')
def start_fvm_disconnect():
    print("DISCONNECTED from start_fvm")
    start_fvm_clients.remove(request.sid)

@socketio.on('reconnect', namespace='/start_fvm')
def handle_reconnect():
    # Handle reconnection logic (e.g., resuming simulation)
    print("Client reconnected to /start_fvm")

@socketio.on('close_connection', namespace='/start_fvm')
def start_fvm_close_connection():
    close_room(request.sid)

running_loop = False

@socketio.on('message', namespace='/start_fvm')
#@sockets.route('/start_fvm', methods=['GET', 'POST'])
def start_fvm(message):
    try:
        # Check if there are still participants in the '/test' namespace.
        socketio.sleep(1)  # Sleep for 1 second between checks

        res = message
        #if res['flag'] == 'fvm':
        print("message: ", res)
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

        #clients = ws.handler.server.clients.values()
        #print("clients: ", clients)

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
                "sid": request.sid,
            }

            # Send the message to all clients connected to this webserver
            # process. (To support multiple processes or instances, an
            # extra-instance storage or messaging system would be required.)

            emit('response', json.dumps(event, cls=npEncoder), room=request.sid)  # Emit to a specific client
            #ws.send(json.dumps(event, cls=npEncoder))
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

                """ send u and v velocties to frontend """
                event = { 'u': u, 'v': v, 'Pmax': { 'x': x[col], 'y': y[row], 'value': Pmax } }
                emit('response', json.dumps(event, cls=npEncoder), room=request.sid)  # Emit to a specific client

                #for client in clients:
                #    client.ws.send(json.dumps(event, cls=npEncoder))

                print(f"{bcolors.OKGREEN}Elapsed (CFD) = {(time.time() - t1)*1000} ms {bcolors.ENDC}")

                running_loop = not running_loop

                del(N,Nmax,ctr,u,v,P,P_prime)
                gc.collect()
                check = False
                #ws.close()
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
    except Exception as e:
        print(f"An exception occurred: {str(e)}")
        traceback.print_exc()
    finally:
        print("poop /start_fvm")

""" /start_fvm route END """

""" /genP route START """

genP_clients = set()

@socketio.on('connect', namespace='/genP')
def genP_connect():
    print("CONNECTED to genP: ", request.sid)
     # Get the client's SID
    sid = request.sid
    genP_clients.add(sid)
    emit('sid', {'sid': sid}, room=request.sid)

@socketio.on('disconnect', namespace='/genP')
def genP_disconnect():
    print("DISCONNECTED from genP")
    genP_clients.remove(request.sid)

@socketio.on('reconnect', namespace='/genP')
def genP_handle_reconnect():
    # Handle reconnection logic (e.g., resuming simulation)
    print("Client reconnected to /genP")

@socketio.on('close_connection', namespace='/genP')
def genP_close_connection(data):
    # Close a specific connection by SID
    sid_to_close = data['sid']  # Replace with the SID of the client to close
    close_room(sid_to_close)

@socketio.on('message', namespace='/genP')
def genP(message):
    try:
        socketio.sleep(0.5)

        res = message

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
            event = {'ctr': j, 'sid': request.sid}

            emit('response', json.dumps(event, cls=npEncoder), room=request.sid)  # Emit to a specific client

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
                    "img_zlib": None,
                }

            saveDefaultDisplacement(obj)

        print(f"{bcolors.OKCYAN}Write time = {time.time() - t1}[s]{bcolors.ENDC}")

        #event = {
        #    'x': x_out,
        #    'y': y_out
        #}
        #emit('response', json.dumps(event, cls=npEncoder), room=request.sid)  # Emit to a specific client
    except Exception as e:
        print(f"An exception occurred: {str(e)}")
        traceback.print_exc()
    finally:
        print("poop /genP")

genS_clients = set()

@socketio.on('connect', namespace='/genS')
def genS_connect():
    print("CONNECTED to genS: ", request.sid)
     # Get the client's SID
    sid = request.sid
    genS_clients.add(sid)
    emit('sid', {'sid': sid}, room=request.sid)

@socketio.on('disconnect', namespace='/genS')
def genS_disconnect():
    print("DISCONNECTED from genS")
    genS_clients.remove(request.sid)

@socketio.on('reconnect', namespace='/genS')
def genS_handle_reconnect():
    # Handle reconnection logic (e.g., resuming simulation)
    print("Client reconnected to /genS")

@socketio.on('close_connection', namespace='/genS')
def genS_close_connection(data):
    # Close a specific connection by SID
    sid_to_close = data['sid']  # Replace with the SID of the client to close
    close_room(sid_to_close)

@socketio.on('message', namespace='/genS')
def genS(message):
    try:
        socketio.sleep(0.5)

        res = message

        #event = {
        #            "confirm": 0,
        #}
        #emit('response', json.dumps(event, cls=npEncoder), room=request.sid)  # Emit to a specific client

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

        objD = getDataD(simname=simname,Np=Np,Nint=Nint)

        params = objD['params']

        img_chunks, imgP_chunks, img_src, imgP_src = generateStreamlines(objS, objP)

        for i, chunk in enumerate(img_chunks):
            obj = {
                    "simname": 'default',
                    "newname": None,
                    "U": params['U'],
                    "Re": params['Re'],
                    "N": N,
                    "Np": Np,
                    "rowID": i,
                    "colID": None,
                    "axisID": "sl",
                    "img_src": chunk.encode('utf-8'),
                    "src": "streamline",
                }

            saveDefaultStreamlineImg(obj)

        for j, chunkP in enumerate(imgP_chunks):
            obj = {
                    "simname": 'default',
                    "newname": None,
                    "U": params['U'],
                    "Re": params['Re'],
                    "N": N,
                    "Np": Np,
                    "rowID": j,
                    "colID": None,
                    "axisID": "sl",
                    "imgP_src": chunkP.encode('utf-8'),
                    "src": "streamline",
                }

            saveDefaultStreamlineImgP(obj)

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

        #print(f"{bcolors.WARNING}{row, col, Pmax, x[col], y[row]}{bcolors.ENDC}")

        event = {
            'x': objD['x'],
            'y': objD['y'],
            'img_src': img_src,
            'imgP_src': imgP_src,
            'cfd': cfd,
            'eye': { 'x': x[col], 'y': y[row], 'value': Pmax }
        }

        emit('response', json.dumps(event, cls=npEncoder), room=request.sid)  # Emit to a specific client
    except Exception as e:
        print(f"An exception occurred: {str(e)}")
        traceback.print_exc()
    finally:
        print("poop /genS")

getRe_clients = set()

@socketio.on('connect', namespace='/getRe')
def getRe_connect():
    print("CONNECTED to getRe: ", request.sid)
     # Get the client's SID
    sid = request.sid
    getRe_clients.add(sid)
    emit('sid', {'sid': sid}, room=request.sid)

@socketio.on('disconnect', namespace='/getRe')
def getRe_disconnect():
    print("DISCONNECTED from getRe")
    getRe_clients.remove(request.sid)

@socketio.on('reconnect', namespace='/getRe')
def getRe_handle_reconnect():
    # Handle reconnection logic (e.g., resuming simulation)
    print("Client reconnected to /getRe")

@socketio.on('close_connection', namespace='/getRe')
def getRe_close_connection(data):
    # Close a specific connection by SID
    sid_to_close = data['sid']  # Replace with the SID of the client to close
    close_room(sid_to_close)

@socketio.on('message', namespace='/getRe')
def getRe_socket(message):
    print(f"{bcolors.WARNING} HI FROM /getRe {bcolors.ENDC}")
    try:

        socketio.sleep(0.5)

        res = message

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

        event = {'cfd': cfd, 'Gaia': gaia1982}

        emit('response', json.dumps(event, cls=npEncoder), room=request.sid)  # Emit to a specific client

        session.close()
        engine.dispose()

        print(f"{bcolors.OKGREEN}******************{bcolors.ENDC}")
        print(f"{bcolors.OKGREEN}session closed / engine disposed{bcolors.ENDC}")
        print(f"{bcolors.OKGREEN}******************{bcolors.ENDC}")
    except Exception as e:
        print(f"An exception occurred: {str(e)}")
        traceback.print_exc()
    finally:
        print("poop /getRe")

@app.route('/chat')
@cross_origin()
def chat():
    return render_template('chat.html')

""" def start_app():
    app.run(host='127.0.0.1', port=5000)

if __name__ == '__main__':
    threading.Thread(target=start_app).start() """

def background_thread():
    while True:
        # Simulate background data processing
        #socketio.sleep(2)  # Use socketio.sleep instead of time.sleep
        socketio.emit('background_data', 'Background data message', namespace='/start_fvm')

# Route to check if multithreading is active
@app.route('/check_multithreading')
def check_multithreading():
    if threading.active_count() > 1:
        return jsonify(message="Multithreading is active")
    else:
        return jsonify(message="Multithreading is not active")

if __name__ == '__main__':
    # Create and start a separate thread for background processing
    bg_thread = threading.Thread(target=background_thread)
    bg_thread.start()

    # Start the Flask-SocketIO app with Gevent
    socketio.run(app, debug=True, host='0.0.0.0', port=8080)

""" if __name__ == '__main__':
    from gunicorn.app.wsgiapp import WSGIApplication

    gunicorn_app = WSGIApplication()
    gunicorn_app.load("app:app")
    gunicorn_app.run() """

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