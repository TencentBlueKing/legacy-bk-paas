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


import random
from engine.models import BkServer, BkHostingShip


def get_app_prod_deploy_servers(app_code):
    """
    get app prod servers and deploy hostships
    """
    hostships = BkHostingShip.objects.get_app_prod_servers(app_code)
    servers = BkServer.objects.get_prod_servers()
    return hostships, servers


def random_choose_servers(servers):
    """
    if hostships is empty, then it's the first time that app do deploy
    random choose 2
    """
    server_ids = [s.id for s in servers]
    random.shuffle(server_ids)
    return server_ids[:2]
