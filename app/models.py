"""This module contains all of the application's models"""


from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from app import db


class Users(db.Model):
    """Represents a user."""

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(128), nullable=False)
    last_name = db.Column(db.String(128), index=True, nullable=False)
    email = db.Column(db.String(128), index=True, nullable=False, unique=True)
    password_hash = db.Column(db.String(128))
    created_at = db.Column(db.DateTime(), default=datetime.utcnow, nullable=False)
    updated_at = db.Column(
        db.DateTime(), default=datetime.utcnow, nullable=False)

    # Relationships
    accounts = db.relationship(
        'Accounts', backref='school', lazy='dynamic', cascade='all, delete')

    def hash_password(self, password):
        """Creates a password hash from the supplied password"""
        self.password_hash = generate_password_hash(password)

    def validate_password(self, password):
        """Returns True if the password matches the hash"""
        return check_password_hash(self.password_hash, password)


class Accounts(db.Model):
    """Represents a financial account"""

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False, index=True)
    description = db.Column(db.String, nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime(), default=datetime.utcnow, nullable=False)
    updated_at = db.Column(
        db.DateTime(), default=datetime.utcnow, nullable=False)

    # Relationships
    transactions = db.relationship(
        'Transactions', backref='account', lazy='dynamic', cascade='all, delete')

    @property
    def current_balance(self):
        """The current balance of an account in cents"""
        pass

    def get_transaction(self, transaction_id):
        """Returns a transaction by id"""
        pass


class Transactions(db.Model):
    """Represent debits and credits to an account's balance"""

    id = db.Column(db.Integer, primary_key=True)
    account_id = db.Column(db.Integer, db.ForeignKey('accounts.id'))
    amount = db.Column(db.Integer, nullable=False)
    note = db.Column(db.String, nullable=True)
    created_at = db.Column(db.DateTime(), default=datetime.utcnow, nullable=False)
