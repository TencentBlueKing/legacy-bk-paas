# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
from api import models
from common import http


def get_server_category(mode):
    return 'tapp' if mode == 'test' else 'app'


def has_active_server(category):
    if models.BkServer.objects.filter(category=category, is_active=True):
        return True
    return False


def has_active_thirdserver(category):
    if models.ThirdServer.objects.filter(category=category, is_active=True):
        return True
    return False


def agent_header(sid, token):
    return {
        "Content-Type": "application/json",
        "X-ID": str(sid),
        "X-TOKEN": str(token)
    }


def check_agent_health(bk_server):
    resp = http.http_request(
        method="GET",
        url="http://%s:%s/v1/app/healthz" % (bk_server.ip_address, bk_server.ip_port),
        headers=agent_header(bk_server.s_id, bk_server.token)
    )
    if resp.get("error") != 0:
        raise Exception("%s agent return not zero" % bk_server.ip_address)
    return resp
