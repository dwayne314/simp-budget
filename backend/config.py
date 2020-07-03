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


class ProdConfig:
    """The production config class for the application"""
    APP_NAME = secret.get('APP_NAME')
    SECRET_KEY = secret.get('SECRET_KEY')
    SQLALCHEMY_DATABASE_URI = secret.get('DATABASE_URI')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SESSION_COOKIE_SECURE = True


class TestConfig(Config):
    """The test config for the application"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite://'
