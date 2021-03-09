# -*- coding: utf-8 -*-
"""
Utils for django itself
"""
import json

from django.http import HttpResponse


class JsonResponse(HttpResponse):
    def __init__(self, content, *args, **kwargs):
        content = json.dumps(content, ensure_ascii=False)
        super(JsonResponse, self).__init__(content, content_type="application/json; charset=utf-8", *args, **kwargs)
