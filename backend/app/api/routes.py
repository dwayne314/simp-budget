"""This module contains all of the api routes"""

from flask import current_app, request, abort, jsonify, g
from app import db
from app.api import bp
from app.models import Users, Accounts, Transactions
from app.utilities.decorators import (err_if_not_found, roles_required,
                                      enforce_owner_by_id, add_child_result)
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
    return jsonify({'token': token, 'id': g.current_user.id})

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
@token_auth.login_required
@err_if_not_found(Users, 'user_id')
@enforce_owner_by_id('user_id', ['admin'])
def get_user(user_id):
    """Gets a user by id"""
    user = Users.serialize_one(user_id)
    return {'success': True, 'message': 'User found', 'data': user}, 200

@bp.route('/users/<int:user_id>', methods=['PATCH'])
@token_auth.login_required
@err_if_not_found(Users, 'user_id')
@enforce_owner_by_id('user_id', ['admin'])
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
@token_auth.login_required
@err_if_not_found(Users, 'user_id')
@enforce_owner_by_id('user_id', ['admin'])
def delete_user(user_id):
    """Deletes a user by id"""
    user = Users.query.get(user_id)
    db.session.delete(user)
    db.session.commit()
    return {'success': True, 'message': 'User deleted', 'data': {}}, 200

#
# Account Routes
#

@bp.route('/users/<int:user_id>/accounts', methods=['GET'])
@token_auth.login_required
@err_if_not_found(Users, 'user_id')
@enforce_owner_by_id('user_id', ['admin'])
def get_accounts(user_id):
    """Gets all accounts"""
    user = Users.query.get(user_id)
    accounts = [Accounts.serialize_one(acct.id) for acct
                in user.accounts.all()]
    accounts = Accounts.serialize_all()
    message = 'Data found' if accounts else 'Data not found'
    return {'success': True, 'message': message, 'data': accounts}, 200

@bp.route('/users/<int:user_id>/accounts', methods=['POST'])
@token_auth.login_required
@enforce_owner_by_id('user_id', ['admin'])
def post_accounts(user_id):
    """Creates an account"""
    validator = AccountValidator(**request.get_json())
    validate_results = validator.validate_create_account()
    if validate_results['isValid']:
        new_account = Accounts(**validate_results['result'])
        setattr(new_account, 'user_id', user_id)
        db.session.add(new_account)

        db.session.commit()
        serialized_account = Accounts.serialize_one(new_account.id)
        return {'success': True,
                'message': 'Account created',
                'data': serialized_account}, 201
    return abort(400, validate_results["errors"])

@bp.route('/users/<int:user_id>/accounts/<int:account_id>', methods=['GET'])
@token_auth.login_required
@enforce_owner_by_id('user_id', ['admin'])
@add_child_result('user_id', 'account_id')
def get_account(user_id, account_id, result):
    """Gets an account by id"""
    account = Accounts.serialize_one(result.id)
    return {'success': True, 'message': 'Account found', 'data': account}, 200

@bp.route('/users/<int:user_id>/accounts/<int:account_id>', methods=['PATCH'])
@token_auth.login_required
@enforce_owner_by_id('user_id', ['admin'])
@add_child_result('user_id', 'account_id')
def patch_account(user_id, account_id, result):
    """Patches an account by id"""
    validator = AccountValidator(**request.get_json())
    validate_results = validator.validate_patch_account()
    if validate_results['isValid']:
        for key, val in validate_results['result'].items():
            setattr(result, key, val)
        db.session.commit()

        # Pull updated account data
        serialized_account = Accounts.serialize_one(account_id)
        return {'success': True,
                'message': 'Account updated',
                'data': serialized_account}, 200

    return abort(400, validate_results["errors"])

@bp.route('/users/<int:user_id>/accounts/<int:account_id>', methods=['DELETE'])
@token_auth.login_required
@enforce_owner_by_id('user_id', ['admin'])
@add_child_result('user_id', 'account_id')
def delete_account(user_id, account_id, result):
    """Deletes an account by id"""
    account = Accounts.query.get(result.id)
    db.session.delete(account)
    db.session.commit()
    return {'success': True, 'message': 'Account deleted', 'data': {}}, 200

#
# Transaction Routes
#

@bp.route('/users/<int:user_id>/accounts/<int:account_id>/transactions',
          methods=['GET'])
@token_auth.login_required
@enforce_owner_by_id('user_id', ['admin'])
@err_if_not_found(Accounts, 'account_id')
@add_child_result('user_id', 'account_id')
def get_transactions(user_id, account_id, result):
    """Gets all transactions for an account"""
    transactions = [Transactions.serialize_one(tran.id) for tran
                    in result.transactions.all()]
    message = 'Data found' if transactions else 'Data not found'
    return {'success': True,
            'message': message,
            'data': transactions}, 200

@bp.route('/users/<int:user_id>/accounts/<int:account_id>/transactions',
          methods=['POST'])
@token_auth.login_required
@enforce_owner_by_id('user_id', ['admin'])
@add_child_result('user_id', 'account_id')
def post_transactions(user_id, account_id, result):
    """Creates a transaction for an account"""
    validator = TransationValidator(**request.get_json())
    validate_results = validator.validate_create_transaction()

    if validate_results['isValid']:
        validate_results['result']['account_id'] = result.id
        new_transaction = Transactions(**validate_results['result'])
        db.session.add(new_transaction)
        db.session.commit()
        serialized_transaction = Transactions.serialize_one(new_transaction.id)
        return {'success': True,
                'message': 'Transaction created',
                'data': serialized_transaction}, 201
    return abort(400, validate_results["errors"])

@bp.route('/users/<int:user_id>/accounts/<int:account_id>/transactions'
          '/<int:transaction_id>', methods=['GET'])
@token_auth.login_required
@enforce_owner_by_id('user_id', ['admin'])
@add_child_result('account_id', 'transaction_id')
def get_transaction(user_id, account_id, transaction_id, result):
    """Gets a transaction from an account by id"""
    account = Accounts.query.get_or_404(account_id)
    if user_id == account.user_id:
        serialized_transaction = result.serialize_one(result.id)
        return {'success': True,
                'message': 'Transaction found',
                'data': serialized_transaction}, 200
    return abort(404)

@bp.route('/users/<int:user_id>/accounts/<int:account_id>/transactions'
          '/<int:transaction_id>', methods=['PATCH'])
@token_auth.login_required
@enforce_owner_by_id('user_id', ['admin'])
@add_child_result('account_id', 'transaction_id')
def patch_transaction(user_id, account_id, transaction_id, result):
    """Patches a transaction from an account by id"""
    account = Accounts.query.get_or_404(account_id)
    if user_id == account.user_id:
        validator = TransationValidator(**request.get_json())
        validate_results = validator.validate_patch_transaction()

        if validate_results['isValid']:
            for key, val in validate_results['result'].items():
                setattr(result, key, val)
            db.session.commit()
            serialized_transaction = Transactions.serialize_one(
                transaction_id)
            return {'success': True,
                    'message': 'Account updated',
                    'data': serialized_transaction}, 200

        return abort(400, validate_results["errors"])
    return abort(404)

@bp.route('users/<int:user_id>/accounts/<int:account_id>/transactions'
          '/<int:transaction_id>', methods=['DELETE'])
@token_auth.login_required
@enforce_owner_by_id('user_id', ['admin'])
@add_child_result('account_id', 'transaction_id')
def delete_transaction(user_id, account_id, transaction_id, result):
    """Api router for a single account transaction resource"""
    db.session.delete(result)
    db.session.commit()
    message = f'Transaction deleted'
    return {'success': True, 'message': message, 'data': {}}, 200
