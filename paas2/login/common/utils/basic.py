# -*- coding: utf-8 -*-
from django.utils.html import escape as html_escape


def escape_html_return_msg(func):
    """
    装饰器：用于验证信息返回xss转义
    """

    def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)
        # 对于字符串类型，进行html转义
        return [html_escape(item) if isinstance(item, basestring) else item for item in result]

    return wrapper
