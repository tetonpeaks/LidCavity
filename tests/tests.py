import unittest
from threading import Timer
import time

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.alert import Alert
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.common.keys import Keys


from flask import Flask

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine, Column, text, Integer, Float, CHAR, TIMESTAMP
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, declarative_base, validates

import datetime
import json
import numpy as np

# create and initalize Flask app
app = Flask(__name__)

# load the config
app.config.from_object(__name__)

LOCALDB_URI="mysql://root:@localhost:3306/velocity?charset=utf8mb4"
CLEARDB_URI="mysql://b903c6b1bc6e97:75951fe8@us-cluster-east-01.k8s.cleardb.net/heroku_d3be27c2ed92331?charset=utf8mb4"
URI = LOCALDB_URI

app.config['SQLALCHEMY_DATABASE_URI'] = URI

engine = create_engine(URI, pool_pre_ping=False, echo=False)
Session = sessionmaker(bind=engine)
session = Session()

# create the database
db = SQLAlchemy(app)
db.create_all()

from sqlalchemy.ext import mutable
class JsonEncodedDict(db.TypeDecorator):
    """Enables JSON storage by encoding and decoding on the fly."""
    impl = db.Text

    cache_ok = True

    def process_bind_param(self, value, dialect):
        if value is None:
            return '{}'
        else:
            return json.dumps(value)

    def process_result_value(self, value, dialect):
        if value is None:
            return {}
        else:
            return json.loads(value)

Base = declarative_base()
# create a table schemas

class Velocity(Base):
    __tablename__ = "cfd"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    U = db.Column(db.Float, unique=False, nullable=True)
    Re = db.Column(db.Float, unique=False, nullable=True)
    N = db.Column(db.Integer, unique=False, nullable=True)
    Np = db.Column(db.Integer, unique=False, nullable=True)
    rowID = db.Column(db.Integer, unique=False, nullable=True)
    colID = db.Column(db.Integer, unique=False, nullable=True)
    axisU = db.Column(JsonEncodedDict)
    axisV = db.Column(JsonEncodedDict)
    axisID = db.Column(db.String(2), unique=False, nullable=False)
    src = db.Column(db.String(100), unique=False, nullable=True)
    simname = db.Column(db.String(100), unique=False, nullable=True)
    DT = db.Column(TIMESTAMP, default=datetime.datetime.utcnow)

    def __init__(self, U, Re, N, Np, rowID, colID, axisU, axisV, axisID, src, simname, DT):
        self.U = U; self.Re = Re; self.N = N; self.Np = Np
        self.rowID = rowID; self.colID = colID
        self.axisU = axisU; self.axisV = axisV
        self.axisID = axisID; self.src = src; self.simname = simname; self.DT = DT

    def __repr__(self):
        return f"({self.id}) {self.U} {self.Re} {self.N} {self.Np}\
            {self.rowID} {self.colID} \
            {self.axisU} {self.axisV} \
                {self.axisID} {self.src} {self.simname} {self.DT}"

    @validates('U')
    def validate_U(self, key, value):
        min = 0; max = 100
        if not value == None:
            if not min < value <= max:
                raise ValueError(f'The velocity must be \
                                    between ${min} and ${max}')
            return value
    @validates('Re')
    def validate_Re(self, key, value):
        min = 0; max = 1E4
        if not value == None:
            if not min < value <= max:
                raise ValueError(f"The Reynolds' number must be \
                                 greater than ${min} and less than or equal to ${max}")
            return value
    @validates('N')
    def validate_maxN(self, key, value):
        min = 10; max = 120
        if not value == None:
            if not min < value <= max:
                raise ValueError(f'Number of control volumes must be \
                                greater than ${min} and less than or equal to ${max}')
            return value
    @validates('Np')
    def validate_maxNint(self, key, value):
        min = 0; max = 500
        if not value == None:
            if not min < value <= max:
                raise ValueError(f'Number of particles must be \
                                greater than ${min} and less than or equal to ${max}')
            return value
    @validates('simname')
    def validate_simname(self, key, value):
        min = 0; max = 100
        if not len(value) == None:
            if not min < len(value) <= max:
                raise ValueError(f'The simulation name must be \
                                    between ${min} and ${max} characters')
            return value

class Pressure(Base):
    __tablename__ = "pressure"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    U = db.Column(db.Float, unique=False, nullable=True)
    Re = db.Column(db.Float, unique=False, nullable=True)
    N = db.Column(db.Integer, unique=False, nullable=True)
    Np = db.Column(db.Integer, unique=False, nullable=True)
    rowID = db.Column(db.Integer, unique=False, nullable=True)
    colID = db.Column(db.Integer, unique=False, nullable=True)
    axisP = db.Column(JsonEncodedDict)
    axisX = db.Column(JsonEncodedDict)
    axisY = db.Column(JsonEncodedDict)
    axisID = db.Column(db.String(2), unique=False, nullable=False)
    src = db.Column(db.String(100), unique=False, nullable=True)
    # consider changing unique = True
    simname = db.Column(db.String(100), unique=False, nullable=True)
    DT = db.Column(TIMESTAMP, default=datetime.datetime.utcnow)

    def __init__(self, U, Re, N, Np, rowID, colID, axisP, axisX, axisY, axisID, src, simname, DT):
        self.U = U; self.Re = Re; self.N = N; self.Np = Np
        self.rowID = rowID; self.colID = colID
        self.axisP; self.axisX = axisX; self.axisX = axisX
        self.axisID = axisID; self.src = src; self.simname = simname; self.DT = DT

    def __repr__(self):
        return f"({self.id}) {self.U} {self.Re} {self.N} {self.Np}\
            {self.rowID} {self.colID} \
            {self.axisP} {self.axisX} {self.axisY} \
                {self.axisID} {self.src} {self.simname} {self.DT}"

    @validates('U')
    def validate_U(self, key, value):
        min = 0; max = 100
        if not value == None:
            if not min < value <= max:
                raise ValueError(f'The velocity must be \
                                    between ${min} and ${max}')
            return value
    @validates('Re')
    def validate_Re(self, key, value):
        min = 0; max = 1E5
        if not value == None:
            if not min < value <= max:
                raise ValueError(f"The Reynolds' number must be \
                                 greater than ${min} and less than or equal to ${max}")
            return value
    @validates('N')
    def validate_maxN(self, key, value):
        min = 10; max = 120
        if not value == None:
            if not min < value <= max:
                raise ValueError(f'Number of control volumes must be \
                                greater than ${min} and less than or equal to ${max}')
            return value
    @validates('Np')
    def validate_maxNint(self, key, value):
        min = 0; max = 500
        if not value == None:
            if not min < value <= max:
                raise ValueError(f'Number of particles must be \
                                greater than ${min} and less than or equal to ${max}')
            return value
    @validates('simname')
    def validate_simname(self, key, value):
        min = 0; max = 100
        if not len(value) == None:
            if not min < len(value) <= max:
                raise ValueError(f'The simulation name must be \
                                    between ${min} and ${max} characters')
            return value

class Displacement(Base):
    __tablename__ = "displacement"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    U = db.Column(db.Float, unique=False, nullable=True)
    Re = db.Column(db.Float, unique=False, nullable=True)
    N = db.Column(db.Integer, unique=False, nullable=True)
    Np = db.Column(db.Integer, unique=False, nullable=True)
    rowID = db.Column(db.Integer, unique=False, nullable=True)
    colID = db.Column(db.Integer, unique=False, nullable=True)
    axisX = db.Column(JsonEncodedDict)
    axisY = db.Column(JsonEncodedDict)
    axisID = db.Column(db.String(2), unique=False, nullable=False)
    src = db.Column(db.String(100), unique=False, nullable=True)
    # consider changing unique = True
    simname = db.Column(db.String(100), unique=False, nullable=True)
    DT = db.Column(TIMESTAMP, default=datetime.datetime.utcnow)

    def __init__(self, U, Re, N, Np, rowID, colID, axisX, axisY, axisID, src, simname, DT):
        self.U = U; self.Re = Re; self.N = N; self.Np = Np
        self.rowID = rowID; self.colID = colID
        self.axisX = axisX; self.axisY = axisY
        self.axisID = axisID; self.src = src; self.simname = simname; self.DT = DT

    def __repr__(self):
        return f"({self.id}) {self.U} {self.Re} {self.N} {self.Np}\
            {self.rowID} {self.colID} \
            {self.axisX} {self.axisY} \
                {self.axisID} {self.src} {self.simname} {self.DT}"

    @validates('U')
    def validate_U(self, key, value):
        min = 0; max = 100
        if not value == None:
            if not min < value <= max:
                raise ValueError(f'The velocity must be \
                                    between ${min} and ${max}')
            return value
    @validates('Re')
    def validate_Re(self, key, value):
        min = 0; max = 1E4
        if not value == None:
            if not min < value <= max:
                raise ValueError(f"The Reynolds' number must be \
                                 greater than ${min} and less than or equal to ${max}")
            return value
    @validates('N')
    def validate_maxN(self, key, value):
        min = 10; max = 120
        if not value == None:
            if not min < value <= max:
                raise ValueError(f'Number of control volumes must be \
                                greater than ${min} and less than or equal to ${max}')
            return value
    @validates('Np')
    def validate_maxNint(self, key, value):
        min = 0; max = 500
        if not value == None:
            if not min < value <= max:
                raise ValueError(f'Number of particles must be \
                                greater than ${min} and less than or equal to ${max}')
            return value
    @validates('simname')
    def validate_simname(self, key, value):
        min = 0; max = 100
        if not len(value) == None:
            if not min < len(value) <= max:
                raise ValueError(f'The simulation name must be \
                                    between ${min} and ${max} characters')
            return value

class Convergence(Base):
    __tablename__ = "convergence"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    U = db.Column(db.Float, unique=False, nullable=True)
    Re = db.Column(db.Float, unique=False, nullable=True)
    N = db.Column(db.Integer, unique=False, nullable=True)
    Np = db.Column(db.Integer, unique=False, nullable=True)
    resid = db.Column(JsonEncodedDict)
    src = db.Column(db.String(100), unique=False, nullable=True)
    # consider changing unique = True
    simname = db.Column(db.String(100), unique=False, nullable=True)
    DT = db.Column(TIMESTAMP, default=datetime.datetime.utcnow)

    def __init__(self, U, Re, N, Np, resid, src, simname, DT):
        self.U = U; self.Re = Re; self.N = N; self.Np = Np
        self.resid = resid
        self.src = src; self.simname = simname; self.DT = DT

    def __repr__(self):
        return f"({self.id}) {self.U} {self.Re} {self.N} {self.Np}\
            {self.resid} {self.src} {self.simname} {self.DT}"

    @validates('U')
    def validate_U(self, key, value):
        min = 0; max = 100
        if not value == None:
            if not min < value <= max:
                raise ValueError(f'The velocity must be \
                                    between ${min} and ${max}')
            return value
    @validates('Re')
    def validate_Re(self, key, value):
        min = 0; max = 1E4
        if not value == None:
            if not min < value <= max:
                raise ValueError(f"The Reynolds' number must be \
                                 greater than ${min} and less than or equal to ${max}")
            return value
    @validates('N')
    def validate_maxN(self, key, value):
        min = 10; max = 120
        if not value == None:
            if not min < value <= max:
                raise ValueError(f'Number of control volumes must be \
                                greater than ${min} and less than or equal to ${max}')
            return value
    @validates('Np')
    def validate_maxNint(self, key, value):
        min = 0; max = 500
        if not value == None:
            if not min < value <= max:
                raise ValueError(f'Number of particles must be \
                                greater than ${min} and less than or equal to ${max}')
            return value
    @validates('simname')
    def validate_simname(self, key, value):
        min = 0; max = 100
        if not len(value) == None:
            if not min < len(value) <= max:
                raise ValueError(f'The simulation name must be \
                                    between ${min} and ${max} characters')
            return value

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

    print(f"{bcolors.OKCYAN} params: {params} {bcolors.ENDC}")

    print(f"{bcolors.OKGREEN} '{simname}' displacement successfully retreived.{bcolors.ENDC}")

    data = { "x": x, "y": y }

    obj = { "x": x, "y": y, "params": params }

    session.close()
    engine.dispose()

    return obj

def getDataC(simname):

    print(f"{bcolors.OKGREEN}Retreiving {simname} displacement... {bcolors.ENDC}")
    """ retreive x and y displacements from DB """

    rows = session.query(Convergence).filter_by(simname=simname)
    rows = rows.all()

    print(f"{bcolors.OKGREEN} '{simname}' velocity successfully retreived.{bcolors.ENDC}")

    params = {
        "U": rows[0].U,
        "Re": rows[0].Re,
        "N": rows[0].N,
        "Np": rows[0].Np,
        "simname": rows[0].simname,
        }

    print(f"{bcolors.OKCYAN} params: {params} {bcolors.ENDC}")

    obj = { "resid": rows[0].resid, "params": params }

    session.close()
    engine.dispose()

    return obj

def p2Con():
    return 0

# Finds the Uniform Resourse Identifier of a file
def getURI(endstr):
    return f"http://0.0.0.0:8080/{endstr}"
    #return pathlib.Path(os.path.abspath(filename)).as_uri()

uri = getURI("simulate")
op = Options()
op.add_argument('--headless')

""" # may have issue next time you run test, see test_run implementation
    obj = getDataD(simname=simname,Np=int(Np.get_attribute('value')),Nint=int(250)) """

# Standard outline of testing class
class CFDTests(unittest.TestCase):

    def test_stream(self):
        test_description = "Ensure the particles can be animated"
        print(f"{bcolors.OKGREEN} Running test '{test_description}'{bcolors.ENDC}")

        with webdriver.Firefox(options=op) as driver:

            driver.get(uri)

            simname = "default"; Re = 400

            input_Re = driver.find_element(By.ID, "input-Re")
            input_Re.clear()
            input_Re.send_keys(Re)

            time.sleep(1)

            run = driver.find_element(By.ID, "fvm")
            driver.execute_script("arguments[0].click();", run)

            time.sleep(3)

            uv = driver.find_element(By.ID, "uv")
            driver.execute_script("arguments[0].click();", uv)

            time.sleep(3)

            stream = driver.find_element(By.ID, "streamline")
            driver.execute_script("arguments[0].click();", stream)

            time.sleep(8)

            self.assertEqual(None, None)

    def test_integrate(self):
        Base.metadata.drop_all(engine)
        Base.metadata.create_all(engine)

        test_description = "Ensure the velocity data can be integrated"
        print(f"{bcolors.OKGREEN} Running test '{test_description}'{bcolors.ENDC}")

        with webdriver.Firefox(options=op) as driver:

            driver.get(uri)

            simname = "default"; Re = 400

            Np = driver.find_element(By.ID, "input-Np")

            input_Re = driver.find_element(By.ID, "input-Re")
            input_Re.clear()
            input_Re.send_keys(Re)

            run = driver.find_element(By.ID, "fvm")
            driver.execute_script("arguments[0].click();", run)

            time.sleep(1.5)

            uv = driver.find_element(By.ID, "uv")
            driver.execute_script("arguments[0].click();", uv)

            time.sleep(1.5)

            # may have issue next time you run test, see test_run implementation
            obj = getDataD(simname=simname,Np=int(Np.get_attribute('value')),Nint=int(250))

            self.assertGreater(len(obj['x']), 0)

    def test_run(self):
        Base.metadata.drop_all(engine)
        Base.metadata.create_all(engine)

        test_description = "Ensure a simulation can be successfully completed and written to DB"
        print(f"{bcolors.OKGREEN} Running test '{test_description}'{bcolors.ENDC}")

        with webdriver.Firefox(options=op) as driver:

            driver.get(uri)

            simname = "default"; Re = 400

            input_Re = driver.find_element(By.ID, "input-Re")
            input_Re.clear()
            input_Re.send_keys(Re)

            run = driver.find_element(By.ID, "fvm")
            driver.execute_script("arguments[0].click();", run)

            """ This is important """
            time.sleep(3)

            obj = getDataV(simname=simname)

            self.assertEqual(obj['params']['Re'], Re)

            obj = getDataP(simname=simname)

            self.assertEqual(obj['params']['Re'], Re)

            obj = getDataC(simname=simname)

            self.assertEqual(obj['params']['Re'], Re)

            driver.quit()

    def test_load(self):
        Base.metadata.drop_all(engine)
        Base.metadata.create_all(engine)

        test_description = "Ensure simulation data can be pulled from DB"
        print(f"{bcolors.OKGREEN} Running test '{test_description}' {bcolors.ENDC}")

        with webdriver.Chrome() as driver:

            driver.get(uri)

            simname = "My First Simulation"; Re = 750
            Np = driver.find_element(By.ID, "input-Np")

            input_Re = driver.find_element(By.ID, "input-Re")
            input_Re.clear()
            input_Re.send_keys(Re)

            time.sleep(3)

            run = driver.find_element(By.ID, "fvm")
            driver.execute_script("arguments[0].click();", run)

            time.sleep(3)

            uv = driver.find_element(By.ID, "uv")
            driver.execute_script("arguments[0].click();", uv)

            time.sleep(3)

            save = driver.find_element(By.ID, "save")
            driver.execute_script("arguments[0].click();", save)

            ## Prompt ##
            # Store the alert in a variable for reuse
            alert = Alert(driver); alert.send_keys(simname); time.sleep(1); alert.accept()

            # Wait for the alert to be displayed (need this for prompts, not alerts)
            WebDriverWait(driver, 10).until(EC.alert_is_present())

            ## ALERT ##
            # Store the alert in a variable for reuse
            alert = Alert(driver); time.sleep(1); alert.accept()

            time.sleep(3)

            load = driver.find_element(By.ID, "retreive")
            driver.execute_script("arguments[0].click();", load)

            # Find the dropdown element by class name
            dropdown = driver.find_element(By.CLASS_NAME, 'dd-menu')

            # Locate the "My First Simulation" option within the dropdown
            option = dropdown.find_element(By.XPATH, ".//li[text()='My First Simulation']")

            # Click on the "My First Simulation" option
            option.click()

            """ Important for socket to stay connected """
            time.sleep(10)

            """ # Store the alert in a variable for reuse
            alert = Alert(driver); alert.send_keys(simname); time.sleep(1); alert.accept()

            #time.sleep(3)

            # Wait for the alert to be displayed (need this for prompts, not alerts)
            #WebDriverWait(driver, 10).until(EC.alert_is_present())

            # Store the alert in a variable for reuse
            alert = Alert(driver)

            time.sleep(3)

            alert.accept() """

            objV = getDataV(simname=simname)
            self.assertEqual(objV['params']['Re'], Re)
            objP = getDataP(simname=simname)
            self.assertEqual(objP['params']['Re'], Re)
            objD = getDataD(simname=simname,Np=int(Np.get_attribute('value')),Nint=int(250))
            self.assertEqual(objD['params']['Re'], Re)
            objC = getDataC(simname=simname)
            self.assertEqual(objC['params']['Re'], Re)

            driver.quit()

    def test_update_default(self):
        Base.metadata.drop_all(engine)
        Base.metadata.create_all(engine)

        test_description = "Ensure saved simulation can be updated"
        print(f"{bcolors.OKGREEN} Running test '{test_description}' {bcolors.ENDC}")

        with webdriver.Firefox(options=op) as driver:

            driver.get(uri)

            simname = "default"; Re = 1000

            input_Re = driver.find_element(By.ID, "input-Re")
            input_Re.clear()
            input_Re.send_keys(Re)
            #WebDriverWait(driver, 20).until(EC.element_to_be_clickable((By.XPATH, "//input[@class='star star-5' and @id='star-5'][@name='star' and @value='5']"))).click()

            run = driver.find_element(By.ID, "fvm")
            driver.execute_script("arguments[0].click();", run)

            time.sleep(3)

            obj = getDataV(simname=simname)

            self.assertEqual(obj['params']['Re'], Re)

            driver.quit()

    def test_save(self):
        Base.metadata.drop_all(engine)
        Base.metadata.create_all(engine)

        test_description = "Ensure a simulation can be saved by the user"
        print(f"{bcolors.OKGREEN} Running test '{test_description}'{bcolors.ENDC}")

        with webdriver.Firefox() as driver:

            driver.get(uri)

            simname = 'My First Simulation'; Re = 999

            input_Re = driver.find_element(By.ID, "input-Re")
            input_Re.clear()
            input_Re.send_keys(Re)

            run = driver.find_element(By.ID, "fvm")
            driver.execute_script("arguments[0].click();", run)

            time.sleep(3)

            uv = driver.find_element(By.ID, "uv")
            driver.execute_script("arguments[0].click();", uv)

            time.sleep(3)

            save = driver.find_element(By.ID, "save")
            driver.execute_script("arguments[0].click();", save)

            ## Prompt ##
            # Store the alert in a variable for reuse
            alert = Alert(driver); alert.send_keys(simname); time.sleep(1); alert.accept()

            # Wait for the alert to be displayed (need this for prompts, not alerts)
            WebDriverWait(driver, 10).until(EC.alert_is_present())

            ## ALERT ##
            # Store the alert in a variable for reuse
            alert = Alert(driver); time.sleep(1); alert.accept()

            obj = getDataV(simname=simname)

            self.assertEqual(obj['params']['Re'], Re)

            driver.quit()

    def test_save_update(self):
        test_description = "Ensure an existing simulation can be updated by the user"
        print(f"{bcolors.OKGREEN} Running test '{test_description}'{bcolors.ENDC}")

        with webdriver.Chrome() as driver:

            driver.get(uri)

            simname = 'My Second Simulation'; Re = 400

            input_Re = driver.find_element(By.ID, "input-Re")
            input_Re.clear()
            input_Re.send_keys(Re)

            run = driver.find_element(By.ID, "fvm")
            driver.execute_script("arguments[0].click();", run)

            time.sleep(3)

            save = driver.find_element(By.ID, "save")
            driver.execute_script("arguments[0].click();", save)

            ## Prompt ##
            # Store the alert in a variable for reuse
            alert = Alert(driver); alert.send_keys(simname); time.sleep(1); alert.accept()

            ## CONFIRM ##
            # Store the alert in a variable for reuse
            alert = Alert(driver); time.sleep(1); alert.accept()

            ## Overrite existing simulation data to DB ##

            save = driver.find_element(By.ID, "save")
            driver.execute_script("arguments[0].click();", save)

            # Wait for the alert to be displayed (need this for prompts, not alerts)
            WebDriverWait(driver, 10).until(EC.alert_is_present())

            ## PROMPT ##
            # Store the alert in a variable for reuse
            alert = Alert(driver); time.sleep(1); alert.accept()

            ## CONFIRM ##
            # Store the alert in a variable for reuse
            alert = Alert(driver); time.sleep(1); alert.accept()

            obj = getDataV(simname=simname)

            self.assertGreater(obj['DT'], datetime.datetime.now())

            driver.quit()

#Tests = WebpageTests()
#Tests.test_title()
#Tests.test_run()

if __name__ == "__main__":
    unittest.main()