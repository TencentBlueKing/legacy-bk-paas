# -*- coding: utf-8 -*-

from __future__ import unicode_literals

from common.constants import enum


LoginErrorCodes = enum(
    E1302000_DEFAULT_CODE=1302000,
    E1302001_BASE_SETTINGS_ERROR=1302001,
    E1302002_BASE_DATABASE_ERROR=1302002,
    E1302003_BASE_HTTP_DEPENDENCE_ERROR=1302003,
    E1302004_BASE_BKSUITE_DATABASE_ERROR=1302004,
    E1302005_BASE_LICENSE_ERROR=1302005,
    # E1302006_ENTERPRISE_LOGIN_ERROR=1302006,
)


class AuthenticationError(Exception):
    message = "login error"
    redirect_to = ""

    def __init__(self, message=None, redirect_to=None):
        if message is not None:
            self.message = message
        if redirect_to is not None:
            self.redirect_to = redirect_to
