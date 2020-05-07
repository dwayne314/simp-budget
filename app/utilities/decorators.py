"""This module contains all of the custom decorators for use in the app"""


from functools import wraps
from flask import abort


def err_if_not_found(model, id_field):
    """Throws a 404 error if the id_field cannot be serialized in the model

    Arguments:
        model (flask_sqlalchemy.model): the model to serialize
        id_field (string): the string passed to the route

    """

    def role_wrapper(func):
        @wraps(func)
        def view_wrapper(*args, **kwargs):

            record = model.serialize_one(kwargs[id_field])
            if not record:
                return abort(404)
            return func(*args, **kwargs)
        return view_wrapper
    return role_wrapper
