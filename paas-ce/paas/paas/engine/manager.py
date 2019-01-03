# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

from __future__ import unicode_literals

import json
from collections import defaultdict

from django.db import models

from engine.constants import ServerCategoryEnum, ExternalServerCategoryEnum


class BkServerManager(models.Manager):
    def check_test_app_deployable(self):
        return self.filter(category=ServerCategoryEnum.TEST.value, is_active=True).exists()

    def check_prod_app_deployable(self):
        return self.filter(category=ServerCategoryEnum.PROD.value, is_active=True).exists()

    def check_saas_app_deployable(self):
        return self.filter(category=ServerCategoryEnum.PROD.value, is_active=True).exists()

    def update_or_create_server(self, server_id, server_ip, server_port,
                                app_port, category):
        if server_id:
            self.filter(id=server_id).update(ip_address=server_ip,
                                             ip_port=server_port,
                                             app_port=app_port,
                                             category=category)
            return {}
        server = self.create(
            ip_address=server_ip,
            ip_port=server_port,
            app_port=app_port,
            category=category,
            is_active=False)

        return {
            'server_id': server.id,
            's_id': str(server.s_id),
            'token': str(server.token)
        }

    def is_server_exists(self, server_id, server_ip, server_port):
        if server_id:
            query = self.exclude(id=server_id)
        else:
            query = self.all()
        server_count = query.filter(ip_address=server_ip, ip_port=server_port).count()
        if server_count > 0:
            return True
        return False

    def get_active_server_ips(self):
        """获取已激活机器的ip列表
        """
        active_servers = self.filter(is_active=True)
        active_server_ips = active_servers.values_list('ip_address', flat=True)
        return list(set(active_server_ips))

    def category_has_active_server(self, category, server_id):
        active_servers = self.exclude(id=server_id).filter(category=category, is_active=True)
        if active_servers.exists():
            return active_servers[0]
        return None


class ExternalServerManager(models.Manager):
    def is_server_exists(self,  server_id, server_ip, server_port):
        if server_id:
            query = self.exclude(id=server_id)
        else:
            query = self.all()
        # IP、端口不能重复
        for _s in query:
            if _s.ip_address == server_ip and _s.ip_port == server_port:
                return True
        return False

    def update_or_create_server(self, server_id, server_ip, server_port,
                                username, password, category):
        # 服务器基本信息以json串的形式存储
        server_info = {
            'ip_address': server_ip,
            'ip_port': server_port,
            'username': username,
            'password': password,
        }
        server_info = json.dumps(server_info)
        # 编辑信息
        if server_id:
            self.filter(id=server_id).update(server_info=server_info, category=category)
            return {}

        server = self.create(server_info=server_info, category=category, is_active=False)
        return {'server_id': server.id}

    def is_rabbitmq_active(self):
        """判断rabbitmq是否注册激活
        """
        return self.filter(category=ExternalServerCategoryEnum.MQ.value, is_active=True).exists()

    def category_has_active_server(self, category, server_id):
        active_servers = self.exclude(id=server_id).filter(category=category, is_active=True)
        if active_servers.exists():
            return active_servers[0]
        return None

    def get_external_services(self):
        """获取所有注册的服务

        currently, only MQ
        """
        services = defaultdict(list)
        third_server_list = self.filter(category=ExternalServerCategoryEnum.MQ.value, is_active=True).all()
        for server in third_server_list:
            services[server.category].append(server.id)
        return services
