# -*- coding: utf-8 -*-
import pytz
from django.utils import timezone
from django.conf import settings
from django.utils import translation
from django.utils.translation import trans_real as trans


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
        # only api url
        full_path = request.get_full_path()
        if full_path.startswith(settings.SITE_URL + "paas/api/"):
            try:
                language = request.META.get("HTTP_BLUEKING_LANGUAGE", "en")
                language = trans.get_supported_language_variant(language)
            except Exception:
                language = "en"
            if language:
                translation.activate(language)
                request.LANGUAGE_CODE = translation.get_language()
