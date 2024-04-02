import os
from urllib.parse import quote
import secrets
import datetime
from cryptography.fernet import Fernet, InvalidToken

from flask import g

from flask import Flask, render_template, request, jsonify, send_file, g, redirect, url_for, flash, get_flashed_messages
from flask_socketio import SocketIO, emit, send, join_room, close_room, disconnect

from flask_wtf import FlaskForm
from flask_wtf import CSRFProtect
from wtforms import StringField, PasswordField, SubmitField, ValidationError, BooleanField
from wtforms.validators import DataRequired, Email, Length, EqualTo, Regexp
from flask_login import current_user, LoginManager, UserMixin
from flask_login import login_user, login_required, logout_user, AnonymousUserMixin
from flask import current_app

from flask_cors import CORS
from flask_cors import cross_origin

from sqlalchemy import and_
from sqlalchemy.exc import IntegrityError


from config import LocalConfig, ProdConfig
from flask_mail import Mail, Message

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

from manage import app, db, session, engine

from models import User
from models import Convergence
from models import Velocity
from models import Pressure
from models import Displacement
from models import StreamlineImg
from models import StreamlineImgP
from models import Gaia1982

SECRET_KEY = os.environ.get('SECRET_KEY')
app.config['LOGIN_VIEW'] = 'login'

#app.config['PERMANENT_SESSION_LIFETIME'] = datetime.timedelta(minutes=1)
app.permanent_session_lifetime = datetime.timedelta(minutes=1)

# Create an instance of LoginManager
login_manager = LoginManager(app)

# Import the User model and user_loader callback function
from models import load_user

# Register the user_loader callback function
login_manager.user_loader(load_user)

# Configure the login view (optional)
login_manager.login_view = 'login'

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
def chkVfxn(simname, user_id, rowID, colID, N): #change
    #stmt = select(Velocity.simname).filter_by(simname=simname) #change
    #rows = session.
    # execute(stmt)

    chk = False; rows = None

    if (simname == f"default_{user_id}"):

        # Define your conditions
        #condition1 = Velocity.user_id == user_id
        #condition3 = Velocity.rowID == int(rowID)
        condition2 = Velocity.simname == simname
        combined_condition = and_(condition2)

        # Apply the filter to the query
        result = session.query(Velocity).filter(combined_condition).all()

        if (result):
            chk = False

        """ try:
            print(f"type(rowID): {type(rowID)}")

            results = session.query(Velocity).filter(Velocity.rowID == N).all()

            for result in results:
                print(f"rowID: {result.rowID}, user_id: {result.user_id}, simname: {result.simname}")
        except Exception as e:
            print(f"Error: {e}") """

        #session.query(Velocity).filter(Velocity.simname == 'default')

        """ rows = session.query(Velocity).filter_by(
                user_id=user_id,
                simname=simname,
                #rowID=rowID,
                #colID=colID, # may not need
            ).all() """

    else:
        rows = session.query(Velocity).filter_by(user_id=user_id,simname=simname).all()

    """ can be one-liner """
    if (rows):
        chk = True
    #for row in rows:
    #    chk = True
    #if (results):
    #    chk = True

    msg = None
    if (chk == True):
        msg = f"The simulation already exists. Would you like to update '{simname}'?"

    session.close()
    engine.dispose()

    return {"msg": msg, "chk": chk}

def chkPfxn(simname, user_id, rowID, colID, N): #change
    #stmt = select(Velocity.simname).filter_by(simname=simname) #change
    #rows = session.
    # execute(stmt)

    chk = False; rows = None

    if (simname == f"default_{user_id}"):
        condition2 = Pressure.simname == simname
        combined_condition = and_(condition2)

        # Apply the filter to the query
        result = session.query(Pressure).filter(combined_condition).all()

        if (result):
            chk = False
    else:
        rows = session.query(Pressure).filter_by(user_id=user_id,simname=simname).all()


    if (rows): chk = True
    """ can be one-liner """
    """ for row in rows:
        chk = True """

    msg = None
    if (chk == True):
        msg = f"The simulation already exists. Would you like to update '{simname}'?"

    session.close()
    engine.dispose()

    return {"msg": msg, "chk": chk}

def chkCfxn(simname, user_id, rowID, colID): #change
    #stmt = select(Velocity.simname).filter_by(simname=simname) #change
    #rows = session.
    # execute(stmt)

    chk = False; rows = None

    if (simname == f"default_{user_id}"):
        condition2 = Convergence.simname == simname
        combined_condition = and_(condition2)

        # Apply the filter to the query
        result = session.query(Convergence).filter(combined_condition).all()

        if (result):
            chk = False
    else:
        rows = session.query(Convergence).filter_by(user_id=user_id,simname=simname).all()


    if (rows): chk = True
    """ can be one-liner """
    """ for row in rows:
        chk = True """

    msg = None
    if (chk == True):
        msg = f"The simulation already exists. Would you like to update '{simname}'?"

    session.close()
    engine.dispose()

    return {"msg": msg, "chk": chk}

def chkDfxn(simname, user_id, rowID, colID): #change

    chk = False; rows = None

    if (simname == f"default_{user_id}"):
        condition2 = Displacement.simname == simname
        combined_condition = and_(condition2)

        # Apply the filter to the query
        result = session.query(Displacement).filter(combined_condition).all()

        if (result):
            chk = False
    else:
        rows = session.query(Displacement).filter_by(user_id=user_id,simname=simname).all()


    if (rows): chk = True

    msg = None
    if (chk == True):
        msg = f"The simulation already exists. Would you like to update '{simname}'?"

    session.close()
    engine.dispose()

    return {"msg": msg, "chk": chk}

def chkImgfxn(simname, user_id, rowID, colID): #change

    chk = False; rows = None

    if (simname == f"default_{user_id}"):
        condition2 = StreamlineImg.simname == simname
        combined_condition = and_(condition2)

        # Apply the filter to the query
        result = session.query(StreamlineImg).filter(combined_condition).all()

        if (result):
            chk = False
    else:
        rows = session.query(StreamlineImg).filter_by(user_id=user_id,simname=simname).all()


    if (rows): chk = True

    msg = None
    if (chk == True):
        msg = f"The simulation already exists. Would you like to update '{simname}'?"

    session.close()
    engine.dispose()

    return {"msg": msg, "chk": chk}

def chkImgPfxn(simname, user_id, rowID, colID): #change

    chk = False; rows = None

    if (simname == f"default_{user_id}"):
        condition2 = StreamlineImgP.simname == simname
        combined_condition = and_(condition2)

        # Apply the filter to the query
        result = session.query(StreamlineImgP).filter(combined_condition).all()

        if (result):
            chk = False
    else:
        rows = session.query(StreamlineImgP).filter_by(user_id=user_id,simname=simname).all()


    if (rows): chk = True

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

    # Access the current user
    if current_user.is_authenticated:
        user_id = current_user.get_id()  # Get the user ID
        username = current_user.username  # Get the username
        print(f"{bcolors.WARNING}user_id{bcolors.ENDC}: {user_id}, {bcolors.WARNING}username{bcolors.ENDC}: {username}")
    else:
        print("No user is currently authenticated.")

    #rows = session.query(Convergence.simname)
    #rows = rows.all()
    #simnames = [row[0] for row in rows]

    rows = session.query(Convergence).filter_by(user_id=user_id).all()

    #print(f"{bcolors.WARNING}rows: {bcolors.ENDC}{rows}")

    # Extract the values from the results
    simnames = [row.simname for row in rows]
    simnames = [simname for simname in simnames if 'default' not in simname]

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

    user_id = obj['user_id']; simname = obj['simname']; newname = obj['newname']; N = obj['N']
    resid = obj['resid']

    flag = False
    #print(f"{bcolors.WARNING} flag, {flag}, simname: {simname}, newname: {newname}{bcolors.ENDC}")
    if (newname != None):
        flag = True
        simname = newname
        chk = chkCfxn(simname=simname, user_id=user_id, rowID=None, colID=None)
    else: chk = chkCfxn(simname, user_id, None, None)

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

                session.query(Convergence).filter_by(simname = simname).update({ Convergence.username: row.username })
                session.query(Convergence).filter_by(simname = simname).update({ Convergence.user_id: row.user_id })

                session.commit()

                msg = f"{simname} updated."
                ctr += 1
            #print(f"ctr: {ctr}")
        else:
            rows = session.query(Convergence).filter_by(simname=f"default_{user_id}")

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
                        username = row.username,
                        user_id = row.user_id,
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

                session.query(Convergence).filter_by(simname=simname).update({ Convergence.user_id: obj['user_id'] })
                session.query(Convergence).filter_by(simname=simname).update({ Convergence.username: obj['username'] })

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
                    username=obj['username'],
                    user_id=obj['user_id'],
                )

            session.add(p)

            session.commit()

            msg = f"{simname} saved."

    session.close()

    engine.dispose()

    print(f"{bcolors.OKGREEN}:: {msg} ::{bcolors.ENDC}")

    return msg

def saveDefaultVelocity(obj):

    user_id = obj['user_id']; simname = obj['simname']; newname = obj['newname']; N = obj['N']
    rowID = obj['rowID']; colID = obj['colID']
    flag = False
    #print(f"{bcolors.WARNING} flag, {flag}, simname: {simname}, newname: {newname}\nrowID: {rowID}, colID: {colID} {bcolors.ENDC}")
    if (newname != None):
        flag = True
        simname = newname
        chk = chkVfxn(simname=simname, user_id=user_id, rowID=None, colID=None, N=N)
    else: chk = chkVfxn(simname, user_id, rowID, colID, N)

    print(f"{bcolors.FAIL} user_id: {user_id}, flag: {flag}, chk: {chk['chk']}, simname: {simname}, newname: {newname}\nrowID: {rowID}, colID: {colID} {bcolors.ENDC}")

    msg = "Unsuccessful write to database."

    """ saving or updating from save button """
    if (flag == True):
        if (chk['chk'] == True): # change
            ctr = 0
            rows = session.query(Velocity).filter_by(simname=f"default_{user_id}")
            for row in rows:
                session.query(Velocity).filter_by(simname = simname, rowID=row.rowID).update({ Velocity.U: row.U })
                session.query(Velocity).filter_by(simname = simname, rowID=row.rowID).update({ Velocity.Re: row.Re })
                session.query(Velocity).filter_by(simname = simname, rowID=row.rowID).update({ Velocity.N: row.N })
                session.query(Velocity).filter_by(simname = simname, rowID=row.rowID).update({ Velocity.Np: row.Np})
                session.query(Velocity).filter_by(simname = simname, rowID=row.rowID).update({ Velocity.axisU: row.axisU })
                session.query(Velocity).filter_by(simname = simname, rowID=row.rowID).update({ Velocity.axisV: row.axisV })
                session.query(Velocity).filter_by(simname = simname, rowID=row.rowID).update({ Velocity.simname: simname })
                session.query(Velocity).filter_by(simname = simname, rowID=row.rowID).update({ Velocity.DT: datetime.datetime.utcnow() })

                session.query(Velocity).filter_by(simname=simname).update({ Velocity.user_id: row.user_id })
                session.query(Velocity).filter_by(simname=simname).update({ Velocity.username: row.username })

                session.commit()

                msg = f"{simname} updated."
                ctr += 1
            #print(f"ctr: {ctr}")
        else:
            rows = session.query(Velocity).filter_by(simname=f"default_{user_id}").all()

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
                        username = row.username,
                        user_id = row.user_id,
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

                session.query(Velocity).filter_by(simname=simname).update({ Velocity.user_id: obj['user_id'] })
                session.query(Velocity).filter_by(simname=simname).update({ Velocity.username: obj['username'] })

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
                    username = obj['username'],
                    user_id = obj['user_id'],
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
    user_id = obj['user_id']; simname = obj['simname']; newname = obj['newname']; N = obj['N']
    rowID = obj['rowID']; colID = obj['colID']
    flag = False
    #print(f"{bcolors.WARNING} flag, {flag}, simname: {simname}, newname: {newname}\nrowID: {rowID}, colID: {colID} {bcolors.ENDC}")
    if (newname != None):
        flag = True
        simname = newname
        chk = chkPfxn(simname=simname, user_id=user_id, rowID=None, colID=None, N=N)
    else: chk = chkPfxn(simname, user_id, rowID, colID, N)

    #print(f"{bcolors.FAIL} flag: {flag}, chk: {chk['chk']}, simname: {simname}, newname: {newname}\nrowID: {rowID}, colID: {colID} {bcolors.ENDC}")

    msg = "Unsuccessful write to database."

    """ saving or updating from save button """
    if (flag == True):
        if (chk['chk'] == True): # change
            ctr = 0
            rows = session.query(Pressure).filter_by(simname=f"default_{user_id}")
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

                session.query(Pressure).filter_by(simname=simname).update({ Pressure.user_id: row.user_id })
                session.query(Pressure).filter_by(simname=simname).update({ Pressure.username: row.username })

                session.commit()

                msg = f"{simname} updated."
                ctr += 1
            #print(f"ctr: {ctr}")
        else:
            rows = session.query(Pressure).filter_by(simname=f"default_{user_id}")

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
                        username = row.username,
                        user_id = row.user_id,
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

                session.query(Pressure).filter_by(simname=simname, rowID=row.rowID).update({ Pressure.username: obj['username'] })
                session.query(Pressure).filter_by(simname=simname, rowID=row.rowID).update({ Pressure.user_id: obj['user_id'] })

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
                    username=obj['username'],
                    user_id=obj['user_id'],
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

    user_id = obj['user_id']; simname = obj['simname']; newname = obj['newname']
    Np = obj['Np']
    rowID = obj['rowID']; colID = obj['colID']

    flag = False
    #print(f"{bcolors.WARNING} flag, {flag}, simname: {simname}, newname: {newname}\nrowID: {rowID}, colID: {colID} {bcolors.ENDC}")
    if (newname != None):
        flag = True
        simname = newname
        chk = chkDfxn(simname=simname, user_id=user_id, rowID=None, colID=None)
    else: chk = chkDfxn(simname, user_id, rowID, colID)

    #print(f"{bcolors.FAIL} flag: {flag}, chk: {chk['chk']}, simname: {simname}, newname: {newname}\nrowID: {rowID}, colID: {colID} {bcolors.ENDC}")

    msg = "Unsuccessful write to database."

    """ saving or updating from save button """
    if (flag == True):
        if (chk['chk'] == True): # change
            ctr = 0
            rows = session.query(Displacement).filter_by(simname=f"default_{user_id}")

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

                session.query(Displacement).filter_by(simname=simname, rowID=row.rowID).update({ Displacement.username: row.user_id })
                session.query(Displacement).filter_by(simname=simname, rowID=row.rowID).update({ Displacement.user_id: row.username })

                session.commit()

                msg = f"{simname} updated."
                ctr += 1
            #print(f"ctr: {ctr}")
        else:
            rows = session.query(Displacement).filter_by(simname=f"default_{user_id}")
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
                        username = row.username,
                        user_id = row.user_id,
                    )

                session.add(p)

                session.commit()

            msg = f"{simname} saved."
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
                session.query(Displacement).filter_by(simname=simname, rowID=row.rowID).update({ Displacement.username: obj['username'] })
                session.query(Displacement).filter_by(simname=simname, rowID=row.rowID).update({ Displacement.username: obj['user_id'] })

                session.query(Displacement).filter_by(simname=simname, rowID=row.rowID).update({ Displacement.username: obj['username'] })
                session.query(Displacement).filter_by(simname=simname, rowID=row.rowID).update({ Displacement.user_id: obj['user_id'] })

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
                    username=obj['username'],
                    user_id=obj['user_id'],
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

    user_id = obj['user_id']; simname = obj['simname']; newname = obj['newname']
    Np = obj['Np']
    rowID = obj['rowID']; colID = obj['colID']

    flag = False
    #print(f"{bcolors.WARNING} flag, {flag}, simname: {simname}, newname: {newname}\nrowID: {rowID}, colID: {colID} {bcolors.ENDC}")
    if (newname != None):
        flag = True
        simname = newname
        chk = chkImgfxn(simname=simname, user_id=user_id, rowID=None, colID=None)
    else: chk = chkImgfxn(simname, user_id, rowID, colID)

    #print(f"{bcolors.OKCYAN} img, flag: {flag}, chk: {chk['chk']}, simname: {simname}, newname: {newname}\nrowID: {rowID}, colID: {colID} {bcolors.ENDC}")

    msg = "Unsuccessful write to database."

    """ saving or updating from save button """
    if (flag == True):
        if (chk['chk'] == True): # change
            ctr = 0
            rows = session.query(StreamlineImg).filter_by(simname=f"default_{user_id}")

            for row in rows:
                session.query(StreamlineImg).filter_by(simname=simname, rowID=row.rowID).update({ StreamlineImg.U: row.U })
                session.query(StreamlineImg).filter_by(simname=simname, rowID=row.rowID).update({ StreamlineImg.Re: row.Re })
                session.query(StreamlineImg).filter_by(simname=simname, rowID=row.rowID).update({ StreamlineImg.N: row.N })
                session.query(StreamlineImg).filter_by(simname=simname, rowID=row.rowID).update({ StreamlineImg.Np: row.Np})
                session.query(StreamlineImg).filter_by(simname=simname, rowID=row.rowID).update({ StreamlineImg.img_src: row.img_src })
                session.query(StreamlineImg).filter_by(simname=simname, rowID=row.rowID).update({ StreamlineImg.simname: simname })
                session.query(StreamlineImg).filter_by(simname=simname, rowID=row.rowID).update({ StreamlineImg.DT: datetime.datetime.utcnow() })

                session.query(StreamlineImg).filter_by(simname=simname, rowID=row.rowID).update({ StreamlineImg.username: row.username })
                session.query(StreamlineImg).filter_by(simname=simname, rowID=row.rowID).update({ StreamlineImg.user_id: row.user_id })

                session.commit()

                msg = f"{simname} updated."
                ctr += 1
            #print(f"ctr: {ctr}")
        else:
            rows = session.query(StreamlineImg).filter_by(simname=f"default_{user_id}")
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
                        username = row.username,
                        user_id = row.user_id,
                    )

                session.add(p)

                session.commit()

            msg = f"{simname} saved."
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

                session.query(StreamlineImg).filter_by(simname=simname, rowID=row.rowID).update({ StreamlineImg.username: obj['username'] })
                session.query(StreamlineImg).filter_by(simname=simname, rowID=row.rowID).update({ StreamlineImg.user_id: obj['user_id'] })

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
                    username=obj['username'],
                    user_id=obj['user_id'],
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

    user_id=obj['user_id']; simname = obj['simname']; newname = obj['newname']
    Np = obj['Np']
    rowID = obj['rowID']; colID = obj['colID']

    flag = False
    #print(f"{bcolors.WARNING} flag, {flag}, simname: {simname}, newname: {newname}\nrowID: {rowID}, colID: {colID} {bcolors.ENDC}")
    if (newname != None):
        flag = True
        simname = newname
        chk = chkImgPfxn(simname=simname, user_id=user_id, rowID=None, colID=None)
    else: chk = chkImgPfxn(simname, user_id, rowID, colID)

    #print(f"{bcolors.WARNING} imgP, flag: {flag}, chk: {chk['chk']}, simname: {simname}, newname: {newname}\nrowID: {rowID}, colID: {colID} {bcolors.ENDC}")

    msg = "Unsuccessful write to database."

    """ saving or updating from save button """
    if (flag == True):
        if (chk['chk'] == True): # change
            ctr = 0
            rows = session.query(StreamlineImgP).filter_by(simname=f"default_{user_id}")

            for row in rows:
                session.query(StreamlineImgP).filter_by(simname=simname, rowID=row.rowID).update({ StreamlineImgP.U: row.U })
                session.query(StreamlineImgP).filter_by(simname=simname, rowID=row.rowID).update({ StreamlineImgP.Re: row.Re })
                session.query(StreamlineImgP).filter_by(simname=simname, rowID=row.rowID).update({ StreamlineImgP.N: row.N })
                session.query(StreamlineImgP).filter_by(simname=simname, rowID=row.rowID).update({ StreamlineImgP.Np: row.Np})
                session.query(StreamlineImgP).filter_by(simname=simname, rowID=row.rowID).update({ StreamlineImgP.imgP_src: row.imgP_src })
                session.query(StreamlineImgP).filter_by(simname=simname, rowID=row.rowID).update({ StreamlineImgP.simname: simname })
                session.query(StreamlineImgP).filter_by(simname=simname, rowID=row.rowID).update({ StreamlineImgP.DT: datetime.datetime.utcnow() })

                session.query(StreamlineImgP).filter_by(simname=simname, rowID=row.rowID).update({ StreamlineImgP.username: row.username })
                session.query(StreamlineImgP).filter_by(simname=simname, rowID=row.rowID).update({ StreamlineImgP.user_id: row.user_id })

                session.commit()

                msg = f"{simname} updated."
                ctr += 1
            #print(f"ctr: {ctr}")
        else:
            rows = session.query(StreamlineImgP).filter_by(simname=f"default_{user_id}")
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
                        username = row.username,
                        user_id = row.user_id,
                    )

                session.add(p)

                session.commit()

            msg = f"{simname} saved."
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

                session.query(StreamlineImgP).filter_by(simname=simname, rowID=row.rowID).update({ StreamlineImgP.username: obj['username'] })
                session.query(StreamlineImgP).filter_by(simname=simname, rowID=row.rowID).update({ StreamlineImgP.user_id: obj['user_id'] })

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
                    username=obj['username'],
                    user_id=obj['user_id'],
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

from flask import request

""" @app.before_request
def before_request():
    if request.endpoint and request.endpoint in ['login','static']:
        # Skip the before_request logic for certain routes (e.g., login)
        return

    if current_user.is_authenticated:
        last_activity = g.get('last_activity')

        print(f"last_activity: {last_activity}")
        print(f"(datetime.datetime.utcnow(): {datetime.datetime.utcnow()}")
        print(f"(app.permentant_session_lifetime: {app.permanent_session_lifetime}")

        if last_activity is None or (datetime.datetime.utcnow() - last_activity) > app.permanent_session_lifetime:
            # User's session has expired, log them out
            print("User's session has expired. Redirecting to login.")
            logout_user()
            return redirect(url_for('login'))

        # Update last activity timestamp
        g.last_activity = datetime.datetime.utcnow()
    else:
        # User is not authenticated, handle as needed
        pass """


""" @app.before_request
def before_request():
    print("Before request is called.")
    if current_user.is_authenticated:
        last_activity = g.get('last_activity')

        print(f"last_activity: {last_activity}")
        print(f"(datetime.datetime.utcnow(): {datetime.datetime.utcnow()}")
        print(f"(app.permentant_session_lifetime: {app.permanent_session_lifetime}")

        if last_activity is None or (datetime.datetime.utcnow() - last_activity) > app.permanent_session_lifetime:
            # User's session has expired, log them out
            print("User's session has expired. Redirecting to login.")
            logout_user()
            return redirect(url_for('login'))

        # Update last activity timestamp
        g.last_activity = datetime.datetime.utcnow()
    else:
        # User is not authenticated, handle as needed
        pass """

socketio = SocketIO(app, reconnection=True, manage_session=False)

@app.route('/')
@cross_origin()
def root():
    return redirect(url_for('login'))

""" CHANGE PW LENGTH ON RELEASE """
class RegistrationForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[
        DataRequired(),
        Length(min=8, message='Password must be at least 8 characters long'),
        Regexp(
            r'^(?=.*[0-9])(?=.*[A-Z])(?=.*[\W_]).+$',
            message='Password must contain at least one digit, one uppercase letter, and one special character'
        )
        #Regexp(r'.*[0-9].*', message='Password must contain at least one digit'),
        #Regexp(r'.*[A-Z].*', message='Password must contain at least one uppercase letter'),
        #Regexp(r'.*[\W_].*', message='Password must contain at least one special character')
    ])

    confirm_password = PasswordField('Confirm Password', validators=[
        DataRequired(),
        EqualTo('password', message='Passwords must match')
    ])
    email = StringField('Email', validators=[DataRequired(), Email()])
    submit = SubmitField('Register')

    def validate_username(self, username):
        user = User.query.filter_by(username=username.data).first()
        if user:
            raise ValidationError('Username already exists. Please choose another username.')

    def validate_email(self, email):
        user = User.query.filter_by(email=email.data).first()
        if user:
            raise ValidationError('Email address already exists. Please use a different email address.')

class LoginForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=2)])
    submit = SubmitField('Login')

class PasswordVerificationForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    email = StringField('Email', validators=[DataRequired(), Email()])
    submit = SubmitField('Send Reset Link')

class PasswordResetForm(FlaskForm):
    new_password = PasswordField('New Password', validators=[
        DataRequired(),
        Length(min=8, message='Password must be at least 8 characters long'),
        Regexp(
            r'^(?=.*[0-9])(?=.*[A-Z])(?=.*[\W_]).+$',
            message='Password must contain at least one digit, one uppercase letter, and one special character'
        )
        #Regexp(r'.*[0-9].*', message='Password must contain at least one digit'),
        #Regexp(r'.*[A-Z].*', message='Password must contain at least one uppercase letter'),
        #Regexp(r'.*[\W_].*', message='Password must contain at least one special character')
    ])
    confirm_password = PasswordField('Confirm Password', validators=[
        DataRequired(),
        EqualTo('new_password', message='Passwords must match')
    ])
    submit = SubmitField('Reset Password')

    def validate_username(self, field):
        # Add your validation logic for the username here
        username = field.data
        if not User.query.filter_by(username=username).first():
            raise ValidationError('Invalid username')

@app.route('/password_reset', methods=['GET', 'POST'])
@cross_origin()
def password_reset():
    form = PasswordVerificationForm()

    print(f"{bcolors.OKCYAN}request.method: {bcolors.ENDC}{request.method}")

    redirect_source = request.args.get('source')

    if redirect_source == 'password_reset_verify':
        notify = request.args.get('notify')
        flag = request.args.get('flag')
        msg = request.args.get('msg')

        print(f"{bcolors.OKCYAN}redirect_source: {bcolors.ENDC}{redirect_source}")
        print(f"{bcolors.OKCYAN}notify: {bcolors.ENDC}{notify}")
        print(f"{bcolors.OKCYAN}flag: {bcolors.ENDC}{flag}")
        print(f"{bcolors.OKCYAN}msg: {bcolors.ENDC}{msg}")

        return render_template(
            'login.html',
            form=form,
            notify=notify,
            flag=flag,
            msg=msg,
        )

    try:

        notify = False
        invalid_credentials = False
        msg = None

        if request.method == 'POST' and form.validate_on_submit():

            print(f"{bcolors.OKGREEN}In password_reset if: {bcolors.ENDC}")

            username = form.username.data
            email = form.email.data

            user = User.query.filter_by(username=username).first()

            if user and email == user.email:

                verification_token, encrypted_token, encrypted_expiration_time = generate_verification_token()

                print(f"{bcolors.WARNING}verification_token: {bcolors.ENDC}{verification_token}")
                print(f"{bcolors.WARNING}encrypted_token: {bcolors.ENDC}{encrypted_token}")
                print(f"{bcolors.WARNING}encrypted_expiration_time: {bcolors.ENDC}{encrypted_expiration_time}")

                user.jwt_token = encrypted_token

                db.session.commit()

                send_password_reset_email(email, username, encrypted_token, encrypted_expiration_time)

                notify = True

                return redirect(url_for(
                        'login',
                        source='password_reset',
                        notify=True,
                        flag=False,
                        msg=f"Please check your email to reset your password.",
                    ))

                #msg = {
                #    'msg': 'Please check your email to reset your password',
                #    'flag': 'success'
                #    }
                #flash('Please check your email to reset your password', 'success')
                #return redirect(url_for('login'))
            else:
                notify = True
                invalid_credentials = True
                print(f"{bcolors.WARNING}notify {bcolors.ENDC}{notify}")

                #flash('Username or email address not found!', 'danger')
                #return redirect(url_for('login'))

        # For GET request
        return render_template(
            'password_reset.html',
            form=form,
            notify=notify,
            msg=msg,
            invalid_credentials=invalid_credentials
            )

    except Exception as e:
        print(f"{bcolors.WARNING}An exception occurred: {bcolors.ENDC}{str(e)}")
        traceback.print_exc()


from flask import session as flask_session

@app.route('/login', methods=['GET', 'POST'])
@cross_origin()
def login():
    form = LoginForm()

    logout_user() # this is key Feb. 26 1645 -

    max_attempts = 3

    if 'login_attempts' not in flask_session:
        flask_session['login_attempts'] = 0
        incorrect_attempts = 0
        print(f"{bcolors.OKGREEN}flask_session['login_attempts']:{bcolors.ENDC}{flask_session['login_attempts']}")

    notify = False
    flag = True
    invalid_credentials = False
    pw_reset = False
    msg = None

    redirect_source = request.args.get('source')

    if redirect_source == 'verify':
        notify = request.args.get('notify')
        flag = request.args.get('flag')
        msg = request.args.get('msg')

        print(f"{bcolors.OKCYAN}redirect_source: {bcolors.ENDC}{redirect_source}")
        print(f"{bcolors.OKCYAN}notify: {bcolors.ENDC}{notify}")
        print(f"{bcolors.OKCYAN}flag: {bcolors.ENDC}{flag}")
        print(f"{bcolors.OKCYAN}msg: {bcolors.ENDC}{msg}")

        return render_template(
            'login.html',
            form=form,
            max_attempts=max_attempts,
            flask_session=flask_session,
            notify=notify,
            flag=flag,
            msg=msg,
        )
    elif redirect_source == 'password_reset':
        notify = request.args.get('notify')
        flag = request.args.get('flag')
        msg = request.args.get('msg')

        print(f"{bcolors.OKCYAN}redirect_source: {bcolors.ENDC}{redirect_source}")
        print(f"{bcolors.OKCYAN}notify: {bcolors.ENDC}{notify}")
        print(f"{bcolors.OKCYAN}flag: {bcolors.ENDC}{flag}")
        print(f"{bcolors.OKCYAN}msg: {bcolors.ENDC}{msg}")
    elif redirect_source == 'password_reset_verify':
        notify = request.args.get('notify')
        flag = request.args.get('flag')
        msg = request.args.get('msg')

        print(f"{bcolors.OKCYAN}redirect_source: {bcolors.ENDC}{redirect_source}")
        print(f"{bcolors.OKCYAN}notify: {bcolors.ENDC}{notify}")
        print(f"{bcolors.OKCYAN}flag: {bcolors.ENDC}{flag}")
        print(f"{bcolors.OKCYAN}msg: {bcolors.ENDC}{msg}")

        return render_template(
            'login.html',
            form=form,
            notify=notify,
            flag=flag,
            msg=msg,
        )


    if request.method == 'POST' and form.validate_on_submit():
        username = form.username.data
        password = form.password.data

        user = User.query.filter_by(username=username).first()

        """ IN PROD -- KEEP COMMENTED """
        #print(f"{bcolors.WARNING} username:{bcolors.ENDC} {username} \
        #       {bcolors.WARNING} user:{bcolors.ENDC} {user} \
        #       {bcolors.WARNING} user.username:{bcolors.ENDC} {user.username}")

        #flash('', '')
        if user and user.check_password(password) and user.is_verified and not user.is_locked_out:
        #if user and user.check_password(password) and user.is_verified == True and user.is_locked_out == False:
            #session.permanent = True
            #session["user"] = username # gives error

            # Flask-Login: Mark the user as logged in and authentiateß
            login_user(user, remember=True)

            user.is_logged_in = True

            db.session.commit()

            # Set the initial last activity timestamp
            g.last_activity = datetime.datetime.utcnow()

            with app.test_request_context():
                get_flashed_messages()

            flash('Login successful!', 'success')

            get_flashed_messages()

            return redirect(url_for('test',
                                    user_authenticated=True,
                                    username=username
                                    ))
        else:

            user = User.query.filter_by(username=username).first()

            if user:

                if (user.is_verified == False):
                    return render_template(
                        'login.html',
                        form=form,
                        max_attempts=max_attempts,
                        flask_session=flask_session,
                        notify=True,
                        flag=True,
                        msg=f"Registration verification incomplete. Please check your registered email.",
                        invalid_credentials=True,
                        pw_reset=False,
                        )

                print(f"{bcolors.OKBLUE}user.username:{bcolors.ENDC}{user.username}")
                print(f"{bcolors.OKBLUE}flask_session['login_attempts']:{bcolors.ENDC}{flask_session['login_attempts']}")

                flask_session['login_attempts'] += 1

                incorrect_attempts = user.incorrect_attempts

                incorrect_attempts += 1

                user.incorrect_attempts = incorrect_attempts

                db.session.commit()

                notify = True
                flag = True
                msg = f"Invalid username and/or password. You have {max_attempts - user.incorrect_attempts} remaining attempts."
                #msg = f"Invalid username and/or password. You have {max_attempts - flask_session['login_attempts']} remaining attempts."
                invalid_credentials = True
                pw_reset = True

                print(f"{bcolors.WARNING}flask_session['login_attempts']:{bcolors.ENDC}{flask_session['login_attempts']}")
                print(f"{bcolors.WARNING}incorrect_attempts:{bcolors.ENDC}{incorrect_attempts}")

                if user and user.incorrect_attempts >= max_attempts:
                #if user and flask_session['login_attempts'] >= max_attempts:

                    user.is_locked_out = True

                    db.session.commit()

                    notify = True
                    flag = True
                    invalid_credentials = True
                    pw_reset = True
                    msg =f"Your account has been locked. Please "
            else:
                notify = True
                flag = True
                invalid_credentials = True
                msg =f"Invalid credentials. Please register for an account."

    if pw_reset:
        return render_template(
            'login.html',
            form=form,
            max_attempts=max_attempts,
            flask_session=flask_session,
            notify=notify,
            flag=flag,
            msg=msg,
            invalid_credentials=invalid_credentials,
            pw_reset=pw_reset,
            )

    return render_template(
        'login.html',
        form=form,
        max_attempts=max_attempts,
        flask_session=flask_session,
        notify=notify,
        flag=flag,
        msg=msg,
        invalid_credentials=invalid_credentials,
        pw_reset=pw_reset,
        )

is_user_logged_in_clients = set()

@socketio.on('connect', namespace='/is_user_logged_in')
def is_user_logged_in_connect():
    print("CONNECTED to /is_user_logged_in")
    sid = request.sid
    is_user_logged_in_clients.add(sid)
    emit('sid', {'sid': sid}, room=request.sid)

@socketio.on('disconnect', namespace='is_user_logged_in')
def is_user_logged_in_disconnect():
    print("DISCONNECTED from /is_user_logged_in")
    is_user_logged_in_clients.remove(request.sid)

@socketio.on('reconnect', namespace='is_user_logged_in')
def is_user_logged_in_handle_reconnect():
    print("Client reconnected to /is_user_logged_in")

@socketio.on('message', namespace='/is_user_logged_in')
@login_required
def is_user_logged_in(message):
    # Access the current user
    if current_user.is_authenticated:
        user_id = current_user.get_id()  # Get the user ID

        if (user_id):
            event = {"msg": True}
            emit('response', json.dumps(event, cls=npEncoder), room=request.sid)

    else:
        print("No user is currently authenticated.")

logout_clients = set()

@socketio.on('connect', namespace='/logout')
def logout_connect():
    print("CONNECTED to /logout: ", request.sid)
    sid = request.sid
    logout_clients.add(sid)
    emit('sid', {'sid': sid}, room=request.sid)

@socketio.on('disconnect', namespace='is_user_logged_in')
def logout_disconnect():
    print("DISCONNECTED froms logout")
    logout_clients.remove(request.sid)

@socketio.on('reconnect', namespace='logout')
def logout_handle_reconnect():
    print("Client reconnected to logout")

#@app.route('/logout', methods=['GET', 'POST'])
@socketio.on('message', namespace='/logout')
@login_required
def logout(message):
    print(f"{bcolors.WARNING}Hi from /logout: {bcolors.ENDC}")

    # Access the current user
    if current_user.is_authenticated:
        user_id = current_user.get_id()  # Get the user ID
        username = current_user.username  # Get the username
        user = User.query.filter_by(username=username).first()

        user.is_logged_in = False

        db.session.commit()

        user_login_status = current_user.check_is_logged_in()

        # Flask-Login: Logout the user
        logout_user()

        print(
            f"{bcolors.OKGREEN}user_id{bcolors.ENDC}: {user_id}, "
            f"{bcolors.OKGREEN}username{bcolors.ENDC}: {username}, "
            f"{bcolors.OKGREEN}user_login_status{bcolors.ENDC}: {user_login_status}, "
            f"{bcolors.OKGREEN}current_user.is_authenticated: {bcolors.ENDC}{current_user.is_authenticated}"
        )

        get_flashed_messages()

        flash('You have been logged out', 'success')

        time.sleep(1)

        event = {"msg": 'You have been successfully logged out!'}

        emit('response', json.dumps(event, cls=npEncoder), room=request.sid)

        return redirect(url_for('root', user_authenticated=current_user.is_authenticated, username=None))
    else:
        print("No user is currently authenticated.")

mail = Mail(app)

""" def generate_jwt_token(user_id, email):
    payload = {'user_id': user_id, 'email': email}
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256') """

@app.route('/password_reset_verify/<path:token>/<path:expiration_time>', methods=['GET','POST'])
@cross_origin()
def password_reset_verify(token, expiration_time):

    form = PasswordResetForm()

    encrypted_expiration_time = expiration_time

    notify = False
    msg = None

    token_expired = False
    invalid_token = True

    form_disabled = False

    try:
        decrypted_expiration_time_str = cipher_suite.decrypt(expiration_time.encode('utf-8')).decode('utf-8')
        decrypted_expiration_time = datetime.datetime.fromisoformat(decrypted_expiration_time_str)
        print(f"{bcolors.WARNING}user_id_from_url: {bcolors.ENDC}", decrypted_expiration_time)

        # Verify the hashed token and update the user's verification status in the database
        user_id_from_url = get_user_id_from_verification_token(token)

        if user_id_from_url is not None:
            user = User.query.get(user_id_from_url)

            expiration_time = decrypted_expiration_time

            if user.jwt_token == token:
                # Check if the token has expired
                if datetime.datetime.utcnow() > expiration_time:
                    notify = True

                    msg = {
                        "msg": f"${user.username}, your password reset verification link has expired. Please request ",
                        "flag": "invalid token"
                        }

                    token_expired = True

                    #form_disabled = True # for password_reset_verify only

                    return redirect(url_for(
                        'password_reset',
                        source='password_reset_verify',
                        notify=True,
                        flag=True,
                        token_expired=True,
                        msg=f"The password reset link has expired. Please request a new link.",
                    ))

                if request.method == 'POST' and form.validate_on_submit():
                    #username = form.username.data
                    new_password = form.new_password.data

                    # Update user's password and unlock the account
                    user.set_password(new_password)
                    user.is_locked_out = False
                    user.incorrect_attempts = 0

                    db.session.commit()

                    notify=True

                    form_disabled = True

                    msg = {
                        "msg": "Password reset successfull",
                        "flag": "success",
                    }

                    return redirect(url_for(
                        'login',
                        source='password_reset_verify',
                        notify=True,
                        flag=False,
                        msg=f"Password reset successfull. Please login.",
                    ))

                #form_disabled = False

                # For GET request or if form validation fails, render the template
                return render_template(
                    'password_reset_verify.html',
                    form=form,
                    token=token,
                    expiration_time=encrypted_expiration_time,
                    notify=notify,
                    msg=msg,
                    token_expired=token_expired,
                    form_disabled=form_disabled,
                    )
    except InvalidToken:
        # Redirect the user to the password_reset.html page with an error message
        notify = True
        msg = {
            "msg": f"Invalid password reset link. Please request ",
            "flag": "invalid token"
            }
        return render_template(
                    'password_reset_verify.html',
                    form=form,
                    token=token,
                    expiration_time=encrypted_expiration_time,
                    notify=notify,
                    msg=msg,
                    token_expired=token_expired,
                    invalid_token=invalid_token,
                    )
        return redirect(url_for('password_reset',
                                notify=notify,
                                msg=msg,
                                token_expired=token_expired
                                ))

    # Handle other exceptions or invalid cases
    notify = True
    msg = {
            "msg": f"Invalid request. Please request ",
            "flag": "invalid request"
            }
    return render_template(
                    'password_reset_verify.html',
                    form=form,
                    token=token,
                    expiration_time=encrypted_expiration_time,
                    notify=notify,
                    msg=msg,
                    token_expired=token_expired,
                    invalid_token=invalid_token,
                    )
    return redirect(url_for('password_reset',
                            notify=notify,
                            msg=msg,
                            token_expired=token_expired
                            ))

#@app.route('/verify/<hashed_token>', methods=['GET'])
#@app.route('/verify/<path:token>', methods=['GET'])
@app.route('/verify/<path:token>/<path:expiration_time>', methods=['GET'])
@cross_origin()
def verify(token, expiration_time):

    try:
        decrypted_expiration_time_str = cipher_suite.decrypt(expiration_time.encode('utf-8')).decode('utf-8')
        decrypted_expiration_time = datetime.datetime.fromisoformat(decrypted_expiration_time_str)
        print(f"{bcolors.WARNING}user_id_from_url: {bcolors.ENDC}", decrypted_expiration_time)

        # Verify the hashed token and update the user's verification status in the database
        user_id_from_url = get_user_id_from_verification_token(token)

        # However, keep in mind that if someone gains access to your encryption key, they could
        # decrypt the token. Store the encryption key securely, and consider rotating it
        # periodically for added security.

        if user_id_from_url is not None:
            user = User.query.get(user_id_from_url)

            # Convert the expiration_time string back to a datetime object if needed
            expiration_time = decrypted_expiration_time
            #expiration_time = datetime.datetime.fromisoformat(decrypted_expiration_time)
            #expiration_time = datetime.datetime.fromisoformat(expiration_time)

            # Convert the expiration_time back to a datetime object
            #expiration_datetime = datetime.datetime.utcfromtimestamp(expiration_time)

            # Compare the verification tokens
            if user.jwt_token == token:
            #if user.jwt_token == token:

                # Check if the token has expired
                if datetime.datetime.utcnow() > expiration_time:

                    db.session.delete(user)

                    db.session.commit()

                    #flash('Verification token has expired. Please request a new one.', 'error')
                    return redirect(url_for(
                        'login',
                        source='verify',
                        notify=True,
                        flag=True,
                        msg=f"The registration link has expired. Please request a new link.",
                    ))


                # Check if the token has expired
                #if has_verification_token_expired(verification_token):
                #    flash('Verification token has expired. Please request a new one.', 'error')
                #    return redirect(url_for('error_page'))

                # Update the user's verification status in the database (your verification logic here)
                user.is_verified = True
                db.session.commit()

                # Redirect to a success page
                #flash('Email verification successful!', 'success')
                return redirect(url_for(
                    'login',
                    source='verify',
                    notify=True,
                    flag=False,
                    msg=f"Registration verification successfull! Please login by submitting your credentials.",
                ))
    except InvalidToken:
        return redirect(url_for(
                    'login',
                    source='verify',
                    notify=True,
                    flag=True,
                    msg=f"Invalid token or user not found. Please register for an account.",
                ))
    except Exception as e:
        flash('Email verification failed. Please try again later.', 'error')
        print(f'{bcolors.FAIL}Error during verification: {bcolors.ENDC}{e}')
        traceback.print_exc()

    # Redirect to an error page if verification fails
    return redirect(url_for('error_page'))

def get_user_id_from_verification_token(token):
    try:
        print(f"{bcolors.WARNING}Received verification token: {bcolors.ENDC}{token}")
        user = User.query.filter_by(jwt_token=token).first()

        if user:
            print(f"{bcolors.WARNING}User found with ID: {bcolors.ENDC}{user.id}")
            return user.id
    except Exception as e:
        # Handle any exceptions or log errors as needed
        print(f"{bcolors.FAIL}Error getting user_id from verification token: {bcolors.ENDC}{e}")

    return None

""" def get_user_id_from_verification_token(token):
    try:
        # Perform a database query to get the user_id associated with the verification_token
        user = User.query.filter_by(jwt_token=token).first()

        if user:
            return user.id
    except Exception as e:
        # Handle any exceptions or log errors as needed
        print(f"Error getting user_id from verification token: {e}")

    return None """

""" def extract_user_id_from_token(jwt_token):
    print(f'Raw token received: {jwt_token}')
    try:
        # Decode the JWT token
        decoded_token = jwt.decode(jwt_token, SECRET_KEY, algorithms=['HS256'])

        # Extract the user_id from the decoded token
        user_id = decoded_token.get('user_id')

        return user_id
    except jwt.ExpiredSignatureError:
        # Handle token expiration
        print('Token has expired.')
    except jwt.InvalidTokenError:
        # Handle invalid token
        print('Invalid token.')

    return None """

@app.route('/error_page')
def error_page():
    error_message = "Oops! Something went wrong."
    return render_template('error_page.html', error_message=error_message)

# Generate a key for encryption/decryption (keep this secret)
encryption_key = Fernet.generate_key()
cipher_suite = Fernet(encryption_key)

def generate_verification_token():

    # Generate a random URL-safe text string for verification token
    raw_token = secrets.token_urlsafe(32)

    print(f"{bcolors.WARNING}user_id_from_url: {bcolors.ENDC}", raw_token)
    encrypted_token = cipher_suite.encrypt(raw_token.encode('utf-8'))

    # Hash the token before saving it to the database
    #hashed_token = bcrypt.hashpw(raw_token.encode('utf-8'), bcrypt.gensalt())

    expiration_time = datetime.datetime.utcnow() + datetime.timedelta(minutes=15)
    expiration_time_str = expiration_time.isoformat()
    encrypted_expiration_time = cipher_suite.encrypt(expiration_time_str.encode('utf-8'))

    #expiration_time = datetime.utcnow() + timedelta(minutes=1)

    return raw_token, encrypted_token, encrypted_expiration_time

def send_verification_email(email, username, token, expiration_time_str):
    subject = 'Verify Your Email'

    print(f"{bcolors.WARNING}expiration_time_str: {bcolors.ENDC} {expiration_time_str}")

    #expiration_time_str = expiration_time.isoformat()

    verification_url = url_for('verify', token=token, expiration_time=expiration_time_str, _external=True)
    #verification_url = url_for('verify', token=token, _external=True)

    print(f"{bcolors.WARNING}verification_url: {bcolors.ENDC} {verification_url}")

    body = f'Thank you for registering, {username}!\n\nClick the link to verify your email: {verification_url}.'
    recipients = [email]

    msg = Message(subject=subject, body=body, recipients=recipients)
    mail.send(msg)

def send_password_reset_email(email, username, token, expiration_time_str):
    subject = 'Reset Your Password'

    print(f"{bcolors.WARNING}expiration_time_str: {bcolors.ENDC} {expiration_time_str}")

    #expiration_time_str = expiration_time.isoformat()

    password_reset_url = url_for('password_reset_verify', token=token, expiration_time=expiration_time_str, _external=True)
    #verification_url = url_for('verify', token=token, _external=True)

    print(f"{bcolors.WARNING}password_reset_url: {bcolors.ENDC} {password_reset_url}")

    body = f'{username}:\n\nPlease click the link to reset your password {password_reset_url}.'
    recipients = [email]

    msg = Message(subject=subject, body=body, recipients=recipients)
    mail.send(msg)

@app.route('/register', methods=['GET', 'POST'])
@cross_origin()
def register():
    form = RegistrationForm()

    if request.method == 'POST' and form.validate_on_submit():
        try:

            username = form.username.data
            email = form.email.data
            password = form.password.data

            verification_token, encrypted_token, encrypted_expiration_time = generate_verification_token()

            print(f"{bcolors.WARNING}verification_token: {bcolors.ENDC}{verification_token}")
            print(f"{bcolors.WARNING}encrypted_token: {bcolors.ENDC}{encrypted_token}")
            print(f"{bcolors.WARNING}encrypted_expiration_time: {bcolors.ENDC}{encrypted_expiration_time}")

            new_user = User(
                username=username,
                email=email,
                is_verified=False,
                jwt_token=encrypted_token,
                is_logged_in=False,
                is_locked_out=False,
            )
            #new_user = User(username=username, email=email, is_verified=False, jwt_token=token)
            new_user.set_password(password)

            db.session.add(new_user)
            db.session.commit()

            # Retrieve the user_id after committing changes
            user_id = new_user.id

            #print("user_id: ", user_id, "email: ", email)

            # Generate JWT token and send verification email
            #jwt_token = generate_jwt_token(user_id, email)
            #hashed_token = bcrypt.hashpw(jwt_token.encode('utf-8'), bcrypt.gensalt())
            #new_user.jwt_token = hashed_token

            #db.session.commit()

            send_verification_email(email, username, encrypted_token, encrypted_expiration_time)

            return redirect(url_for(
                        'login',
                        source='verify',
                        notify=True,
                        flag=False,
                        msg=f"Registration successful! Please check your registered email address to complete the registration process.",
                    ))
        except IntegrityError as e:
            db.session.rollback()  # Rollback the transaction
            # Handle the case where the email address is already registered
            #flash('Email address is already registered. Please use a different email or try logging in.', 'error')
            #return render_template(
            #    'register.html',
            #    form=form,
            #    notify=True,
            #    flag=True,
            #    msg=f"Email address is already registered. Please use a different email or try logging in.",
            #    )

        #flash('Registration successful! Please check your email for the verification link.', 'success')
        #return redirect(url_for('login'))

    return render_template('register.html', form=form)

@app.route('/index', methods=['GET', 'POST'])
@cross_origin()
@login_required
def index():
    return render_template('index.html')

@app.route('/simulate', methods=['GET', 'POST'])
@cross_origin()
@login_required
def simulate():
    if current_user.is_authenticated:
        user_id = current_user.get_id()  # Get the user ID
        username = current_user.username  # Get the username
        user = User.query.filter_by(username=username).first()

        user_login_status = current_user.check_is_logged_in()

        print(
            f"{bcolors.WARNING}user_id{bcolors.ENDC}: {user_id}, "
            f"{bcolors.WARNING}username{bcolors.ENDC}: {username}, "
            f"{bcolors.WARNING}user_login_status{bcolors.ENDC}: {user_login_status}, "
            f"{bcolors.WARNING}current_user.is_authenticated: {bcolors.ENDC}{current_user.is_authenticated}"
        )

        return render_template('simulate.html',
                               user_authenticated=current_user.is_authenticated,
                               username=username
                               )
    else:
        print("Redirect to login")
        return redirect(url_for('login'))

import boto3
from botocore.exceptions import NoCredentialsError

from io import BytesIO

from config import AWS_ACCESS_KEY, AWS_SECRET_KEY, S3_BUCKET

# Initialize S3 client
s3 = boto3.client('s3', aws_access_key_id=AWS_ACCESS_KEY, aws_secret_access_key=AWS_SECRET_KEY)

@app.route('/get_pdf', methods=['GET', 'POST'])
@cross_origin()
@login_required
def get_pdf():
    object_name = 'SIMPLE-ALGORITHM-FOR-SYMMETRIC-DRIVEN-CAVITY-NEW.pdf'

    try:
        # Download the PDF content from S3
        response = s3.get_object(Bucket=S3_BUCKET, Key=object_name)
        pdf_content = response['Body'].read()

        # Create a BytesIO buffer to send the file
        buffer = BytesIO(pdf_content)

        # Send the file using send_file
        return send_file(buffer, mimetype='application/pdf')
        #return send_file(buffer, mimetype='application/pdf', as_attachment=True, download_name='SIMPLE-ALGORITHM-FOR-SYMMETRIC-DRIVEN-CAVITY-NEW.pdf')
    except Exception as e:
        print(f"Error retrieving file from S3: {e}")
        # Handle the error, e.g., return an error response or redirect to an error page

""" @app.route('/get_pdf', methods=['GET', 'POST'])
@cross_origin()
@login_required
def get_pdf():
    pdf_path = '/stephenhodson/Users/Downloads/SIMPLE-ALGORITHM-FOR-SYMMETRIC-DRIVEN-CAVITY-NEW.pdf'
    return send_file(pdf_path, mimetype='application/pdf') """

@app.route('/test', methods=['GET', 'POST'])
@cross_origin()
@login_required
def test():

    if current_user.is_authenticated:
        user_id = current_user.get_id()  # Get the user ID
        username = current_user.username  # Get the username
        user = User.query.filter_by(username=username).first()

        user_login_status = current_user.check_is_logged_in()

        print(
            f"{bcolors.WARNING}user_id{bcolors.ENDC}: {user_id}, "
            f"{bcolors.WARNING}username{bcolors.ENDC}: {username}, "
            f"{bcolors.WARNING}user_login_status{bcolors.ENDC}: {user_login_status}, "
            f"{bcolors.WARNING}current_user.is_authenticated: {bcolors.ENDC}{current_user.is_authenticated}"
        )

        playlist_id = '7ewC7h76BY0b43C30iHzFF'

        return render_template('index.html',
                               user_authenticated=current_user.is_authenticated,
                               username=username
                               )
    else:
        print("Redirect to login")
        return redirect(url_for('login'))

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
@login_required
def chk(message):
    try:
        socketio.sleep(0.5)

        # Access the current user
        if current_user.is_authenticated:
            user_id = current_user.get_id()  # Get the user ID
            username = current_user.username  # Get the username
            print(f"{bcolors.WARNING}user_id{bcolors.ENDC}: {user_id}, {bcolors.WARNING}username{bcolors.ENDC}: {username}")
        else:
            print("No user is currently authenticated.")

        res = message

        simname = res['simname']; N = res['simname']

        print("simname: ", simname)

        obj = chkVfxn(simname=f"{simname}_{user_id}", user_id=user_id, rowID=1, colID=None, N=N)

        event = {"msg": obj['msg'], "chk": obj['chk']}

        emit('response', json.dumps(event, cls=npEncoder), room=request.sid)
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
@login_required
def save(message):
    try:
        socketio.sleep(0.5)

        # Access the current user
        if current_user.is_authenticated:
            user_id = current_user.get_id()  # Get the user ID
            username = current_user.username  # Get the username
            print(f"{bcolors.WARNING}user_id{bcolors.ENDC}: {user_id}, {bcolors.WARNING}username{bcolors.ENDC}: {username}")
        else:
            print("No user is currently authenticated.")

        res = message

        print(f"{bcolors.WARNING} res: {res['flag']} {bcolors.ENDC}")

        ubn = float(res['U'])
        Re = float(res['Re'])
        N = int(res['N'])
        Np = int(res['Np'])

        simname = res['simname']; newname = res['newname']

        # delete previous default velocity data in DB
        session.query(Velocity).filter(Velocity.simname == f"{newname}_{user_id}").delete()
        session.query(Pressure).filter(Pressure.simname == f"{newname}_{user_id}").delete()
        session.query(Convergence).filter(Convergence.simname == f"{newname}_{user_id}").delete()
        session.query(Displacement).filter(Displacement.simname == f"{newname}_{user_id}").delete()
        session.query(StreamlineImg).filter(StreamlineImg.simname == f"{newname}_{user_id}").delete()
        session.query(StreamlineImgP).filter(StreamlineImgP.simname == f"{newname}_{user_id}").delete()
        session.commit()

        obj = {
            "simname": f"default_{user_id}",
            "newname": f"{newname}_{user_id}",
            "U": ubn,
            "Re": Re,
            "N": N,
            "Np": Np,
            "rowID": 0,
            "colID": None,
            "axisU": { "u": None },
            "axisV": { "v": None },
            "axisID": 'uv',
            "user_id": user_id,
            "username": username,
        }

        t1 = time.time()

        saveDefaultVelocity(obj)

        print(f"{bcolors.OKCYAN} Write time = {time.time() - t1}[s] {bcolors.ENDC}")

        t1 = time.time()

        obj = {
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
            "simname": f"default_{user_id}",
            "newname": f"{newname}_{user_id}",
            "user_id": user_id,
            "username": username,
        }

        saveDefaultPressure(obj)

        print(f"{bcolors.OKCYAN}Write time = {time.time() - t1}[s]{bcolors.ENDC}")

        t1 = time.time()
        #for i in range(0, int(Np/2)):
        obj = {
                "U": ubn,
                "Re": Re,
                "N": N,
                "Np": Np,
                "rowID": None,
                "colID": None,
                "axisX": {"x": None},
                "axisY": {"y": None},
                "simname": f"default_{user_id}",
                "newname": f"{newname}_{user_id}",
                "user_id": user_id,
                "username": username,
            }

        saveDefaultDisplacement(obj)

        print(f"{bcolors.OKCYAN}Write time = {time.time() - t1}[s]{bcolors.ENDC}")

        t1 = time.time()

        obj = {
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
            "simname": f"default_{user_id}",
            "newname": f"{newname}_{user_id}",
            "user_id": user_id,
            "username": username,
        }

        msg = saveDefaultConvergence(obj)

        print(f"{bcolors.OKCYAN}Write time = {time.time() - t1}[s]{bcolors.ENDC}")

        t1 = time.time()

        obj = {
            "U": ubn,
            "Re": Re,
            "N": N,
            "Np": Np,
            "rowID": 0,
            "colID": None,
            "img_src": None,
            "src": 'streamline',
            "simname": f"default_{user_id}",
            "newname": f"{newname}_{user_id}",
            "user_id": user_id,
            "username": username,
        }

        msg = saveDefaultStreamlineImg(obj)

        print(f"{bcolors.OKCYAN}Write time = {time.time() - t1}[s]{bcolors.ENDC}")

        t1 = time.time()

        obj = {
            "U": ubn,
            "Re": Re,
            "N": N,
            "Np": Np,
            "rowID": 0,
            "colID": None,
            "imgP_src": None,
            "src": 'streamline',
            "simname": f"default_{user_id}",
            "newname": f"{newname}_{user_id}",
            "user_id": user_id,
            "username": username,
        }

        msg = saveDefaultStreamlineImgP(obj)

        trunc_msg = msg

        print(f"{bcolors.OKCYAN}Write time = {time.time() - t1}[s]{bcolors.ENDC}")

        user_id_index = trunc_msg[::-1].find('_')  # Find the index of the last underscore character from the reversed string
        if user_id_index != -1:  # Check if the underscore character exists
            trunc_msg = trunc_msg[:-user_id_index - 1]  # Slice the string from the end to the index of the last underscore from the end
            print("** underscore found **")
        else:
            # Handle the case when no underscore character is found
            print("** No underscore character found in the string **")

        print(f"{bcolors.OKGREEN}:: {trunc_msg} ::{bcolors.ENDC}")

        event = {"msg": trunc_msg + ' saved'}

        emit('response', json.dumps(event, cls=npEncoder), room=request.sid)  # Emit to a specific client

    except Exception as e:
        print(f"An exception occurred: {str(e)}")
        traceback.print_exc()
    finally:
        print("poop /save")

load_clients = set()

@socketio.on('connect', namespace='/load')
@login_required
def connect_load():
    print("CONNECTED to load: ", request.sid)

    try:
        sid = request.sid
        load_clients.add(sid)

        simnames = getSims()
        #print(f"{bcolors.WARNING}simnames: {bcolors.ENDC}", simnames)

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
@login_required
def retreive(message):
    print("messaga retreive: ", message)
    if current_user.is_authenticated:

        user_id = current_user.get_id()  # Get the user ID

        try:
            res = message

            print(f"{bcolors.WARNING} res['flag']: {res['flag']}{bcolors.ENDC}")

            simname = res['simname']

            print(f"{bcolors.WARNING}simname: {bcolors.ENDC}{simname}")

            #user_id_index = simname[::-1].find('_')  # Find the index of the last underscore character from the reversed string
            #if user_id_index != -1:  # Check if the underscore character exists
            #    simname = simname[:-user_id_index - 1]  # Slice the string from the end to the index of the last underscore from the end
            #    print("underscore found")
            #else:
            #    # Handle the case when no underscore character is found
            #    print("No underscore character found in the string")

            simname = f"{res['simname']}_{user_id}"

            print(f"{bcolors.WARNING}simname (/retrieve): {bcolors.ENDC}{simname}")

            objV = getDataV(simname=simname)

            params = objV['params']
            N = params['N']; Np = params['Np']
            u = objV['u']; v = objV['v']

            print(f"{bcolors.OKBLUE}From retreive :: N = {N} :: simname = {simname} {bcolors.ENDC}")

            objP = getDataP(simname=simname)

            P = objP['P']

            bias = 5

            row, col, Pmax = find_max(abs(P))
            #row, col, Pmax = find_max(abs(P[bias:-1][:]))

            print("len(u): ", len(u))
            print("len(P): ", len(P), "row: ", row, "col: ", col)

            objC = getDataC(simname=simname)

            objS = {
                "u": u,
                "v": v,
                "N": N,
            }

            objD = getDataD(simname=simname,Np=Np,Nint=int(250))

            x = np.linspace(0,1,N); y = np.linspace(0,1,N)

            Nuv = int(len(u))
            #Nuv = int(len(u)/2)
            cfd = {
                "yu": [],
                "xv": [],
            }

            y = np.linspace(0,1,Nuv)
            x = np.linspace(0,1,Nuv)

            print("x[col+bias]: ", x[col+bias], "y[row]: ", y[row])

            cfd["yu"] = np.zeros((Nuv, 2))
            cfd["xv"] = np.zeros((Nuv, 2))

            print("len(cfd['yu']): ", len(cfd["yu"]))
            print("len(u): ", len(u))

            for i in range(0, Nuv):
                cfd["yu"][i][0] = y[i]
                cfd["yu"][i][1] = u[i][col+bias]/float(params['U'])
                cfd["xv"][i][0] = x[i]
                cfd["xv"][i][1] = v[row][i]/float(params['U'])

            cfd["yu"][Nuv-1][1] = 1

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
    else:
        print("No user is currently authenticated.")

""" /fvm route START """

start_fvm_clients = set()

@socketio.on('connect', namespace='/start_fvm')
def start_fvm_connect():
    try:
        print("CONNECTED to start_fvm: ", request.sid)
        # Get the client's SID
        sid = request.sid
        start_fvm_clients.add(sid)
        join_room(sid)  # Join room using the client's SID
        emit('sid', {'sid': sid}, room=sid)
    except Exception as e:
        print(f"An exception occurred in start_fvm_connect: {str(e)}")
        traceback.print_exc()

@socketio.on('disconnect', namespace='/start_fvm')
def start_fvm_disconnect():
    try:
        print("DISCONNECTED from start_fvm: ", request.sid)
        start_fvm_clients.remove(request.sid)
    except Exception as e:
        print(f"An exception occurred in start_fvm_disconnect: {str(e)}")
        traceback.print_exc()

@socketio.on('reconnect', namespace='/start_fvm')
def handle_reconnect():
    # Handle reconnection logic (e.g., resuming simulation)
    emit('reconnected', {'message': 'You have been successfully reconnected to the server.'}, room=request.sid)
    print("Client reconnected to /start_fvm")

@socketio.on('close_connection', namespace='/start_fvm')
def start_fvm_close_connection():
    close_room(request.sid)

running_loop = False

@socketio.on('message', namespace='/start_fvm')
@login_required
def start_fvm(message):
    try:
        join_room(request.sid)
        # Check if there are still participants in the '/test' namespace.
        socketio.sleep(1)  # Sleep for 1 second between checks

        res = message
        #if res['flag'] == 'fvm':
        print("message: ", res)
        main_error = np.asfortranarray(np.ones(1000), dtype='float32')

        N = int(res['N'])

        min_val = 20; max_val = 50

        if not min_val <= N <= max_val:
            raise ValueError(f'Number of control volumes must be\ngreater than {min_val} and less than or equal to {max_val}')
        if N % 2 != 0:
            raise ValueError("Number of control volumes 'N' must be an even number.")

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
        min_val = 10; max_val = 500
        if not min_val < Np <= max_val:
            raise ValueError(f'Number of particles must be\ngreater than {min_val} and less than or equal to {max_val}')

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
        min_val = 5; max_val = 100
        if not ubn == None:
            if not min_val < ubn <= max_val:
                raise ValueError(f'The velocity must be\nbetween {min_val} and {max_val}')

        Re = float(res['Re'])
        min_val = 200; max_val = 2E4
        if not min_val <= Re <= max_val:
            raise ValueError(f"The Reynolds' number must be\ngreater than {min_val} and less than or equal to {max_val}")

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

                # Access the current user
                if current_user.is_authenticated:
                    user_id = current_user.get_id()  # Get the user ID
                    username = current_user.username  # Get the username
                    print(f"{bcolors.WARNING}user_id{bcolors.ENDC}: {user_id}, {bcolors.WARNING}username{bcolors.ENDC}: {username}")
                else:
                    print("No user is currently authenticated.")

                try:
                    # delete previous default velocity data in DB
                    session.query(Velocity).filter(Velocity.simname == f"default_{user_id}").delete()
                    #session.query(Velocity).filter(Velocity.simname == 'default').delete()
                    session.query(Pressure).filter(Pressure.simname == f"default_{user_id}").delete()
                    session.query(Convergence).filter(Convergence.simname == f"default_{user_id}").delete()
                    session.query(Displacement).filter(Displacement.simname == f"default_{user_id}").delete()
                    session.commit()
                except:
                    print("default table does not exist")

                # Assuming you have a User model with a 'username' attribute
                #username = current_user.username if current_user.is_authenticated else None
                #user = current_user.user_id if current_user.is_authenticated else None

                #print(f"{bcolors.WARNING}username{bcolors.ENDC}: {username}")

                #u[-1][:] = 10
                print(u[-1][:])

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
                        "simname": f"default_{user_id}",
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
                        "user_id": user_id,
                        "username": username,
                    }

                    saveDefaultVelocity(obj)

                print(f"{bcolors.OKCYAN}Write time = {time.time() - t1}[s]{bcolors.ENDC}")

                t1 = time.time()

                obj = {
                    "simname": f"default_{user_id}",
                    "newname": None,
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
                    "username": username,
                    "user_id": user_id,
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
                        "simname": f"default_{user_id}",
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
                        "username": username,
                        "user_id": user_id,
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
    except ValueError as e:
        print(f"{bcolors.WARNING} A ValueError occurred: {bcolors.ENDC} {str(e)}")
        traceback.print_exc()

        error_msg = str(e)

        if "could not convert string to float: ''" in error_msg:
            error_msg = "Please enter a valid value."

        event = { 'msg': error_msg }
        emit('response', json.dumps(event, cls=npEncoder), room=request.sid)
        running_loop = False
    except Exception as e:
        print(f"An exception occurred: {str(e)}")
        traceback.print_exc()

        event = { 'msg': 'An error as occurred with the Heroku database. Please try again later.' }
        emit('response', json.dumps(event, cls=npEncoder), room=request.sid)
        running_loop = False
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
@login_required
def genP(message):
    try:
        socketio.sleep(0.5)

        # Access the current user
        if current_user.is_authenticated:
            user_id = current_user.get_id()  # Get the user ID
            username = current_user.username  # Get the username
            print(f"{bcolors.WARNING}user_id{bcolors.ENDC}: {user_id}, {bcolors.WARNING}username{bcolors.ENDC}: {username}")
        else:
            print("No user is currently authenticated.")

        res = message

        simname = res['simname'] + f"_{user_id}"

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

        session.query(Displacement).filter(Displacement.simname == f"default_{user_id}").delete()
        session.commit()

        t1 = time.time()
        for i in range(0, int(Np/2)):
            xlist = xlists_pkg[i]
            ylist = ylists_pkg[i]
            obj = {
                    "U": params['U'],
                    "Re": params['Re'],
                    "N": params['N'],
                    "Np": params['Np'],
                    "rowID": i,
                    "colID": None,
                    "axisX": {"x": xlist},
                    "axisY": {"y": ylist},
                    "img_zlib": None,
                    "simname": f"default_{user_id}",
                    "newname": None,
                    "username": username,
                    "user_id": user_id,
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
@login_required
def genS(message):
    try:
        socketio.sleep(0.5)

        # Access the current user
        if current_user.is_authenticated:
            user_id = current_user.get_id()  # Get the user ID
            username = current_user.username  # Get the username
            print(f"{bcolors.WARNING}user_id{bcolors.ENDC}: {user_id}, {bcolors.WARNING}username{bcolors.ENDC}: {username}")
        else:
            print("No user is currently authenticated.")

        res = message

        #event = {
        #            "confirm": 0,
        #}
        #emit('response', json.dumps(event, cls=npEncoder), room=request.sid)  # Emit to a specific client

        simname = res['simname'] + f"_{user_id}"
        N = int(res['N'])
        Nint = int(res['Nint'])

        objV = getDataV(simname=simname)
        u = objV['u']; v = objV['v']

        params = objV['params']; Np = params['Np']

        print(f"{bcolors.OKBLUE}:: N = {N} :: simname = {simname} {bcolors.ENDC}")

        objP = getDataP(simname=simname)

        P = objP['P']

        # Slice the region around the center with +/- bias
        #region = P[N/2 - bias : N/2 + bias, :]

        bias = 5
        #row, col, Pmax = find_max(abs(region))
        row, col, Pmax = find_max(abs(P[bias:-1][:]))
        #print(f"{bcolors.WARNING}{row, col, Pmax, x[col], y[row]}{bcolors.ENDC}")

        print("len(u): ", len(u))
        print("len(P): ", len(P), "row: ", row, "col: ", col)

        objS = {
            "u": u,
            "v": v,
            "N": N,
        }

        objD = getDataD(simname=simname,Np=Np,Nint=Nint)

        params = objD['params']

        img_chunks, imgP_chunks, img_src, imgP_src = generateStreamlines(objS, objP)

        session.query(StreamlineImg).filter(StreamlineImg.simname == f"default_{user_id}").delete()
        session.query(StreamlineImgP).filter(StreamlineImgP.simname == f"default_{user_id}").delete()
        session.commit()

        for i, chunk in enumerate(img_chunks):
            obj = {
                    "U": params['U'],
                    "Re": params['Re'],
                    "N": N,
                    "Np": Np,
                    "rowID": i,
                    "colID": None,
                    "axisID": "sl",
                    "img_src": chunk.encode('utf-8'),
                    "src": "streamline",
                    "simname": f"default_{user_id}",
                    "newname": None,
                    "username": username,
                    "user_id": user_id,
                }

            saveDefaultStreamlineImg(obj)

        for j, chunkP in enumerate(imgP_chunks):
            obj = {
                    "U": params['U'],
                    "Re": params['Re'],
                    "N": N,
                    "Np": Np,
                    "rowID": j,
                    "colID": None,
                    "axisID": "sl",
                    "imgP_src": chunkP.encode('utf-8'),
                    "simname": f"default_{user_id}",
                    "newname": None,
                    "src": "streamline",
                    "username": username,
                    "user_id": user_id,
                }

            saveDefaultStreamlineImgP(obj)

        Nuv = int(len(u))
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
            cfd["yu"][i][1] = u[i][col+bias]/float(params['U'])
            cfd["xv"][i][0] = x[i]
            cfd["xv"][i][1] = v[row][i]/float(params['U'])

        cfd["yu"][Nuv-1][1] = 1

        x = np.linspace(0,1,N); y = np.linspace(0,1,N)

        event = {
            'x': objD['x'],
            'y': objD['y'],
            'img_src': img_src,
            'imgP_src': imgP_src,
            'cfd': cfd,
            'eye': { 'x': x[col], 'y': y[row+bias], 'value': Pmax }
        }

        print("PMAX: ", Pmax, "col: ", col, "row: ", row)

        emit('response', json.dumps(event, cls=npEncoder), room=request.sid)  # Emit to a specific client
    except Exception as e:
        print(f"An exception occurred: {str(e)}")
        traceback.print_exc()
    finally:
        print("poop /genS")

getRe_clients = set()

@socketio.on('connect', namespace='/getRe')
def getRe_connect():
    print("CONNECTED to /getRe: ")
     # Get the client's SID
    sid = request.sid
    getRe_clients.add(sid)
    emit('sid', {'sid': sid}, room=request.sid)

@socketio.on('disconnect', namespace='/getRe')
def getRe_disconnect():
    print("DISCONNECTED from /getRe")
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
@login_required
def getRe_socket(message):
    try:

        socketio.sleep(0.5)

        res = message

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