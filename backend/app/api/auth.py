from flask import g, abort, request
from flask_httpauth import HTTPBasicAuth, HTTPTokenAuth
from app.models import Users


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
def verify_token(token):
    """Returns True if the token is validated otherwise return False"""
    g.current_user = Users.check_token(token) if token else None
    return g.current_user is not None

@token_auth.error_handler
def token_auth_error():
    """Throws a 401 error if there is an authentication issue"""
    return abort(401)
