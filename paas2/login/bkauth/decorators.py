# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from functools import wraps

from django.utils.decorators import available_attrs


def login_exempt(view_func):
    """
    登录豁免,被此装饰器修饰的action可以不校验登录
    """

    def wrapped_view(*args, **kwargs):
        return view_func(*args, **kwargs)

    wrapped_view.login_exempt = True
    return wraps(view_func, assigned=available_attrs(view_func))(wrapped_view)
