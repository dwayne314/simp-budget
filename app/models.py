"""This module contains all of the application's models"""

from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from app import db
from app.utilities.mixins import SerializerMixin


class Users(db.Model, SerializerMixin):
    """Represents a user."""

    __serializeable__ = ['first_name', 'last_name', 'email', 'created_at',
                         'updated_at']

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(128), nullable=False)
    last_name = db.Column(db.String(128), index=True, nullable=False)
    email = db.Column(db.String(128), index=True, nullable=False, unique=True)
    password_hash = db.Column(db.String(128))
    created_at = db.Column(
        db.DateTime(), default=datetime.utcnow, nullable=False)
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

    @classmethod
    def is_duplicate(cls, email):
        """Returns whether the new email is a duplicate"""
        duplicate_config = dict(email=email)
        return bool(cls.query.filter_by(**duplicate_config).first())


class Accounts(db.Model, SerializerMixin):
    """Represents a financial account"""
    __serializeable__ = ['name', 'description', 'created_at', 'updated_at']

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False, index=True)
    description = db.Column(db.String, nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(
        db.DateTime(), default=datetime.utcnow, nullable=False)
    updated_at = db.Column(
        db.DateTime(), default=datetime.utcnow, nullable=False)

    # Relationships
    transactions = db.relationship(
        'Transactions', backref='account', lazy='dynamic',
        cascade='all, delete')

    @property
    def current_balance(self):
        """The current balance of an account in cents"""
        pass

    def get_transaction(self, transaction_id):
        """Returns a transaction by id"""
        pass


class Transactions(db.Model, SerializerMixin):
    """Represent debits and credits to an account's balance"""

    __serializeable__ = ['account_id', 'amount', 'note', 'created_at']

    id = db.Column(db.Integer, primary_key=True)
    account_id = db.Column(db.Integer, db.ForeignKey('accounts.id'))
    amount = db.Column(db.Integer, nullable=False)
    note = db.Column(db.String, nullable=True)
    created_at = db.Column(
        db.DateTime(), default=datetime.utcnow, nullable=False)
