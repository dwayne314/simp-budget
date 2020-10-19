"""This module contains all of the globals used by the api."""

import os
import logging
from logging.handlers import RotatingFileHandler
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_mail import Mail
from config import Config, ProdConfig, StagingConfig, DevelopmentConfig


# Globals used throughout the application
db = SQLAlchemy()
migrate = Migrate()
mail = Mail()

def create_app():
    """Initializes the core application with an application factory

    Returns:
        app (): An instance of the application

    """
    app = Flask(__name__)
    app_environment = os.environ.get("ENVIRONMENT")

    if app_environment == 'PRODUCTION':
        app.config.from_object(ProdConfig)
    elif app_environment == 'STAGING':
        app.config.from_object(StagingConfig)
    elif app_environment == 'DEVELOPMENT':
        app.config.from_object(DevelopmentConfig)
    else:
        app.config.from_object(Config)


    # Initialize external plugins
    db.init_app(app)
    migrate.init_app(app, db)
    mail.init_app(app)


    # Register Blueprints
    from app.api import bp as main_bp
    app.register_blueprint(main_bp, url_prefix='/api')

    from app.errors import bp as errors_bp
    app.register_blueprint(errors_bp)

    from app.email import bp as email_bd
    app.register_blueprint(email_bd, url_prefix='/email')


    # Set up logs
    if not os.path.exists('logs'):
        os.mkdir('logs')
    file_handler = RotatingFileHandler('logs/api.log', maxBytes=10240,
                                       backupCount=10)
    file_handler.setFormatter(logging.Formatter(
        '%(asctime)s %(levelname)s: %(message)s '
        '[in %(pathname)s:%(lineno)d]'))
    file_handler.setLevel(logging.INFO)
    app.logger.addHandler(file_handler)

    app.logger.setLevel(logging.INFO)
    app.logger.info(f'Simpbudget startup in {app_environment} environment.')


    return app
