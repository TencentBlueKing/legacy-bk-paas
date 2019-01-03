# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

from __future__ import unicode_literals

import os

from django.conf import settings
from django.http import HttpResponse, JsonResponse
from django.views.generic import View

from common.mixins.base import LoginExemptMixin
import requests


class HealthzView(LoginExemptMixin, View):
    """health check for paas

    if fail, should be: status=500, response=plain raw text show the fail
    """
    def get(self, request):
        # check settings, 注意不暴露密码等敏感信息
        try:
            settings.ESB_TOKEN
            {
                'debug': settings.DEBUG,
                'env': os.getenv("BK_ENV", "unknow"),
                'paas_domain': settings.PAAS_DOMAIN,
                'paas_inner_domain': settings.PAAS_INNER_DOMAIN,
                'cookie_domain': settings.BK_COOKIE_DOMAIN,

                'host_engine': settings.ENGINE_HOST,
                'host_login': settings.LOGIN_HOST,

                'host_cc': settings.HOST_CC,
                'host_job': settings.HOST_JOB,

                'mysql': {
                    'host': settings.DATABASES.get("default", {}).get("HOST"),
                    'port': settings.DATABASES.get("default", {}).get("PORT"),
                    'user': settings.DATABASES.get("default", {}).get("USER"),
                    'database': settings.DATABASES.get("default", {}).get("NAME")
                }
            }
        except Exception as e:
            message = "配置文件不正确, 缺失对应配置: {}".format(e)
            return HttpResponse(message, status=500)

        # check db
        try:
            from saas.models import SaaSAppVersion
            objs = SaaSAppVersion.objects.all()
            [o.version for o in objs]
        except Exception as e:
            message = "数据库连接存在问题: {}".format(e)
            return HttpResponse(message, status=500)

        # check hosts
        # 不检查cc/jos, 因为不是强依赖只是用来展示, 用户浏览器能访问通即可, paas所在机器不需要
        engine_host = settings.ENGINE_HOST
        login_host = settings.LOGIN_HOST

        hosts = {
            'engine_host': engine_host,
            'login_host': login_host,
        }

        for name, host in hosts.iteritems():
            try:
                if not host.startswith('http'):
                    host = 'http://{}'.format(host)
                requests.get(host, timeout=10)
            except Exception as e:
                message = "第三方依赖连接超时: name={}, host={},  error={}".format(name, host, str(e))
                return HttpResponse(message, status=500)

        return JsonResponse({"result": True}, status=200)
