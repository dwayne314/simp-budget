"""This module contains all of the application's models"""

import base64
import os
from datetime import datetime, timedelta
from sqlalchemy import event
from sqlalchemy.schema import CheckConstraint
from werkzeug.security import generate_password_hash, check_password_hash
from app import db
from app.utilities.mixins import SerializerMixin


ROLES = {
    'default': 'general',
    'admin': 'admin'
}

special_day_enums = ('first', 'last')
transaction_type_enums = ('daily', 'weekly', 'monthly')


class Users(db.Model, SerializerMixin):
    """Represents a user."""

    __serializeable__ = ['first_name', 'last_name', 'email', 'created_at',
                         'updated_at', 'auth_token_expiration']

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(128), nullable=False)
    last_name = db.Column(db.String(128), index=True, nullable=False)
    role = db.Column(db.String(128), nullable=False)
    email = db.Column(db.String(128), index=True, nullable=False, unique=True)
    password_hash = db.Column(db.String(128))
    auth_token = db.Column(db.String(32), index=True, unique=True)
    auth_token_expiration = db.Column(db.DateTime)
    created_at = db.Column(
        db.DateTime(), default=datetime.utcnow, nullable=False)
    updated_at = db.Column(
        db.DateTime(), default=datetime.utcnow, nullable=False)

    # Relationships
    accounts = db.relationship(
        'Accounts', backref='user', lazy='dynamic', cascade='all, delete')

    def hash_password(self, password):
        """Creates a password hash from the supplied password"""
        self.password_hash = generate_password_hash(password)

    def validate_password(self, password):
        """Returns True if the password matches the hash"""
        return check_password_hash(self.password_hash, password)

    def get_token(self, expires_in=3600):
        """Retrieves a user's auth token"""
        now = datetime.utcnow()
        if self.auth_token and \
                self.auth_token_expiration > now + timedelta(seconds=60):
            return self.auth_token

        self.auth_token = base64.b64encode(os.urandom(24)).decode('utf-8')
        self.auth_token_expiration = now + timedelta(seconds=expires_in)
        db.session.add(self)
        return self.auth_token

    def revoke_token(self):
        """Revokes a user's auth token"""
        self.auth_token_expiration = datetime.utcnow() - timedelta(seconds=1)


    @classmethod
    def is_duplicate(cls, email):
        """Returns whether the new email is a duplicate"""
        duplicate_config = dict(email=email)
        return bool(cls.query.filter_by(**duplicate_config).first())

    @staticmethod
    def check_token(token):
        """Returns the user if the auth token is valid"""
        user = Users.query.filter_by(auth_token=token).first()
        if user is None or user.auth_token_expiration < datetime.now():
            return None
        return user

    @staticmethod
    def initialize_role(mapper, connection, target):
        """Initializes the employees role to the default role"""
        target.role = ROLES['default']

    @classmethod
    def __declare_last__(cls):
        """Before update and insert events set the school and district ids"""

        event.listen(Users, 'before_insert', cls.initialize_role)


class Accounts(db.Model, SerializerMixin):
    """Represents a financial account"""
    __serializeable__ = ['name', 'description', 'created_at', 'updated_at']

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(25), nullable=False, index=True)
    description = db.Column(db.String, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(
        db.DateTime(), default=datetime.utcnow, nullable=False)
    updated_at = db.Column(
        db.DateTime(), default=datetime.utcnow, nullable=False)

    # Relationships
    transactions = db.relationship(
        'Transactions', backref='account', lazy='dynamic',
        cascade='all, delete')

    recurring_transactions = db.relationship(
        'RecurringTransactions', backref='account', lazy='dynamic',
        cascade='all, delete')

    @property
    def current_balance(self):
        """The current balance of an account in cents"""
        pass

    def get_transaction(self, transaction_id):
        """Returns a transaction by id"""
        transactions = [tran for tran in self.transactions
                        if tran.id == transaction_id]
        if transactions:
            return transactions[0]
        return None


class Transactions(db.Model, SerializerMixin):
    """Represent debits and credits to an account's balance"""

    __serializeable__ = ['account_id', 'amount', 'note', 'date', 'created_at']

    id = db.Column(db.Integer, primary_key=True)
    account_id = db.Column(db.Integer, db.ForeignKey('accounts.id'))
    amount = db.Column(db.BigInteger, nullable=False)
    date = db.Column(db.Date, nullable=False)
    note = db.Column(db.String, nullable=False)
    created_at = db.Column(
        db.DateTime(), default=datetime.utcnow, nullable=False)


class RecurringTransactions(db.Model, SerializerMixin):
    """Represents all transactions that happen periodically"""

    __serializeable__ = ['account_id', 'amount', 'note', 'transaction_type',
                         'frequency', 'scheduled_day', 'special_day',
                         'created_at']
    __table_args__ = (
        CheckConstraint(
            'NOT(scheduled_day IS NULL AND special_day IS NULL)'),
        CheckConstraint(
            'NOT(scheduled_day IS NOT NULL AND special_day IS NOT NULL)'),
    )
    id = db.Column(db.Integer, primary_key=True)
    account_id = db.Column(db.Integer, db.ForeignKey('accounts.id'))
    amount = db.Column(db.BigInteger, nullable=False)
    note = db.Column(db.String, nullable=False)
    transaction_type = db.Column(db.Enum(*transaction_type_enums, name='transaction_types'), nullable=False)
    frequency = db.Column(db.Integer, nullable=False)
    scheduled_day = db.Column(db.Integer, nullable=True)
    special_day = db.Column(db.Enum(*special_day_enums, name='special_day_types'), nullable=True)
    created_at = db.Column(
        db.DateTime(), default=datetime.utcnow, nullable=False)
    updated_at = db.Column(
        db.DateTime(), default=datetime.utcnow, nullable=False)

    @staticmethod
    def null_special_day(target, value, old_value, initiator):
        """Nulls the special date if it's a duplicate day

        A record cannot have both a special day and a scheduled day.  If a
        scheduled day is updated from null the scheduled_day field will
        be set to null to not conflict with the constraint.
        """

        if old_value is None:
            target.special_day = None

    @staticmethod
    def null_scheduled_day(target, value, old_value, initiator):
        """Nulls the scheduled date if it's a duplicate day

        A record cannot have both a special day and a scheduled day.  If a
        scheduled day is updated from null the scheduled_day field will
        be set to null to not conflict with the constraint.
        """

        if old_value is None:
            target.scheduled_day = None


    @classmethod
    def __declare_last__(cls):
        """Runs before set events are committed"""

        event.listen(RecurringTransactions.scheduled_day, 'set',
                     cls.null_special_day)
        event.listen(RecurringTransactions.special_day, 'set',
                     cls.null_scheduled_day)
