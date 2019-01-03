# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
from . import configs


class LOGINClient(object):

    def __init__(self, http_client):
        self.http_client = http_client

    def request(self, method, host, path, data=None, params=None):
        result = self.http_client.request(
            method=method,
            host=host,
            path=path,
            data=data,
            params=params,
            headers=configs.headers,
        )
        return self.format_result(result)

    def post(self, host, path, data=None):
        return self.request(method='POST', host=host, path=path, data=data)

    def get(self, host, path, params=None):
        return self.request(method='GET', host=host, path=path, params=params)

    def format_result(self, result):
        if result['bk_error_code'] == 0:
            return {
                'result': True,
                'code': 0,
                'data': result['data'],
                'message': result.get('bk_error_msg', ''),
            }

        return {
            'result': False,
            'code': result['bk_error_code'],
            'data': result.get('data', None),
            'message': result['bk_error_msg'],
        }
