from manage import db, app

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import ForeignKey, create_engine, select, String, Column, text, Integer, Float, TIMESTAMP, BLOB
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, declarative_base, validates, relationship
from sqlalchemy.ext import mutable
from flask_login import LoginManager, UserMixin

from werkzeug.security import generate_password_hash, check_password_hash

import datetime
import json

login_manager = LoginManager()
login_manager.init_app(app)

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

mutable.MutableDict.associate_with(JsonEncodedDict)

class PdfDocument(db.Model):
    __tablename__ = 'pdf_documents'

    id = Column(Integer, primary_key=True)
    title = Column(String(255))
    content = Column(db.BLOB)

# Unique: If each user should have a unique JWT token, you can make the column unique.
# This ensures that no two users share the same JWT token. However, keep in mind that
# if a user logs out or needs a new token for some reason, you need a mechanism to handle
# token updates.

class User(UserMixin, db.Model):
    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    is_verified = db.Column(db.Boolean, default=False, nullable=False)
    jwt_token = db.Column(db.String(500), unique=True, nullable=True)
    is_logged_in = db.Column(db.Boolean, default=False, nullable=False)
    is_locked_out = db.Column(db.Boolean, default=False, nullable=False)
    incorrect_attempts = db.Column(db.Integer, default=0, nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def get_id(self):
        return str(self.id)

    def check_is_verified(self):
        return self.is_verified

    def check_jwt_token(self):
        return self.jwt_token

    def check_is_logged_in(self):
        return self.is_logged_in

    def check_is_locked_out(self):
        return self.is_locked_out

    def check_incorrect_attempts(self):
        return self.incorrect_attempts

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# create a table schemas

class Velocity(db.Model):
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
    # consider changing unique = True
    simname = db.Column(db.String(100), unique=False, nullable=True)
    DT = db.Column(TIMESTAMP, default=datetime.datetime.utcnow)

    # Add a foreign key field for the user
    username = db.Column(db.String(50), unique=False, nullable=False)
    user_id = db.Column(db.Integer, ForeignKey('user.id'), nullable=True)

    # Define the relationship with the User model
    user = relationship('User')
    #user = relationship('User', foreign_keys=[username, user_id])

    def __init__(self, U, Re, N, Np, rowID, colID, axisU, axisV, axisID, src, simname, DT, username, user_id=None):
        self.U = U; self.Re = Re; self.N = N; self.Np = Np
        self.rowID = rowID; self.colID = colID
        self.axisU = axisU; self.axisV = axisV
        self.axisID = axisID; self.src = src; self.simname = simname; self.DT = DT
        self.username = username; self.user_id = user_id

    def __repr__(self):
        return f"({self.id}) {self.U} {self.Re} {self.N} {self.Np}\
            {self.rowID} {self.colID} \
            {self.axisU} {self.axisV} \
            {self.axisID} {self.src} {self.simname} {self.DT} \
            {self.username} {self.user_id}"

    """ There seems to be limit on U and/or Re that causes # of particles to no be represented properly on streamline animation, consider capping """
    @validates('U')
    def validate_U(self, key, value):
        min_val = 5; max_val = 100
        if not value == None:
            if not min_val < value <= max_val:
                raise ValueError(f'The velocity must be\nbetween {min_val} and {max_val}')
            return value
    @validates('Re')
    def validate_Re(self, key, value):
        min_val = 200; max_val = 2E4
        if not value == None:
            if not min_val <= value <= max_val:
                raise ValueError(f"The Reynolds' number must be\ngreater than {min_val} and less than or equal to {max_val}")
            return value
    @validates('N')
    def validate_maxN(self, key, value):
        min_val = 10; max_val = 50
        if not value == None:
            if not min_val < value <= max_val:
                raise ValueError(f'Number of control volumes must be\ngreater than {min_val} and less than or equal to {max_val}')
            if value % 2 != 0:
                raise ValueError('Number of control volumes must be an even number')
            return value
    @validates('Np')
    def validate_maxNint(self, key, value):
        min_val = 20; max_val = 500
        if not value == None:
            if not min_val < value <= max_val:
                raise ValueError(f'Number of particles must be\ngreater than {min_val} and less than or equal to {max_val}')
            return value
    @validates('simname')
    def validate_simname(self, key, value):
        min_val = 0; max_val = 100
        if not len(value) == None:
            if not min_val < len(value) <= max_val:
                raise ValueError(f'The simulation name must be\nbetween {min_val} and {max_val} characters')
            return value

class Displacement(db.Model):
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
    #img_zlib = db.Column(JsonEncodedDict)
    img_zlib = db.Column(db.LargeBinary)
    src = db.Column(db.String(100), unique=False, nullable=True)
    simname = db.Column(db.String(100), unique=False, nullable=True)
    DT = db.Column(TIMESTAMP, default=datetime.datetime.utcnow)

    # Add a foreign key field for the user
    username = db.Column(db.String(50), unique=False, nullable=False)
    user_id = db.Column(db.Integer, ForeignKey('user.id'), nullable=True)

    # Define the relationship with the User model
    user = relationship('User')

    def __init__(self, U, Re, N, Np, rowID, colID, axisX, axisY, axisID, img_zlib, src, simname, DT, username, user_id=None):
        self.U = U; self.Re = Re; self.N = N; self.Np = Np
        self.rowID = rowID; self.colID = colID
        self.axisX = axisX; self.axisY = axisY
        self.axisID = axisID; self.img_zlib = img_zlib; self.src = src; self.simname = simname; self.DT = DT
        self.username = username; self.user_id = user_id

    def __repr__(self):
        return f"({self.id}) {self.U} {self.Re} {self.N} {self.Np} \
            {self.rowID} {self.colID} \
            {self.axisX} {self.axisY} \
            {self.axisID} {self.img_zlib} {self.src} {self.simname} {self.DT} \
            {self.username} {self.user_id}"

class Convergence(db.Model):
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

    username = db.Column(db.String(50), unique=False, nullable=False)
    user_id = db.Column(db.Integer, ForeignKey('user.id'), nullable=True)

    user = relationship('User')

    def __init__(self, U, Re, N, Np, resid, src, simname, DT, username, user_id=None):
        self.U = U; self.Re = Re; self.N = N; self.Np = Np
        self.resid = resid
        self.src = src; self.simname = simname; self.DT = DT
        self.username = username; self.user_id = user_id

    def __repr__(self):
        return f"({self.id}) {self.U} {self.Re} {self.N} {self.Np}\
            {self.resid} {self.src} {self.simname} {self.DT} \
            {self.username} {self.user_id}"

class Pressure(db.Model):
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

    # Add a foreign key field for the user
    username = db.Column(db.String(50), unique=False, nullable=False)
    user_id = db.Column(db.Integer, ForeignKey('user.id'), nullable=True)

    # Define the relationship with the User model
    user = relationship('User')

    def __init__(self, U, Re, N, Np, rowID, colID, axisP, axisX, axisY, axisID, src, simname, DT, username, user_id=None):
        self.U = U; self.Re = Re; self.N = N; self.Np = Np
        self.rowID = rowID; self.colID = colID
        self.axisP = axisP; self.axisX = axisX; self.axisY = axisY
        self.axisID = axisID; self.src = src; self.simname = simname; self.DT = DT
        self.username = username; self.user_id = user_id

    def __repr__(self):
        return f"({self.id}) {self.U} {self.Re} {self.N} {self.Np}\
            {self.rowID} {self.colID} \
            {self.axisP} {self.axisX} {self.axisY} \
            {self.axisID} {self.src} {self.simname} {self.DT} \
            {self.username} {self.user_id}"

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

class StreamlineImg(db.Model):
    __tablename__ = "streamlineimg"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    U = db.Column(db.Float, unique=False, nullable=True)
    Re = db.Column(db.Float, unique=False, nullable=True)
    N = db.Column(db.Integer, unique=False, nullable=True)
    Np = db.Column(db.Integer, unique=False, nullable=True)
    rowID = db.Column(db.Integer, unique=False, nullable=True)
    colID = db.Column(db.Integer, unique=False, nullable=True)
    axisID = db.Column(db.String(2), unique=False, nullable=False)
    img_src = db.Column(db.LargeBinary)
    src = db.Column(db.String(100), unique=False, nullable=True)
    simname = db.Column(db.String(100), unique=False, nullable=True)
    DT = db.Column(TIMESTAMP, default=datetime.datetime.utcnow)

    # Add a foreign key field for the user
    username = db.Column(db.String(50), unique=False, nullable=False)
    user_id = db.Column(db.Integer, ForeignKey('user.id'), nullable=True)

    # Define the relationship with the User model
    user = relationship('User')

    def __init__(self, U, Re, N, Np, rowID, colID, axisID, img_src, src, simname, DT, username, user_id=None):
        self.U = U; self.Re = Re; self.N = N; self.Np = Np
        self.rowID = rowID; self.colID = colID
        self.axisID = axisID; self.img_src = img_src; self.src = src; self.simname = simname; self.DT = DT
        self.username = username; self.user_id = user_id

    def __repr__(self):
        return f"({self.id}) {self.U} {self.Re} {self.N} {self.Np} \
            {self.rowID} {self.colID} \
            {self.axisID} {self.img_src} {self.src} {self.simname} {self.DT} \
            {self.username} {self.user_id}"

class StreamlineImgP(db.Model):
    __tablename__ = "streamlineimgp"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    U = db.Column(db.Float, unique=False, nullable=True)
    Re = db.Column(db.Float, unique=False, nullable=True)
    N = db.Column(db.Integer, unique=False, nullable=True)
    Np = db.Column(db.Integer, unique=False, nullable=True)
    rowID = db.Column(db.Integer, unique=False, nullable=True)
    colID = db.Column(db.Integer, unique=False, nullable=True)
    axisID = db.Column(db.String(2), unique=False, nullable=False)
    imgP_src = db.Column(db.LargeBinary)
    src = db.Column(db.String(100), unique=False, nullable=True)
    simname = db.Column(db.String(100), unique=False, nullable=True)
    DT = db.Column(TIMESTAMP, default=datetime.datetime.utcnow)

    # Add a foreign key field for the user
    username = db.Column(db.String(50), unique=False, nullable=False)
    user_id = db.Column(db.Integer, ForeignKey('user.id'), nullable=True)

    # Define the relationship with the User model
    user = relationship('User')

    def __init__(self, U, Re, N, Np, rowID, colID, axisID, imgP_src, src, simname, DT, username, user_id=None):
        self.U = U; self.Re = Re; self.N = N; self.Np = Np
        self.rowID = rowID; self.colID = colID
        self.axisID = axisID; self.imgP_src = imgP_src; self.src = src; self.simname = simname; self.DT = DT
        self.username = username; self.user_id = user_id

    def __repr__(self):
        return f"({self.id}) {self.U} {self.Re} {self.N} {self.Np} \
            {self.rowID} {self.colID} \
            {self.axisID} {self.imgP_src} {self.src} {self.simname} {self.DT} \
            {self.username} {self.user_id}"

class Gaia1982(db.Model):
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