# -*- coding: utf-8 -*-
"""
检测 GSE 服务可用性
"""
from django.core.management.base import BaseCommand

from healthz.views import check_gse_api


class Command(BaseCommand):
    def handle(self, *args, **options):
        check_gse_api()
