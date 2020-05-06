"""This module contains validation functions used by the api routes"""

import re
from app.models import Users


class Validator():
    """The base validator class for the application"""

    def __init__(self, **kwargs):
        try:
            self.tested_fields
        except:
            raise ValueError('Child Validator class must contain a tested_fields '
                             'attribute')
        self.attributes = kwargs
        self.errors = {}

    def get_results(self):
        """Returns the validated fields"""
        result = dict((key, val) for key, val in self.attributes.items()
                      if key in self.tested_fields)
        return result

    @classmethod
    def missing_field_error(cls, field_name):
        """Returns a formatted errors for a missing field"""
        return f'{field_name} is a required field.'

class UserValidator(Validator):
    """Validates keyword arguments for a User

    The validate functions determine if a set of kwargs are valid for the
    action type. Each validate function returns a dict containing the
    validation status, errors, and results.

    """

    email_regex = '^.+@(\[?)[a-zA-Z0-9-.]+.([a-zA-Z]{2,3}|[0-9]{1,3})(]?)$'
    tested_fields = ['first_name', 'last_name', 'email', 'password']

    def __init__(self, **kwargs):
        super(UserValidator, self).__init__(**kwargs)
        self.first_name = kwargs.get('first_name')
        self.last_name = kwargs.get('last_name')
        self.email = kwargs.get('email')
        self.password = kwargs.get('password')

    def extract_common_validators(self):
        """Validates fields common to all validate methods"""
        if not self.password:
            self.errors['password'] = self.missing_field_error('Password')
        elif not 7 <= len(self.password) <= 30:
            self.errors['password'] = 'Password must be between 7 and 30 characters.'

    def validate_create_user(self):
        """Validates the attributes sent to create a user"""
        self.extract_common_validators()

        if not self.first_name:
            self.errors['first_name'] = self.missing_field_error('First name')

        if not self.last_name:
            self.errors['last_name'] = self.missing_field_error('Last name')

        # Email Validation
        if not self.email:
            self.errors['email'] = self.missing_field_error('Email')
        elif not re.match(self.email_regex, self.email):
            self.errors['email'] = 'That is not a valid email.'

        else:
            if Users.is_duplicate(self.email):
                self.errors['email'] = 'That email is taken.'

        return {
            'isValid': not self.errors,
            'errors': self.errors,
            'result': {} if self.errors else self.get_results()
            }

    def validate_patch_user(self):
        """Validates the attributes sent to patch a user"""
        self.extract_common_validators()

        # Email Validation
        if self.email:
            if not re.match(self.email_regex, self.email):
                self.errors['email'] = 'That is not a valid email.'
            else:
                if Users.is_duplicate(self.email):
                    self.errors['email'] = 'That email is taken.'

        return {
            'isValid': not self.errors,
            'errors': self.errors,
            'result': {} if self.errors else self.get_results()
        }


class AccountValidator(Validator):
    """Validates keyword arguments for an Account

    The validate functions determine if a set of kwargs are valid for the
    action type. Each validate function returns a dict containing the
    validation status, errors, and results.

    """

    tested_fields = ['name', 'description']

    def __init__(self, **kwargs):
        super(AccountValidator, self).__init__(**kwargs)
        self.name = kwargs.get('name')
        self.description = kwargs.get('description')

    def validate_create_account(self):
        """Validates the attributes sent to create an account"""
        if not self.name:
            self.errors['name'] = self.missing_field_error('Name')

        return {
            'isValid': not self.errors,
            'errors': self.errors,
            'result': {} if self.errors else self.get_results()
        }

    def validate_patch_account(self):
        """Validates the attributes sent to patch an account"""
        if self.name is not None:
            if not self.name:
                self.errors['name'] = self.missing_field_error('Name')

        return {
            'isValid': not self.errors,
            'errors': self.errors,
            'result': {} if self.errors else self.get_results()
        }

class TransationValidator(Validator):
    """Validates keyword arguments for a Transaction

    The validate functions determine if a set of kwargs are valid for the
    action type. Each validate function returns a dict containing the
    validation status, errors, and results.

    """

    tested_fields = ['amount', 'note']

    def __init__(self, **kwargs):
        super(TransationValidator, self).__init__(**kwargs)
        self.amount = kwargs.get('amount')
        self.note = kwargs.get('note')

    def validate_create_transaction(self):
        """Validates the attributes sent to create a Transaction"""
        if self.amount is None:
            self.errors['amount'] = self.missing_field_error('Amount')

        elif isinstance(self.amount, float):
            self.errors['amount'] = 'Amount must be an integer.'

        else:
            try:
                self.amount = int(self.amount)
            except ValueError:
                self.errors['amount'] = 'Amount must be an integer.'

            if self.amount == 0:
                self.errors['amount'] = 'Amount cannot be 0.'

        return {
            'isValid': not self.errors,
            'errors': self.errors,
            'result': {} if self.errors else self.get_results()
        }

    def validate_patch_transaction(self):
        """Validates the attributes sent to patch a transaction"""
        if self.amount is None:

            if isinstance(self.amount, float):
                self.errors['amount'] = 'Amount must be an integer.'

            else:
                try:
                    self.amount = int(self.amount)
                except ValueError:
                    self.errors['amount'] = 'Amount must be an integer.'

                if self.amount == 0:
                    self.errors['amount'] = 'Amount cannot be 0.'

        return {
            'isValid': not self.errors,
            'errors': self.errors,
            'result': {} if self.errors else self.get_results()
        }
