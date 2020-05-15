"""This module contains all of the error handlers for the application"""


from app import db
from app.errors import bp

@bp.app_errorhandler(400)
def validation_error(error):
    db.session.rollback()
    return {'success': False, 'error': error.description}, 400

@bp.app_errorhandler(401)
def authentication_error(error):
    db.session.rollback()
    return {'success': False, 'error': 'Authentication error'}, 401

@bp.app_errorhandler(403)
def authorization_error(error):
    db.session.rollback()
    return {'success': False, 'error': 'Authorizatiion error'}, 403

@bp.app_errorhandler(404)
def internal_error(error):
    db.session.rollback()
    return {'success': False, 'error': 'Resource not found'}, 404

@bp.app_errorhandler(500)
def unknown_error(error):
    db.session.rollback()
    return {'success': False, 'error': 'An unexpected error has occured'}, 500
