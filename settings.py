""" import environ from os so we have access to our environment variables """
from os import environ

SECRET_KEY = environ.get('SECRET_KEY')
API_KEY = environ.get('API_KEY')