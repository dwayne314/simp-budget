"""This module contains all of the common helper utilities"""

import os
import base64


def create_token():
    """Creates a base64 encoded token"""
    token = base64.b64encode(os.urandom(24)).decode('utf-8')
    return token
