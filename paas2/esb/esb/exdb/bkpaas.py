# -*- coding: utf-8 -*-
from cachetools import cached, TTLCache

from esb.bkcore.models import AppAccount
from esb.exdb.models import App


class AppSecureInfo(object):
    """
    Helper for AppSecureInfo
    """

    @classmethod
    @cached(cache=TTLCache(maxsize=2000, ttl=300))
    def get_by_app_code(cls, app_code):
        secure_key_list = []

        # get secret from paas
        app = App.objects.filter(code=app_code).first()
        if app:
            secure_key_list.append(app.auth_token)

        # get secret from esb
        app = AppAccount.objects.filter(app_code=app_code).first()
        if app:
            secure_key_list.append(app.app_token)

        return {"app_code": app_code, "secure_key_list": secure_key_list} if secure_key_list else None
