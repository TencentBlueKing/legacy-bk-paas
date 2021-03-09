# -*- coding: utf-8 -*-
import base64

try:
    from functools import wraps
except ImportError:
    from django.utils.functional import wraps  # Python 2.4 fallback.

from django.utils.decorators import available_attrs

from bk_iam.utils import FailJsonResponse
from common.bk_iam import Permission


def basic_auth_required(view_func):
    @wraps(view_func, assigned=available_attrs(view_func))
    def _wrapped_view(request, *args, **kwargs):
        auth = request.META.get("HTTP_AUTHORIZATION", "").split()

        if len(auth) != 2 or auth[0].lower() != "basic":
            response = FailJsonResponse(401, "UNAUTHORIZED")
            response["WWW-Authenticate"] = 'Basic realm="%s"' % "Basci Auth Protected"
            return response

        username, password = base64.b64decode(auth[1]).split(":")

        if username != "bk_iam" or password != Permission().get_token():
            response = FailJsonResponse(401, "UNAUTHORIZED")
            return response

        response = view_func(request, *args, **kwargs)
        response["X-Request-Id"] = request.META.get("HTTP_X_REQUEST_ID", "")
        return response

    return _wrapped_view
