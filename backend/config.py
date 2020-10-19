"""This module contains the base and test configurations for the app"""

import os
from dotenv import load_dotenv
from secretManager import SecretManager


base_dir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(base_dir, '.env'))
secret = SecretManager()


class Config:
    """The base config class for the application"""
    APP_NAME = secret.get('APP_NAME')
    SECRET_KEY = secret.get('SECRET_KEY')
    SQLALCHEMY_DATABASE_URI = secret.get('DATABASE_URI')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SESSION_COOKIE_SECURE = False
    MAIL_USERNAME = secret.get('MAIL_USERNAME')
    MAIL_USERNAME = secret.get('MAIL_USERNAME')
    MAIL_PASSWORD = secret.get('MAIL_PASSWORD')
    MAIL_PORT = secret.get('MAIL_PORT')
    MAIL_SERVER = secret.get('MAIL_SERVER')
    MAIL_USE_TLS = secret.get('MAIL_USE_TLS')
    MAIL_DEBUG = False

class DevelopmentConfig(Config):
    """The development config class for the application"""
    FRONTEND_HOST_NAME = 'http://localhost:3000/'


class StagingConfig(Config):
    """The staging config class for the application"""
    FRONTEND_HOST_NAME = 'http://simpbudgetstaging-env.eba-zqucjvya.us-east-2.elasticbeanstalk.com/'


class ProdConfig(Config):
    """The production config class for the application"""
    SESSION_COOKIE_SECURE = True
    FRONTEND_HOST_NAME = 'https://simpbudget.com/'


class TestConfig(Config):
    """The test config for the application"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite://'
