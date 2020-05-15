"""This module contains all of the custom decorators for use in the app"""


from functools import wraps
from flask import abort, g


def err_if_not_found(model, id_field):
    """Throws a 404 error if the id_field cannot be serialized in the model

    Arguments:
        model (flask_sqlalchemy.model): the model to serialize
        id_field (string): the string passed to the route

    """

    def error_wrapper(func):
        @wraps(func)
        def view_wrapper(*args, **kwargs):

            record = model.serialize_one(kwargs[id_field])
            if not record:
                return abort(404)
            return func(*args, **kwargs)
        return view_wrapper
    return error_wrapper

def roles_required(roles):
    """Throws a 403 error if a user does not have an acceptable role"""

    def wrapper(func):
        @wraps(func)
        def view_wrapper(*args, **kwargs):
            if g.current_user.role not in roles:
                return abort(403)
            return func(*args, **kwargs)
        return view_wrapper
    return wrapper
