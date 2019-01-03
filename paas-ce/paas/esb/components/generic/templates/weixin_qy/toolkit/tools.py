# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
from . import configs


class WEIXINClient(object):

    def __init__(self, http_client):
        self.http_client = http_client

    def request(self, method, path, params=None, data=None):
        result = self.http_client.request(method, host=configs.host, path=path, params=params, data=data)
        try:
            err_code = result.get('errcode')
        except:
            return {
                'result': False,
                'message': 'An exception occurred while requesting business WeChat service, '
                'please contact the component developer to handle it.'
            }
        if err_code in (None, 0):
            return {'result': True, 'data': result}
        else:
            return {'result': False, 'message': result['errmsg'], 'data': result}

    def post(self, *args, **kwargs):
        return self.request('POST', *args, **kwargs)

    def get(self, *args, **kwargs):
        return self.request('GET', *args, **kwargs)
