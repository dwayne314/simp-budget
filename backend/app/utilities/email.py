"""This module contains all of the application's email functions"""

from threading import Thread
from flask import current_app, render_template, request
from flask_mail import Message
from app import mail


def send_async_email(app, msg):
    with app.app_context():
        mail.send(msg)


def send_email(subject, sender, recipients, html_body, cc=None,
               text_body=None, attachment=None):
    app = current_app._get_current_object()
    msg = Message(subject, sender=sender, recipients=recipients)
    msg.body = text_body
    msg.html = html_body

    if cc:
        msg.cc = cc
    if attachment:
        msg.attach(
            attachment["name"], attachment["content_type"],
            attachment["byte_str"])
    new_thread = Thread(target=send_async_email, args=[app, msg]).start()
    return new_thread

def send_email_verification(user):
    """Sends a registration email to a user"""

    host_name = current_app.config['FRONTEND_HOST_NAME']
    token = user.get_web_token()
    action_link = host_name + 'verifyEmail?token=' + token

    send_email('[SimpBudget] Verify Email',
               sender=current_app.config['MAIL_USERNAME'],
               recipients=[user.email],
               html_body=render_template('email/verify_email.html',
                                         user=user, token=token,
                                         action_link=action_link))

def send_password_reset(user):
    """Sends a passoword reset email to a user"""

    host_name = current_app.config['FRONTEND_HOST_NAME']
    token = user.get_web_token()
    action_link = host_name + 'resetPassword?token=' + token

    send_email('[SimpBudget] Reset Password',
               sender=current_app.config['MAIL_USERNAME'],
               recipients=[user.email],
               html_body=render_template('email/reset_password.html',
                                         user=user, token=token,
                                         action_link=action_link))
