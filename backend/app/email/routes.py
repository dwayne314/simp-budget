"""This module contains all of the routes that trigger emails to a user"""

from app.email import bp
from app.utilities.email import (send_email_verification, send_password_reset)
from app.utilities.decorators import (err_if_not_found,
                                      enforce_owner_by_id)
from app.models import Users
from app.api.auth import token_auth
from flask import current_app, request, session, make_response, jsonify

@bp.route('/users/<int:user_id>/verifyEmail', methods=['GET'])
@token_auth.login_required
@err_if_not_found(Users, 'user_id')
@enforce_owner_by_id('user_id', ['admin'])
def send_email_confirmation(user_id):
    """The email index route"""
    user = Users.query.get(user_id)
    send_email_verification(user)
    return {'route': 'email', 'data': 'sending email confirmation'}


@bp.route('/sendResetEmail', methods=['POST'])
# @enforce_owner_by_id('user_id', ['admin'])
def send_password_reset_confirmation():
    """Sends a password reset email and attraches a reset token as a cookie"""
    email = request.get_json().get('email')
    user = Users.query.filter_by(email=email).first()

    if user:
        # Password reset email expites in 15 minutes
        password_reset_token = user.get_web_token(expires_in=900)

        resp = make_response(
            jsonify({
                'user': Users.serialize_one(user.id)
            }))
        resp.set_cookie('password_reset_token', password_reset_token, httponly=False,
                        secure=current_app.config['SESSION_COOKIE_SECURE'])

        session['password_reset_token'] = password_reset_token
        send_password_reset(user)

        return resp

    return {'route': 'email', 'data': 'user does not exist'}


# @bp.route('/users/<int:user_id>/sendReport', methods=['POST'])
# def send_report(user_id):
#     """The email index route"""
#     return {'route': 'email', 'message': 'hitting email route to send report'}
