# -*- coding: utf-8 -*-
"""
检测服务可用性
"""
import json
from optparse import make_option

from django.core.management.base import BaseCommand


class Command(BaseCommand):

    option_list = BaseCommand.option_list + (
        make_option("--service", action="store", dest="service", help="Service name"),
    )

    def handle(self, *args, **options):
        self.check_job_ssl()

    def check_job_ssl(self):
        from components.bk.apis.job.get_agent_status import GetAgentStatus

        kwargs = {
            "app_id": 1,
            "ip_infos": [
                {
                    "ip": "127.0.0.1",
                    "plat_id": 1,
                }
            ],
        }
        result = GetAgentStatus().invoke(kwargs=kwargs)
        print "check_job_ssl:", json.dumps(result)
        assert result["result"], result["message"]
