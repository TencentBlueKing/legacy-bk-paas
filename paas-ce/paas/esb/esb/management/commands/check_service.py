# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
"""
检测服务可用性
"""
import json
from optparse import make_option

from django.core.management.base import BaseCommand


class Command(BaseCommand):

    option_list = BaseCommand.option_list + (
        make_option('--service', action='store', dest='service', help='Service name'),
    )

    def handle(self, *args, **options):
        self.check_job_ssl()

    def check_job_ssl(self):
        from components.bk.apis.job.get_agent_status import GetAgentStatus
        kwargs = {
            'app_id': 1,
            'ip_infos': [
                {
                    'ip': '127.0.0.1',
                    'plat_id': 1,
                }
            ]
        }
        result = GetAgentStatus().invoke(kwargs=kwargs)
        print 'check_job_ssl:', json.dumps(result)
        assert result['result'], result['message']
