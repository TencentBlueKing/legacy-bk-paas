# -*- coding: utf-8 -*-

from __future__ import unicode_literals
import pytz

from django.utils import timezone
from django.conf import settings
from django.utils import translation
from django.utils.translation import trans_real as trans

from bk_i18n.constants import LOGIN_API_URL_SUFFIX_LIST


class TimezoneMiddleware(object):
    def process_request(self, request):
        tzname = request.session.get(settings.TIMEZONE_SESSION_KEY)
        if tzname:
            timezone.activate(pytz.timezone(tzname))
        else:
            timezone.deactivate()


class LanguageMiddleware(object):
    def process_request(self, request):
        language = request.session.get(translation.LANGUAGE_SESSION_KEY)
        if language:
            translation.activate(language)
            request.LANGUAGE_CODE = translation.get_language()


class ApiLanguageMiddleware(object):
    def process_request(self, request):
        # check api url
        full_path = request.get_full_path()
        is_api_url = False
        for i in LOGIN_API_URL_SUFFIX_LIST:
            if full_path.startswith("/accounts/" + i + "/") or full_path.startswith("/login/accounts/" + i + "/"):
                is_api_url = True
                break
        # only api url do
        if is_api_url:
            try:
                language = request.META.get("HTTP_BLUEKING_LANGUAGE", "en")
                language = trans.get_supported_language_variant(language)
            except Exception:
                language = "en"
            if language:
                translation.activate(language)
                request.LANGUAGE_CODE = translation.get_language()
