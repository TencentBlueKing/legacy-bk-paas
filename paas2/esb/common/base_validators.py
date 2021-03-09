# -*- coding: utf-8 -*-


class ValidationError(Exception):
    pass


class BaseValidator(object):
    """
    Base class for validator
    """

    def validate(self, request):
        pass
