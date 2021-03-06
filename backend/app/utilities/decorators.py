"""This module contains all of the custom decorators for use in the app"""


from functools import wraps
from flask import abort, g, request, session
from app.models import Accounts, Transactions, RecurringTransactions


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

    def wrapper(func):
        @wraps(func)
        def view_wrapper(*args, **kwargs):
            if g.current_user.id != kwargs[id_field] and \
                    g.current_user.role not in exclude_roles:
                return abort(403)
            return func(*args, **kwargs)
        return view_wrapper
    return wrapper


def add_child_result(parent_id_field, child_id_field):
    """Attaches a "result" kwarg to a view with a resource

    The resource attached to the view is the resource that owns a view's
    child_id_field as long as the resource is owned by the view's
    parent_id_field.

    Arguments:
        id_field (str): the route field name containing the owners id
        exclude_roles (lsit): user roles excluded from the validation

    Returns:
        json: the JSON response for a 403 error
        func: the original route function with a "result" kwarg referencing
            the resource identified by the child_id_field

    """

    def wrapper(func):
        @wraps(func)
        def view_wrapper(*args, **kwargs):

            child_id = kwargs[child_id_field]
            parent_id = kwargs[parent_id_field]

            if parent_id_field == 'account_id' and \
                    child_id_field == 'transaction_id':
                result = Transactions.query \
                    .filter_by(id=child_id) \
                    .filter_by(account_id=parent_id).first()

            elif parent_id_field == 'account_id' and \
                    child_id_field == 'recurring_transaction_id':
                result = RecurringTransactions.query \
                    .filter_by(id=child_id) \
                    .filter_by(account_id=parent_id).first()

            elif parent_id_field == 'user_id' and \
                    child_id_field == 'account_id':

                result = Accounts.query \
                    .filter_by(id=child_id) \
                    .filter_by(user_id=parent_id).first()

            if not result:
                return abort(404)

            kwargs['result'] = result
            return func(*args, **kwargs)
        return view_wrapper
    return wrapper

def extract_auth_token(auth_token):
    """Extracts the auth token from a cookie and adds to the route

    If an auth_token cookie is fount in the request, it is attached to the view.

    Arguments:
        auth_token (str): the name of the cookie that contains the auth token

    Returns:
        func: the original route function with a "token" kwarg referencing the
            auth token

    """

    def wrapper(func):
        @wraps(func)
        def view_wrapper(*args, **kwargs):
            token = request.cookies.get(auth_token)
            if token:
                kwargs['auth_from_cookie'] = token
            return func(*args, **kwargs)
        return view_wrapper
    return wrapper

def csrf_enforced():
    """Returns an error if the specified token is not found in the header

    The X-CSRFToken header is not found and confirmed to equal the csrf_token
    stored in the user's session, a 403 errors is thrown.

    Arguments:
        token: The token to compare with the header

    Returns:
        func: the original route function with a "token" kwarg referencing the
            auth token if the token is sent in the header otherwise throws a
            403 error.

    """

    def wrapper(func):
        @wraps(func)
        def view_wrapper(*args, **kwargs):
            token = request.headers.get('X-CSRFToken')
            if session['csrf_token'] != token:
                return abort(403)
            return func(*args, **kwargs)
        return view_wrapper
    return wrapper
