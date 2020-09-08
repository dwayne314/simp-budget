"""This module contains all of the routes that trigger emails to a user"""

from app.email import bp
from app.utilities.email import (send_email_verification)
from app.utilities.decorators import (err_if_not_found,
                                      enforce_owner_by_id)
from app.models import Users
from app.api.auth import token_auth

@bp.route('/users/<int:user_id>/verifyEmail', methods=['GET'])
@token_auth.login_required
@err_if_not_found(Users, 'user_id')
@enforce_owner_by_id('user_id', ['admin'])
def send_email_confirmation(user_id):
    """The email index route"""
    user = Users.query.get(user_id)
    send_email_verification(user)
    return {'route': 'email', 'data': 'sending email confirmation'}

# @bp.route('/users/<int:user_id>/sendReport', methods=['POST'])
# def send_report(user_id):
#     """The email index route"""
#     return {'route': 'email', 'message': 'hitting email route to send report'}
