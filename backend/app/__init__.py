"""This module contains all of the globals used by the api."""

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from config import Config


# Globals used throughout the application
db = SQLAlchemy()
migrate = Migrate()

def create_app(config_class=Config):
    """Initializes the core application with an application factory

    Returns:
        app (): An instance of the application

    """
    app = Flask(__name__)
    app.config.from_object(config_class)


    # Initialize external plugins
    db.init_app(app)
    migrate.init_app(app, db)


    # Register Blueprints
    from app.api import bp as main_bp
    app.register_blueprint(main_bp, url_prefix='/api')

    from app.errors import bp as errors_bp
    app.register_blueprint(errors_bp)

    return app