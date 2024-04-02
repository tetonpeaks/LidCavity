from flask import Flask, render_template, request, jsonify, g
from flask_sockets import Sockets
from flask_wtf import CSRFProtect

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine, select, String, Column, text, Integer, Float
#from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, declarative_base, validates

import json
import numpy as np
import re
from decimal import *
import time
import gc
import base64
import io

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

# create and initalize Flask app
app = Flask(__name__)

# load the config
app.config.from_object(__name__)

app.config.from_pyfile('settings.py')

app.secret_key = b'_53oi3uriq9pifpff;apl'
csrf = CSRFProtect(app)

LOCALDB_URI="mysql://root:@localhost:3306/velocity"
CLEARDB_URI="mysql://bb0d08a9933f05:c102f0b0084f0d8@us-cluster-east-01.k8s.cleardb.net/heroku_721332a77905189"
URI = LOCALDB_URI

app.config['SQLALCHEMY_DATABASE_URI'] = URI

engine = create_engine(URI, pool_pre_ping=True, echo=False)
Session = sessionmaker(bind=engine)
session = Session()

# create the database
db = SQLAlchemy(app)
from models import Velocity
db.create_all()