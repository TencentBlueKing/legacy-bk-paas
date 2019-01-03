# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa


from ..base import ComponentAPI


class CollectionsEsb(object):
    """Collections of ESB APIS"""

    def __init__(self, client):
        self.client = client

        self.get_systems = ComponentAPI(
            client=self.client, method='GET', path='/api/c/compapi/esb/get_systems/',
            description='Get component system info',
        )
        self.get_components = ComponentAPI(
            client=self.client, method='GET', path='/api/c/compapi/esb/get_components/',
            description='Get component info',
        )
        self.add_app_component_perm = ComponentAPI(
            client=self.client, method='POST', path='/api/c/compapi/esb/add_app_component_perm/',
            description='Add component permission for app',
        )
        self.get_weixin_access_token = ComponentAPI(
            client=self.client, method='GET', path='/api/c/compapi/weixin/get_token/',
            description='Get wechat access_token',
        )
