"""This module contains all of the api routes"""

from flask import current_app, request
from app.api import bp


@bp.route('/', methods=['GET'])
def index():
    """The api index route"""
    return dict(version=1, app_name=current_app.config['APP_NAME'])

#
# User Routes
#

@bp.route('/users', methods=['GET', 'POST'])
def users():
    """Api router for all users"""
    print(request.method)
    if request.method == 'GET':
        return {'action': 'get users'}

    return {'action': 'post users'}

@bp.route('/users/<int:user_id>', methods=['GET', 'PATCH', 'DELETE'])
def get_user(user_id):
    """Api router for a singular user resource"""
    if request.method == 'GET':
        return {'action': f'get user {user_id}'}

    elif request.method == 'PATCH':
        return {'action': f'patch user {user_id}'}

    return {'action': f'delete user {user_id}'}

#
# Account Routes
#

@bp.route('/accounts', methods=['GET', 'POST'])
def accounts():
    """Api router for all accounts"""
    if request.method == 'GET':
        return {'action': 'get accounts'}

    return {'action': 'post accounts'}

@bp.route('/accounts/<int:account_id>', methods=['GET', 'PATCH', 'DELETE'])
def get_account(account_id):
    """Api router for a singular account resource"""
    if request.method == 'GET':
        return {'action': f'get account {account_id}'}

    elif request.method == 'PATCH':
        return {'action': f'patch account {account_id}'}

    return {'action': f'delete account {account_id}'}

#
# Transaction Routes
#

@bp.route('/transactions', methods=['GET', 'POST'])
def transactions():
    """Api router for all transactions"""
    if request.method == 'GET':
        return {'action': 'get transactions'}

    return {'action': 'post transactions'}

@bp.route('/transactions/<int:transaction_id>', methods=['GET', 'PATCH', 'DELETE'])
def get_transaction(transaction_id):
    """Api router for a singular transaction resource"""
    if request.method == 'GET':
        return {'action': f'get transaction {transaction_id}'}

    elif request.method == 'PATCH':
        return {'action': f'patch transaction {transaction_id}'}

    return {'action': f'delete transaction {transaction_id}'}
