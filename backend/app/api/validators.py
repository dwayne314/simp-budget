"""This module contains validation functions used by the api routes"""

import re
from datetime import datetime
from app.models import Users


def is_valid_date(dateString):
    """Returns whether a date in YYYY-MM-DD format is valid"""
    is_valid = True

    # Validates the date is formatted correctly
    try:
        year, month, day = [''.join(date) for date in dateString.split('-')]
        date_len_test = \
            len(year) == 4 and len(month) == 2 and len(day) == 2

        if not date_len_test:
            is_valid = False

    except ValueError:
        is_valid = False

    # Validates the date is valid
    try:
        datetime(*(int(i) for i in dateString.split('-')))
    except ValueError:
        is_valid = False

    return is_valid


class Validator():
    """The base validator class for the application

    Raises:
        ValueError: If the class does not have a tested_fields attribute or
            the class contains an exclude attribute not found in the
            tested_fields

    """

    def __init__(self, **kwargs):
        if not getattr(self, 'tested_fields', None):
            raise ValueError('Child Validator class must contain a tested_fields '
                             'attribute')

        if getattr(self, 'exclude', None):
            for key in self.exclude.keys():
                if key not in self.tested_fields:
                    raise ValueError('Excluded fields must be a member of the '
                                     'tested_fields')

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

    Arguments:
        exclude (dict): a dictionary with keys

    """

    email_regex = '^.+@(\[?)[a-zA-Z0-9-.]+.([a-zA-Z]{2,3}|[0-9]{1,3})(]?)$'
    tested_fields = ['first_name', 'last_name', 'email', 'password']

    def __init__(self, exclude={}, **kwargs):
        self.first_name = kwargs.get('first_name')
        self.last_name = kwargs.get('last_name')
        self.email = kwargs.get('email')
        self.password = kwargs.get('password')
        self.exclude = exclude
        super(UserValidator, self).__init__(**kwargs)


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
                if Users.is_duplicate(self.email) \
                        and not self.exclude.get('email') == self.email:
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
        elif len(self.name) > 25:
            self.errors['name'] = 'Account name must be less than 26 characters.'


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
            elif len(self.name) > 25:
                self.errors['name'] = 'Account name must be less than 26 characters.'

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

    tested_fields = ['amount', 'note', 'date']

    def __init__(self, **kwargs):
        super(TransationValidator, self).__init__(**kwargs)
        self.amount = kwargs.get('amount')
        self.note = kwargs.get('note')
        self.date = kwargs.get('date')

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

        if self.note is None:
            self.errors['note'] = self.missing_field_error('Note')

        if self.date is None:
            self.errors['date'] = self.missing_field_error('Date')
        else:
            valid_date = is_valid_date(self.date)
            if not valid_date:
                self.errors['date'] = 'Date must be in yyyy-mm-dd format.'

        return {
            'isValid': not self.errors,
            'errors': self.errors,
            'result': {} if self.errors else self.get_results()
        }

    def validate_patch_transaction(self):
        """Validates the attributes sent to patch a transaction"""
        if self.amount:

            if isinstance(self.amount, float):
                self.errors['amount'] = 'Amount must be an integer.'

            else:
                try:
                    self.amount = int(self.amount)
                except ValueError:
                    self.errors['amount'] = 'Amount must be an integer.'

                if self.amount == 0:
                    self.errors['amount'] = 'Amount cannot be 0.'

        if self.date:
            valid_date = is_valid_date(self.date)
            if not valid_date:
                self.errors['date'] = 'Date must be in yyyy-mm-dd format.'

        return {
            'isValid': not self.errors,
            'errors': self.errors,
            'result': {} if self.errors else self.get_results()
        }
