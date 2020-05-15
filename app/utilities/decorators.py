"""This module contains all of the custom decorators for use in the app"""


from functools import wraps
from flask import abort, g


def err_if_not_found(model, id_field):
    """Throws a 404 error if the id_field cannot be serialized in the model

    Arguments:
        model (flask_sqlalchemy.model): the model to serialize
        id_field (string): the string passed to the route


    Returns:
        json: the JSON response for a 404 error
        func: the original route function

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
    """Restricts route access to a supplied list of roles

    Arguments:
        roles (lsit): the roles required to access the route

    Returns:
        json: the JSON response for a 403 error
        func: the original route function

    """

    def wrapper(func):
        @wraps(func)
        def view_wrapper(*args, **kwargs):
            if g.current_user.role not in roles:
                return abort(403)
            return func(*args, **kwargs)
        return view_wrapper
    return wrapper

def enforce_owner_by_id(id_field, exclude_roles=[]):
    """Restricts route access to the current user

    Arguments:
        id_field (str): the route field name containing the owners id
        exclude_roles (lsit): user roles excluded from the validation

    Returns:
        json: the JSON response for a 403 error
        func: the original route function

    """

    def error_wrapper(func):
        @wraps(func)
        def view_wrapper(*args, **kwargs):
            if g.current_user.id != kwargs[id_field] and \
                    g.current_user.role not in exclude_roles:
                return abort(403)
            return func(*args, **kwargs)
        return view_wrapper
    return error_wrapper
