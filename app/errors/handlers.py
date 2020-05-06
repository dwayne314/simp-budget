"""This module contains all of the error handlers for the application"""


from app import db
from app.errors import bp

@bp.app_errorhandler(400)
def validation_error(error):
    db.session.rollback()
    return {'success': False, 'error': error.description}, 400

@bp.app_errorhandler(404)
def internal_error(error):
    db.session.rollback()
    return {'success': False, 'error': 'Resource not found'}, 404

@bp.app_errorhandler(500)
def unknown_error(error):
    db.session.rollback()
    return {'success': False, 'error': 'An unexpected error has occured'}, 500
