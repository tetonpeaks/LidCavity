""" import environ from os so we have access to our environment variables """
import os
from os import environ

from flask_cors import CORS
from flask_wtf.csrf import CSRFProtect

SECRET_KEY = environ.get('SECRET_KEY')

AWS_ACCESS_KEY = environ.get('AWS_ACCESS_KEY')
AWS_SECRET_KEY = environ.get('AWS_SECRET_KEY')
S3_BUCKET = 'lidcavitybucket'

LOCALDB_URI = environ.get('LOCALDB_URI')
CLEARDB_URI = environ.get('CLEARDB_DATABASE_URL')

MAILGUN_SMTP_LOGIN = environ.get('MAILGUN_SMTP_LOGIN')
MAILGUN_SMTP_PASSWORD = environ.get('MAILGUN_SMTP_PASSWORD')
MAILGUN_SMTP_SERVER = environ.get('MAILGUN_SMTP_SERVER')
MAILGUN_SMTP_PORT = environ.get('MAILGUN_SMTP_PORT')

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

print(F"{bcolors.WARNING} os.environ.get('FLASK_ENV'): {bcolors.ENDC}{os.environ.get('FLASK_ENV')}")
#print(f"{bcolors.WARNING} MAILGUN_SMTP_SERVER: {bcolors.ENDC}{MAILGUN_SMTP_SERVER}")
#print(f"{bcolors.WARNING} MAILGUN_SMTP_PORT: {bcolors.ENDC}{MAILGUN_SMTP_PORT}")

class Config:
    DEBUG = True

class LocalConfig(Config):
    WTF_CSRF_ENABLED = True

    SQLALCHEMY_DATABASE_URI = LOCALDB_URI
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    """ MAIL_SERVER = 'sandbox.smtp.mailtrap.io'
    MAIL_PORT = 2525
    MAIL_USE_TLS = True
    MAIL_USE_SSL = False
    MAIL_USERNAME = environ.get('MAIL_USERNAME')
    MAIL_PASSWORD = environ.get('MAIL_PASSWORD')
    MAIL_DEFAULT_SENDER = 'stephen.l.hodson@gmail.com' """
    MAIL_SERVER = MAILGUN_SMTP_SERVER
    MAIL_PORT = MAILGUN_SMTP_PORT
    MAIL_USE_TLS = True
    MAIL_USE_SSL = False
    MAIL_USERNAME = MAILGUN_SMTP_LOGIN
    MAIL_PASSWORD = MAILGUN_SMTP_PASSWORD
    MAIL_DEFAULT_SENDER = 'stephen.l.hodson@gmail.com'

class ProdConfig(Config):
    WTF_CSRF_ENABLED = True

    DEBUG = False
    SQLALCHEMY_DATABASE_URI = CLEARDB_URI
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    MAIL_SERVER = MAILGUN_SMTP_SERVER
    MAIL_PORT = MAILGUN_SMTP_PORT
    MAIL_USE_TLS = True
    MAIL_USE_SSL = False
    MAIL_USERNAME = MAILGUN_SMTP_LOGIN
    MAIL_PASSWORD = MAILGUN_SMTP_PASSWORD
    MAIL_DEFAULT_SENDER = 'stephen.l.hodson@gmail.com'

CORS_ALLOWED_ORIGINS = ["https://localhost:8080", "https://desolate-bastion-69064.herokuapp.com/"]

csrf = CSRFProtect()
cors = CORS()

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

def load_config():
    if os.environ.get('FLASK_ENV') == 'production':
        return ProdConfig()
    else:
        print("In LocalConfig")
        return LocalConfig()