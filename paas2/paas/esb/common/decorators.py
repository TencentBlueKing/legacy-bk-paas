# -*- coding: utf-8 -*-
from functools import wraps

from django.utils.decorators import available_attrs
from django.shortcuts import render
from django.utils.translation import ugettext as _

from .django_utils import JsonResponse


def is_user_super(view_func):
    """
    检查用户是否为超级用户
    """

    @wraps(view_func, assigned=available_attrs(view_func))
    def _wrapped_view(self, request, *args, **kwargs):
        if request.user.is_superuser:
            return view_func(self, request, *args, **kwargs)
        else:
            if request.is_ajax():
                return JsonResponse({"error_message": _(u"您没有访问权限，请联系系统管理员添加！"), "data": None})
            return render(request, "403.html")

    return _wrapped_view
