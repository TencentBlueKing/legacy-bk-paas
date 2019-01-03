# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
import json

from esb.utils.base import has_path_vars
from common.errors import error_codes
from components.component import BaseComponent, SetupConfMixin
from .toolkit import configs


class FtaComponent(BaseComponent, SetupConfMixin):

    sys_name = configs.SYSTEM_NAME

    def handle(self):
        # 替换目标地址中的变量模版
        path = self.dest_path
        if has_path_vars(self.dest_path):
            path_vars = self.request.path_vars and self.request.path_vars.val_dict or {}
            try:
                path = self.dest_path.format(**path_vars)
            except KeyError, e:
                raise error_codes.BUFFET_CANNOT_FORMAT_PATH.format_prompt('{%s}' % e.args[0])

        # 请求参数
        params, data = None, None
        if self.dest_http_method == 'GET':
            params = self.request.kwargs
            headers = {'Content-Type': 'application/x-www-form-urlencoded'}
        elif self.dest_http_method == 'POST':
            data = json.dumps(self.request.kwargs)
            headers = {'Content-Type': 'application/json'}

        if 'X-Secret' in self.request.headers:
            headers.update({'X-Secret': self.request.headers['X-Secret']})

        # 请求接口
        response = self.outgoing.http_client.request(
            self.dest_http_method,
            configs.host,
            path,
            params=params,
            data=data,
            headers=headers,
            timeout=60,
        )
        self.response.payload = response
