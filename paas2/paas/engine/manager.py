# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS
Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License.
You may obtain a copy of the License at http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
specific language governing permissions and limitations under the License.
"""


from collections import defaultdict

from django.db import models

from common.log import logger
from common.constants import ModeEnum
from engine.constants import THIRD_SERVER_CATEGORY_MQ, CATEGORY_SERVER_TEST, CATEGORY_SERVER_PROD


class ThirdServerManager(models.Manager):
    def is_service_rabbitmq_active(self):
        """
        判断rabbitmq是否注册激活
        """
        is_exists = False
        try:
            is_exists = self.filter(category=THIRD_SERVER_CATEGORY_MQ, is_active=True).exists()
        except Exception:
            logger.exception("_is_service_rabbitmq_active check failed!")

        return is_exists

    def get_mq_services(self):
        services = defaultdict(list)
        third_server_list = self.filter(category=THIRD_SERVER_CATEGORY_MQ, is_active=True).all()
        for server in third_server_list:
            services[server.category].append(server.id)
        return services


class BkServerManager(models.Manager):
    def check_test_app_deployable(self):
        return self.filter(category=CATEGORY_SERVER_TEST, is_active=True).exists()

    def check_prod_app_deployable(self):
        return self.filter(category=CATEGORY_SERVER_PROD, is_active=True).exists()

    def check_app_deployable(self, mode):
        return self.check_test_app_deployable() if mode == ModeEnum.TEST else self.check_prod_app_deployable()

    # Deprecated
    def check_saas_app_deployable(self):
        return self.filter(category=CATEGORY_SERVER_PROD, is_active=True).exists()

    def get_prod_servers(self):
        return self.filter(category=CATEGORY_SERVER_PROD, is_active=True).all()

    def get_test_servers(self):
        return self.filter(category=CATEGORY_SERVER_TEST, is_active=True).all()


class BkHostingShipManager(models.Manager):
    def _get_app_servers(self, app_code, category):
        return self.filter(bk_app__app_code=app_code, bk_server__category=category, is_active=True).all()

    def get_app_test_servers(self, app_code):
        hostingShips = self._get_app_servers(app_code, CATEGORY_SERVER_TEST)
        return [h.bk_server.id for h in hostingShips]

    def get_app_prod_servers(self, app_code):
        hostingShips = self._get_app_servers(app_code, CATEGORY_SERVER_PROD)
        return [h.bk_server.id for h in hostingShips]
