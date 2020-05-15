"""This module contains all of the api routes"""

from flask import current_app, request, abort, jsonify, g
from app import db
from app.api import bp
from app.models import Users, Accounts, Transactions
from app.utilities.decorators import err_if_not_found, roles_required
from app.api.validators import (UserValidator, AccountValidator,
                                TransationValidator)
from app.api.auth import basic_auth, token_auth


@bp.route('/', methods=['GET'])
def index():
    """The api index route"""
    return dict(version=1.0, app_name=current_app.config['APP_NAME'])

#
# Token Routes
#

@bp.route('/tokens', methods=['POST'])
@basic_auth.login_required
def get_token():
    """Returns the auth token for a logged in user"""
    token = g.current_user.get_token()
    db.session.commit()
    return jsonify({'token': token})

@bp.route('/tokens', methods=['DELETE'])
@token_auth.login_required
@roles_required(['admin'])
def revoke_token():
    """Deletes the current user's token"""
    g.current_user.revoke_token()
    db.session.commit()
    return {'success': True, 'message': 'Token deleted', 'data': {}}, 200

#
# User Routes
#

@bp.route('/users', methods=['GET'])
@token_auth.login_required
@roles_required(['admin'])
def get_users():
    """Gets all users"""
    users = Users.serialize_all()
    message = 'Data found' if users else 'Data not found'
    return {'success': True, 'message': message, 'data': users}, 200

@bp.route('/users', methods=['POST'])
def post_users():
    """Creates a user"""
    validator = UserValidator(**request.get_json())
    validate_results = validator.validate_create_user()
    if validate_results['isValid']:
        password = validate_results['result'].pop('password')
        new_user = Users(**validate_results['result'])
        new_user.hash_password(password)

        db.session.add(new_user)
        db.session.commit()
        serialized_user = Users.serialize_one(new_user.id)
        return {'success': True,
                'message': 'User created',
                'data': serialized_user}, 201
    return abort(400, validate_results["errors"])

@bp.route('/users/<int:user_id>', methods=['GET'])
@err_if_not_found(Users, 'user_id')
@token_auth.login_required
def get_user(user_id):
    """Gets a user by id"""
    user = Users.serialize_one(user_id)
    return {'success': True, 'message': 'User found', 'data': user}, 200

@bp.route('/users/<int:user_id>', methods=['PATCH'])
@err_if_not_found(Users, 'user_id')
@token_auth.login_required
def patch_user(user_id):
    """Patches a user by id"""
    user = Users.query.get(user_id)
    validator = UserValidator({'email': user.email}, **request.get_json())
    validate_results = validator.validate_patch_user()
    if validate_results['isValid']:
        for key, val in validate_results['result'].items():
            setattr(user, key, val)
        db.session.commit()

        # Pull updated user data
        serialized_user = Users.serialize_one(user_id)
        return {'success': True,
                'message': 'User updated',
                'data': serialized_user}, 200

    return abort(400, validate_results["errors"])

@bp.route('/users/<int:user_id>', methods=['DELETE'])
@err_if_not_found(Users, 'user_id')
@token_auth.login_required
def delete_user(user_id):
    """Deletes a user by id"""
    user = Users.query.get(user_id)
    db.session.delete(user)
    db.session.commit()
    return {'success': True, 'message': 'User deleted', 'data': {}}, 200

#
# Account Routes
#

@bp.route('/accounts', methods=['GET'])
@token_auth.login_required
def get_accounts():
    """Gets all accounts"""
    accounts = Accounts.serialize_all()
    message = 'Data found' if accounts else 'Data not found'
    return {'success': True, 'message': message, 'data': accounts}, 200

@bp.route('/accounts', methods=['POST'])
@token_auth.login_required
def post_accounts():
    """Creates an account"""
    validator = AccountValidator(**request.get_json())
    validate_results = validator.validate_create_account()
    if validate_results['isValid']:
        new_account = Accounts(**validate_results['result'])
        db.session.add(new_account)

        db.session.commit()
        serialized_account = Accounts.serialize_one(new_account.id)
        return {'success': True,
                'message': 'Account created',
                'data': serialized_account}, 201
    return abort(400, validate_results["errors"])

@bp.route('/accounts/<int:account_id>', methods=['GET'])
@err_if_not_found(Accounts, 'account_id')
@token_auth.login_required
def get_account(account_id):
    """Gets an account by id"""
    account = Accounts.serialize_one(account_id)
    return {'success': True, 'message': 'Account found', 'data': account}, 200

@bp.route('/accounts/<int:account_id>', methods=['PATCH'])
@err_if_not_found(Accounts, 'account_id')
@token_auth.login_required
def patch_account(account_id):
    """Patches an account by id"""
    account = Accounts.query.get(account_id)
    validator = AccountValidator(**request.get_json())
    validate_results = validator.validate_patch_account()
    if validate_results['isValid']:
        for key, val in validate_results['result'].items():
            setattr(account, key, val)
        db.session.commit()

        # Pull updated account data
        serialized_account = Accounts.serialize_one(account_id)
        return {'success': True,
                'message': 'Account updated',
                'data': serialized_account}, 200

    return abort(400, validate_results["errors"])

@bp.route('/accounts/<int:account_id>', methods=['DELETE'])
@err_if_not_found(Accounts, 'account_id')
@token_auth.login_required
def delete_account(account_id):
    """Deletes an account by id"""
    account = Accounts.query.get(account_id)
    db.session.delete(account)
    db.session.commit()
    return {'success': True, 'message': 'Account deleted', 'data': {}}, 200

#
# Transaction Routes
#

@bp.route('/accounts/<int:account_id>/transactions', methods=['GET'])
@err_if_not_found(Accounts, 'account_id')
@token_auth.login_required
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
@token_auth.login_required
def post_transactions(account_id):
    """Creates a transaction for an account"""
    validator = TransationValidator(**request.get_json())
    validate_results = validator.validate_create_transaction()

    if validate_results['isValid']:
        validate_results['result']['account_id'] = account_id
        new_transaction = Transactions(**validate_results['result'])
        db.session.add(new_transaction)
        db.session.commit()
        serialized_transaction = Transactions.serialize_one(new_transaction.id)
        return {'success': True,
                'message': 'Transaction created',
                'data': serialized_transaction}, 201
    return abort(400, validate_results["errors"])

@bp.route('/accounts/<int:account_id>/transactions/<int:transaction_id>',
          methods=['GET'])
@err_if_not_found(Accounts, 'account_id')
@token_auth.login_required
def get_transaction(account_id, transaction_id):
    """Gets a transaction from an account by id"""
    account = Accounts.query.get(account_id)
    transaction = account.get_transaction(transaction_id)

    if transaction:
        serialized_transaction = Transactions.serialize_one(transaction.id)
        return {'success': True,
                'message': 'Transaction found',
                'data': serialized_transaction}, 200
    return abort(404)


@bp.route('/accounts/<int:account_id>/transactions/<int:transaction_id>',
          methods=['PATCH'])
@err_if_not_found(Accounts, 'account_id')
@token_auth.login_required
def patch_transaction(account_id, transaction_id):
    """Patches a transaction from an account by id"""
    account = Accounts.query.get(account_id)
    transaction = account.get_transaction(transaction_id)

    if transaction:
        validator = TransationValidator(**request.get_json())
        validate_results = validator.validate_patch_transaction()

        if validate_results['isValid']:
            for key, val in validate_results['result'].items():
                setattr(transaction, key, val)
            db.session.commit()
            serialized_transaction = Transactions.serialize_one(
                transaction_id)
            return {'success': True,
                    'message': 'Account updated',
                    'data': serialized_transaction}, 200

        return abort(400, validate_results["errors"])
    return abort(404)

@bp.route('/accounts/<int:account_id>/transactions/<int:transaction_id>',
          methods=['DELETE'])
@token_auth.login_required
def delete_transaction(account_id, transaction_id):
    """Api router for a single account transaction resource"""
    account = Accounts.query.get(account_id)
    transaction = account.get_transaction(transaction_id)
    if transaction:
        db.session.delete(transaction)
        db.session.commit()
        message = f'Transaction deleted'
        return {'success': True, 'message': message, 'data': {}}, 200
    return abort(404)
