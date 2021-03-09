# -*- coding: utf-8 -*-
from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

from account.accounts import Account


class BkBackend(ModelBackend):
    """
    自定义认证方法
    """

    def authenticate(self, request):
        account = Account()
        login_status, username = account.is_bk_token_valid(request)
        if not login_status:
            return None

        user_model = get_user_model()
        try:
            user = user_model._default_manager.get_by_natural_key(username)
            return user
        except user_model.DoesNotExist:
            return None
