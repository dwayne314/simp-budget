"""Manages secret injection throughout the application"""

import os
import boto3
import botocore.exceptions

os.environ['AWS_DEFAULT_REGION'] = 'us-east-2'
ssm = boto3.client('ssm')


class SecretManager():
    """Manages secret retrieval from the AWS Parameter Store and env variables

    Env variables will be used if the environment is not production and no
    AWS_PARAMETER_ROOT env variable is present.

    Attributes:
        mappings (dict): Stores all of the urls for the secrets upon
            instantiation for easy retrieval from the parameter store when
            called
    """

    mappings = {}

    def __init__(self):
        """Initializes the secrets manager to retrieve secrets

        Creates parameter path mappings using the AWS_PARAMETER_ROOT if local
        secrets are not to be used.

        Raises:
            ValueError: If the environment is production and no
                AWS_PARAMETER_ROOT is provided
        """

        self.root = os.environ.get("AWS_PARAMETER_ROOT")
        self.environment = os.environ.get("ENVIRONMENT")
        self.use_local_secrets = self.root is None \
            and self.environment != 'PRODUCTION'

        if not self.use_local_secrets:

            if self.root is None:
                raise ValueError('An AWS_PARAMETER_ROOT must be provided to '
                                 'get secrets from a production environment')
            try:
                self.store_parameter_mappings()
            except botocore.exceptions.NoCredentialsError as error:
                raise error

    @staticmethod
    def get_head_node(param):
        """Returns the Head Node of an AWS Parameter in File Form

        Arguments:
            param (str): The parameter to return the node from. Param should
                be in the following format `/root/node/node/head_node`

        Returns:
            A string stripped on slashes representing the root param
        """

        return param.split('/')[-1]

    @staticmethod
    def get_parameter(path):
        """Decrypts and Retrieves a parameter rom the Parameter Store"""
        parameter = ssm.get_parameter(
            Name=path, WithDecryption=True)

        return parameter["Parameter"]["Value"]

    def store_parameter_mappings(self):
        """Allows the retrieval of parameter paths by name

        Parses all parameters in the AWS Parameter store beginning with the
        secret root and stores the parameter and it's path in the mappings
        dictionary for easy retrieval when called.
        """

        paginator = ssm.get_paginator('describe_parameters')
        parameters = paginator.paginate(
            ParameterFilters=[
                {
                    "Key": "Path",
                    "Option": "Recursive",
                    "Values": ["/{env}".format(env=self.root)]
                }]).build_full_result()
        for parameter in parameters['Parameters']:
            header_node = self.get_head_node(parameter["Name"])
            self.mappings[header_node] = parameter["Name"]

    def get(self, val, force_type=None):
        """Returns the value of the secret"""

        if self.use_local_secrets:
            secret = str(os.environ.get(val))
        else:
            param_path = self.mappings.get(val)
            secret = self.get_parameter(param_path) if not force_type \
                else force_type(self.get_parameter(param_path))
        return secret
