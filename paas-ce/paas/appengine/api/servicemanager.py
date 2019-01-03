# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
import json
from abc import ABCMeta, abstractmethod

from requests.status_codes import codes

from api import models
from common import http


def update_or_create_rabbitmq_server(**kwargs):  # can abstract ServiceServerManager class
    server_info = {
        "ip_address": kwargs.get("server_ip"),
        "ip_port": "15672",
        "username": kwargs.get("username"),
        "password": kwargs.get("password")
    }

    server_info = json.dumps(server_info)
    defaults = {
        'server_info': server_info,
        'is_active': False
    }
    return models.ThirdServer.objects.update_or_create(category=models.THIRD_SERVER_CATEGORY_MQ, defaults=defaults)


def ServiceManagerFactory(service_name):
    if service_name == "rabbitmq":
        return RabbitmqManager()
    raise NotImplementedError("%s not supported" % service_name)


class ThirdServiceManager(object):
    __metaclass__ = ABCMeta

    @abstractmethod
    def apply(self, bk_app, mode, triggers):
        pass

    @abstractmethod
    def health_check(self, server_id):
        pass


class RabbitmqManager(ThirdServiceManager):

    def apply(self, bk_app, mode, triggers):
        self.bk_app, self.mode, self.triggers = bk_app, mode, triggers

        server_data = models.ThirdServer.objects.get(category=models.THIRD_SERVER_CATEGORY_MQ,
                                                     is_active=True).server_data

        app_code = self.bk_app.app_code
        mq_pwd = str(self.bk_app.token)[:8]
        admin_account = {
            "name": server_data.get("username"),
            "password": server_data.get("password")
        }
        user_account = {
            "name": self.bk_app.app_code,
            "password": mq_pwd
        }
        server_url = "http://%s:%s" % (server_data.get("ip_address"), server_data.get("ip_port"))
        vhost = 'test_%s' % app_code if self.mode == 'test' else 'prod_%s' % app_code
        self._apply_mq_res(server_url, admin_account, user_account, vhost)
        return {
            "BK_BROKER_URL": "amqp://%s:%s@%s:5672/%s" % (app_code, mq_pwd, server_data.get('ip_address'), vhost),
            "IS_USE_CELERY": "true",
            "IS_USE_CELERY_BEAT": "true" if self.triggers.get("is_use_celery_beat") else "false"
        }

    def _apply_mq_res(self, server_url, admin_account, user_account, vhost):
        app_code = self.bk_app.app_code
        headers = {'content-type': 'application/json'}
        auth = (admin_account['name'], admin_account['password'])

        try:
            # 创建vhost
            http.http_request(
                method="PUT",
                url='%s/api/vhosts/%s' % (server_url, vhost),
                desired_code=codes.no_content,
                headers=headers,
                auth=auth
            )
        except Exception, e:
            raise Exception("create vhost failed: %s" % e)

        try:
            # 创建账户
            http.http_request(
                method="PUT",
                url="%s/api/users/%s" % (server_url, app_code),
                desired_code=codes.no_content,
                headers=headers,
                auth=auth,
                json={"password": user_account['password'], "tags": "management"}
            )
        except Exception, e:
            raise Exception("create account failed: %s" % e)

        try:
            http.http_request(
                method="PUT",
                url="%s/api/permissions/%s/%s" % (server_url, vhost, app_code),
                desired_code=codes.no_content,
                headers=headers,
                auth=auth,
                json={"configure": ".*", "write": ".*", "read": ".*"}
            )
        except Exception, e:
            raise Exception("vhost authorization failed: %s" % e)

    def health_check(self, server_id):
        try:
            server_data = models.ThirdServer.objects.get(id=server_id,
                                                         category=models.THIRD_SERVER_CATEGORY_MQ).server_data
        except models.ThirdServer.DoesNotExist:
            raise Exception("no rabbitmq server is active")

        try:
            http.http_request(
                method="GET",
                url="http://%s:%s/api/overview" % (server_data.get('ip_address'), server_data.get('ip_port')),
                auth=(server_data.get("username"), server_data.get("password"))
            )
        except Exception, e:
            raise Exception("administrator account information error or rabbitmq service exception: %s" % e)
