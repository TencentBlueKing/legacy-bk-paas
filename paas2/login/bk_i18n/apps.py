# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.apps import AppConfig


class BkI18nAppConfig(AppConfig):
    name = "bk_i18n"

    def ready(self):
        import bk_i18n.signal_receivers  # noqa
