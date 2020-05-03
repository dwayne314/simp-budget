"""This module contains all of the api routes"""

from flask import current_app
from app.api import bp


@bp.route('/', methods=['GET', 'PPOST'])
def index():
    """The api index route"""
    return dict(version=1, app_name=current_app.config['APP_NAME'])
