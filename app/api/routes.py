"""This module contains all of the api routes"""

from flask import current_app, request, abort
from app import db
from app.api import bp
from app.models import Users, Accounts, Transactions
from app.utilities.decorators import err_if_not_found


@bp.route('/', methods=['GET'])
def index():
    """The api index route"""
    return dict(version=1.0, app_name=current_app.config['APP_NAME'])

#
# User Routes
#

@bp.route('/users', methods=['GET'])
def get_users():
    """Gets all users"""
    users = Users.serialize_all()
    message = 'Data found' if users else 'Data not found'
    return {'success': True, 'message': message, 'data': users}, 200

@bp.route('/users', methods=['POST'])
def post_users():
    """Creates a user"""
    new_user = Users(**request.get_json())
    db.session.add(new_user)
    db.session.commit()
    return {'success': True,
            'message': f'User {new_user.first_name} created',
            'data': {}}, 201

@bp.route('/users/<int:user_id>', methods=['GET'])
@err_if_not_found(Users, 'user_id')
def get_user(user_id):
    """Gets a user by id"""
    user = Users.serialize_one(user_id)
    return {'success': True, 'message': 'User found', 'data': user}, 200

@bp.route('/users/<int:user_id>', methods=['PATCH'])
@err_if_not_found(Users, 'user_id')
def patch_user(user_id):
    """Patches a user by id"""
    user = Users.serialize_one(user_id)
    message = f'User {user_id} has been updated'
    return {'success': True, 'message': message, 'data': user}, 200

@bp.route('/users/<int:user_id>', methods=['DELETE'])
@err_if_not_found(Users, 'user_id')
def delete_user(user_id):
    """Deletes a user by id"""
    message = f'User {user_id} has been deleted'
    return {'success': True, 'message': message, 'data': {}}, 200

#
# Account Routes
#

@bp.route('/accounts', methods=['GET'])
def get_accounts():
    """Gets all accounts"""
    accounts = Accounts.serialize_all()
    message = 'Data found' if accounts else 'Data not found'
    return {'success': True, 'message': message, 'data': accounts}, 200

@bp.route('/accounts', methods=['POST'])
def post_accounts():
    """Creates an account"""
    new_account = Accounts(**request.get_json())
    db.session.add(new_account)
    db.session.commit()
    account = Accounts.serialize_one(new_account.id)

    return {'success': True,
            'message': f'User {new_account.name} created',
            'data': account}, 201

@bp.route('/accounts/<int:account_id>', methods=['GET'])
@err_if_not_found(Accounts, 'account_id')
def get_account(account_id):
    """Gets an account by id"""
    account = Accounts.serialize_one(account_id)
    return {'success': True, 'message': 'Account found', 'data': account}, 200

@bp.route('/accounts/<int:account_id>', methods=['PATCH'])
@err_if_not_found(Accounts, 'account_id')
def patch_account(account_id):
    """Patches an account by uid"""
    account = Users.serialize_one(account_id)
    message = f'Account {account_id} has been updated'
    return {'success': True, 'message': message, 'data': account}, 200


@bp.route('/accounts/<int:account_id>', methods=['DELETE'])
@err_if_not_found(Accounts, 'account_id')
def delete_account(account_id):
    """Deletes a user by id"""
    message = f'Account {account_id} has been deleted'
    return {'success': True, 'message': message, 'data': {}}, 200

#
# Transaction Routes
#

@bp.route('/accounts/<int:account_id>/transactions', methods=['GET'])
@err_if_not_found(Accounts, 'account_id')
def get_transactions(account_id):
    """Gets all transactions for an account"""
    account = Accounts.query.get(account_id)
    transactions = [Transactions.serialize_one(tran.id) for tran
                    in account.transactions.all()]
    message = 'Data found' if transactions else 'Data not found'
    return {'success': True,
            'message': message,
            'data': transactions}, 200

@bp.route('/accounts/<int:account_id>/transactions', methods=['POST'])
@err_if_not_found(Accounts, 'account_id')
def post_transactions(account_id):
    """Creates a transaction for an account"""
    new_transaction = Transactions(**request.get_json())
    new_transaction.account_id = account_id
    db.session.add(new_transaction)
    db.session.commit()
    transaction = Transactions.serialize_one(new_transaction.id)

    return {'success': True,
            'message': 'Transaction created',
            'data': transaction}, 201

@bp.route('/accounts/<int:account_id>/transactions/<int:transaction_id>',
          methods=['GET'])
def get_transaction(account_id, transaction_id):
    """Gets a transaction from an account by id"""
    first_transaction = Transactions.query \
        .filter_by(account_id=account_id) \
        .filter_by(id=transaction_id).first()

    if not first_transaction:
        return abort(404)

    transaction = Transactions.serialize_one(first_transaction.id)
    return {'success': True,
            'message': 'Transaction found',
            'data': transaction}, 200

@bp.route('/accounts/<int:account_id>/transactions/<int:transaction_id>',
          methods=['PATCH'])
def patch_transaction(account_id, transaction_id):
    """Patches a transaction from an account by id"""
    first_transaction = Transactions.query \
        .filter_by(account_id=account_id) \
        .filter_by(id=transaction_id).first()

    if not first_transaction:
        return abort(404)

    transaction = Transactions.serialize_one(first_transaction.id)
    message = f'Transaction {transaction_id} has been updated'
    return {'success': True, 'message': message, 'data': transaction}, 200

@bp.route('/accounts/<int:account_id>/transactions/<int:transaction_id>',
          methods=['DELETE'])
def delete_transaction(account_id, transaction_id):
    """Api router for a single account transaction resource"""
    first_transaction = Transactions.query \
        .filter_by(account_id=account_id) \
        .filter_by(id=transaction_id).first()

    if not first_transaction:
        return abort(404)

    message = f'Transaction {transaction_id} has been deleted'
    return {'success': True, 'message': message, 'data': {}}, 200
