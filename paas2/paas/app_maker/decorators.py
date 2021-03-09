# -*- coding: utf-8 -*-
from django.http import JsonResponse
from django.utils.decorators import available_attrs

try:
    from functools import wraps
except ImportError:
    from django.utils.functional import wraps  # Python 2.4 fallback.

from app_maker.signature import AppMakerSign
from api.utils import InnerFeedback


def signature_required():
    def decorator(view_func):
        @wraps(view_func, assigned=available_attrs(view_func))
        def _wrapped_view(request, *args, **kwargs):
            feedback = InnerFeedback()
            try:
                sign = AppMakerSign(request)
                sign.clean()
            except Exception as error:
                feedback["result"] = False
                feedback["message"] = u"%s" % error
                feedback["code"] = "1001"
                return JsonResponse(feedback)
            return view_func(request, *args, **kwargs)

        return _wrapped_view

    return decorator
