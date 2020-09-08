"""This module contains all of the application's authentication routes"""

from datetime import datetime
from flask import g, abort, request, redirect
from flask_httpauth import HTTPBasicAuth, HTTPTokenAuth
from app import db
from app.models import Users
from app.utilities.decorators import extract_auth_token
from app.api import bp


basic_auth = HTTPBasicAuth()
token_auth = HTTPTokenAuth()


@basic_auth.verify_password
def verify_password(email, password):
    """Returns True if the login credentials are valid, otherwise False"""
    user = Users.query.filter_by(email=email).first()
    if user is None:
        return False
    g.current_user = user
    return user.validate_password(password)

@basic_auth.error_handler
def basic_auth_error():
    """Throws a 401 error if authentication is failed"""
    return abort(401)

@token_auth.verify_token
@extract_auth_token('auth_token')
def verify_token(token, auth_from_cookie=None):
    """Returns True if the token is validated

    The token that will be validated is chosen in the following order:
        1) A Bearer Token - reetrieved from the authorization header
        2) A cookie - reetrieved from the auth_token cookie

    """

    token_to_verify = token if token else auth_from_cookie
    g.current_user = Users.check_token(token_to_verify) if token_to_verify else None
    return g.current_user is not None

@bp.route('/verifyEmail/<token>', methods=['POST'])
def verify_email(token):
    """Updated the users email verification date if the web token is valid"""
    user = Users.verify_web_token(token)
    if user:
        setattr(user, 'email_verified_at', datetime.utcnow())
        db.session.commit()
        return {'status': 'success'}
    return abort(401)

@token_auth.error_handler
def token_auth_error():
    """Throws a 401 error if there is an authentication issue"""
    return abort(401)
