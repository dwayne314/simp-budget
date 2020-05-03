"""This module contains the base and test configurations for the app"""

import os
from dotenv import load_dotenv


base_dir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(base_dir, '.env'))

class Config:
    """The base config class for the application"""
    APP_NAME = os.environ.get('APP_NAME') or 'api'
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'secret-key'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(base_dir, 'app.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False


class TestConfig(Config):
    """The test config for the application"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite://'
