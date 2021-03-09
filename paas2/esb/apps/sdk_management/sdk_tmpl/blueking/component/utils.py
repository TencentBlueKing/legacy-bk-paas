# -*- coding: utf-8 -*-
import json
import base64
import hmac
import hashlib

from .compat import str


def get_signature(method, path, app_secret, params=None, data=None):
    """generate signature"""
    kwargs = {}
    if params:
        kwargs.update(params)
    if data:
        data = json.dumps(data) if isinstance(data, dict) else data
        kwargs["data"] = data
    kwargs = "&".join(["%s=%s" % (k, v) for k, v in sorted(kwargs.items(), key=lambda x: x[0])])
    orignal = "%s%s?%s" % (method, path, kwargs)
    app_secret = app_secret.encode("utf-8") if isinstance(app_secret, str) else app_secret
    orignal = orignal.encode("utf-8") if isinstance(orignal, str) else orignal
    signature = base64.b64encode(hmac.new(app_secret, orignal, hashlib.sha1).digest())
    return signature if isinstance(signature, str) else signature.decode("utf-8")
