# -*- coding: utf-8 -*-
"""
检测 JOB 服务可用性
"""
from django.core.management.base import BaseCommand

from healthz.views import check_job_api


class Command(BaseCommand):
    def handle(self, *args, **options):
        check_job_api()
