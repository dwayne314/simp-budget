"""This module contains validation functions used by the api routes"""

import re
from datetime import datetime
from app.models import Users


def is_valid_date(date_string):
    """Returns whether a date in YYYY-MM-DD format is valid"""
    is_valid = True

    # Validates the date is formatted correctly
    try:
        year, month, day = [''.join(date) for date in date_string.split('-')]
        date_len_test = \
            len(year) == 4 and len(month) == 2 and len(day) == 2

        if not date_len_test:
            is_valid = False

    except ValueError:
        is_valid = False

    # Validates the date is valid
    try:
        datetime(*(int(i) for i in date_string.split('-')))
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
            raise ValueError('Child Validator class must contain a  '
                             'tested_fields attribute')

        if getattr(self, 'exclude', None):
            for key in self.exclude.keys():
                if key not in self.tested_fields:
                    raise ValueError('Excluded fields must be a member of '
                                     'the tested_fields')

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
            self.errors['password'] = 'Password must be between 7 and 30 ' \
                'characters.'

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
            self.errors['name'] = 'Account name must be less than 26 ' \
                'characters.'

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
                self.errors['name'] = 'Account name must be less than 26 ' \
                    'characters.'

        return {
            'isValid': not self.errors,
            'errors': self.errors,
            'result': {} if self.errors else self.get_results()
        }

class TransactionValidator(Validator):
    """Validates keyword arguments for a Transaction

    The validate functions determine if a set of kwargs are valid for the
    action type. Each validate function returns a dict containing the
    validation status, errors, and results.

    """

    tested_fields = ['amount', 'note', 'date']

    def __init__(self, **kwargs):
        super(TransactionValidator, self).__init__(**kwargs)
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

class RecurringTransactionValidator(Validator):
    """Validates keyword arguments for a Recurring Transaction

    The validate functions determine if a set of kwargs are valid for the
    action type. Each validate function returns a dict containing the
    validation status, errors, and results.

    """

    tested_fields = ['amount', 'note', 'transaction_type',
                     'frequency', 'scheduled_day',
                     'special_day']

    def __init__(self, **kwargs):
        super(RecurringTransactionValidator, self).__init__(**kwargs)
        self.amount = kwargs.get('amount')
        self.note = kwargs.get('note')
        self.transaction_type = kwargs.get('transaction_type')
        self.frequency = kwargs.get('frequency')
        self.scheduled_day = kwargs.get('scheduled_day')
        self.special_day = kwargs.get('special_day')

    def validate_amount(self, required=True):
        """Validates an amount field

        Arguments:
            required (bool): Determines whether a null value for the field will
                cause a validation error
        """

        if self.amount is None and required:
            self.errors['amount'] = self.missing_field_error('Amount')
        elif self.amount is not None and isinstance(self.amount, float):
            self.errors['amount'] = 'Amount must be an integer.'
        elif self.amount is not None:
            try:
                self.amount = int(self.amount)
            except ValueError:
                self.errors['amount'] = 'Amount must be an integer.'
            if self.amount == 0:
                self.errors['amount'] = 'Amount cannot be 0.'

    def validate_note(self, required=True):
        """Validates a note field

        Arguments:
            required (bool): Determines whether a null value for the field will
                cause a validation error
        """

        if self.note is None and required:
            self.errors['note'] = self.missing_field_error('Note')

    def validate_transaction_type(self, required=True):
        """Validates a transaction type field

        Arguments:
            required (bool): Determines whether a null value for the field will
                cause a validation error
        """

        valid_types = ['daily', 'weekly', 'monthly']

        if self.transaction_type is None and required:
            self.errors['transaction_type'] = self.missing_field_error(
                'Transaction type')
        elif self.transaction_type is not None:
            if self.transaction_type not in valid_types:
                self.errors['transaction_type'] = 'A recurring transaction ' \
                    "type must be either 'daily', 'weekly', or 'monthly'."

    def validate_scheduled_day(self, required=True):
        """Validates a scheduled day field

        Arguments:
            required (bool): Determines whether a null value for the field will
                cause a validation error
        """
        required_field_error = self.scheduled_day is None and required
        if required_field_error:
            self.errors['scheduled_day'] = \
                self.missing_field_error('Scheduled Day')

        elif self.scheduled_day is not None:
            try:
                self.scheduled_day = int(self.scheduled_day)
                daily_schedule_error = all([self.transaction_type == 'daily',
                                            self.scheduled_day != 1])
                weekly_schedule_error = all(
                    [self.transaction_type == 'weekly',
                     not 1 <= self.scheduled_day <= 7])
                monthly_schedule_error = all(
                    [self.transaction_type == 'monthly',
                     not 1 <= self.scheduled_day <= 31])
                if daily_schedule_error:
                    self.errors['frequency'] = 'A recurring daily ' \
                        'transaction must have a scheduled day of 1 or use ' \
                        'a special day.'
                elif weekly_schedule_error:
                    self.errors['frequency'] = 'A recurring weekly ' \
                        'transaction must have a scheduled day between 1 ' \
                        'and 7 days or use a special day.'
                elif monthly_schedule_error:
                    self.errors['frequency'] = 'A recurring monthly ' \
                        'transaction must have a scheduled day between 1 ' \
                        'and 31 or use a special day.'

            except ValueError:
                self.errors['scheduled_day'] = 'A recurring transaction\'s ' \
                    'schedule day must be an integer.'

    def validate_special_day(self, required=True):
        """Validates a special day field

        Arguments:
            required (bool): Determines whether a null value for the field will
                cause a validation error
        """

        valid_special_days = ['last', 'first']

        required_field_error = self.special_day is None and required
        valid_special_day_error = all(
            [self.special_day is not None, self.special_day not in valid_special_days])

        if required_field_error:
            self.errors['special_day'] = \
                self.missing_field_error('Special day')
        elif valid_special_day_error:
            self.errors['special_day'] = 'A recurring transaction\'s ' \
                'special day must be either "last" or "first".'


    def validate_frequency(self, required=True):
        """Validates a frequency field

        Arguments:
            required (bool): Determines whether a null value for the field will
                cause a validation error
        """

        required_field_error = self.frequency is None and required
        if required_field_error:
            self.errors['frequency'] = self.missing_field_error(
                'Transaction frequency')
        elif self.frequency is not None:
            try:
                self.frequency = int(self.frequency)

                no_scheduled_or_special_day_error = all(
                    [self.scheduled_day is None,
                     self.special_day is None])
                both_scheduled_and_special_day_error = all(
                    [self.scheduled_day, self.special_day])
                daily_frequency_error = all(
                    [self.transaction_type == 'daily', self.frequency != 1])
                weekly_frequency_error = all(
                    [self.transaction_type == 'weekly',
                     not 1 <= self.frequency <= 4])
                monthly_frequency_error = all(
                    [self.transaction_type == 'monthly',
                     not 1 <= self.frequency <= 4])

                if no_scheduled_or_special_day_error:
                    self.errors['frequency'] = 'A recurring transaction ' \
                        'must have a scheduled day or a special day.'
                elif daily_frequency_error:
                    self.errors['frequency'] = 'A daily recurring ' \
                        'transaction\'s frequency must be 1.'
                elif weekly_frequency_error:
                    self.errors['frequency'] = 'A weekly recurring ' \
                        'transaction\'s frequency must be between 1 and 4 ' \
                        'weeks.'
                elif monthly_frequency_error:
                    self.errors['frequency'] = 'A monthly recurring ' \
                        'transaction\'s frequency must be between 1 and 4 ' \
                        'months.'
                elif both_scheduled_and_special_day_error:
                    self.errors['frequency'] = 'A recurring ' \
                        'transaction cannot have a scheduled day and a ' \
                        'special day.'
            except ValueError:
                self.errors['scheduled_day'] = 'A recurring transaction\'s ' \
                    'frequency must be an integer.'

    def validate_create_recurring_transaction(self):
        """Validates the attributes sent to create a Recurring Transaction"""
        self.validate_amount(required=True)
        self.validate_note(required=True)
        self.validate_transaction_type(required=True)
        self.validate_scheduled_day(required=False)
        self.validate_special_day(required=False)
        self.validate_frequency(required=True)

        return {
            'isValid': not self.errors,
            'errors': self.errors,
            'result': {} if self.errors else self.get_results()
        }

    def validate_patch_recurring_transaction(self):
        """Validates the attributes sent to patch a REcurring Transaction"""
        self.validate_amount(required=False)
        self.validate_note(required=False)
        self.validate_transaction_type(required=False)
        self.validate_scheduled_day(required=False)
        self.validate_special_day(required=False)
        self.validate_frequency(required=False)

        return {
            'isValid': not self.errors,
            'errors': self.errors,
            'result': {} if self.errors else self.get_results()
        }
