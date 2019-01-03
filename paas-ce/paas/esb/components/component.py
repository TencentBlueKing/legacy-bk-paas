# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
import re
import json

from common.base_loggers import BasicRequestLogger
from common.errors import error_codes
from esb.component import BaseComponent
from esb.channel import ApiChannel
from esb.bkauth.validators import UserAuthValidator
from esb.bkapp.validators import AppAuthValidator, AppCodeWhiteListValidator
from esb.ratelimit.validators import ApiRateLimitValidator
from esb.compperm.validators import ComponentPermValidator
from esb.utils.base import SmartHost
from esb.utils.base import RE_PATH_VARIABLE


class ApiChannelForAPIS(ApiChannel):
    request_loggers = [
        BasicRequestLogger(),
    ]

    request_validators = [
        AppAuthValidator(),
        UserAuthValidator(),
        ComponentPermValidator(),
        ApiRateLimitValidator(),
    ]


class ESBApiChannelForAPIS(ApiChannel):
    request_validators = [
        AppAuthValidator(),
        AppCodeWhiteListValidator(('bk_paas', 'bk_console', )),
    ]


class FTAApiChannelForAPIS(ApiChannel):
    request_loggers = [
        BasicRequestLogger(),
    ]
    request_validators = []


class Component(BaseComponent):
    """Component class"""
    pass


class SetupConfMixin(object):

    def setup_conf(self, conf):
        self.__dict__.update(conf)
        if 'host' in conf:
            self.set_host(conf['host'])

    def set_host(self, host):
        if isinstance(host, dict):
            self.host = SmartHost(**host)
        elif isinstance(host, SmartHost):
            self.host = host
        else:
            self.host = None


class ConfComponent(BaseComponent, SetupConfMixin):
    """Component for confapis"""

    def get_request_info(self):
        # 替换目标地址中的变量模版
        path = self.dest_path

        # 获取路径变量，并格式化目标路径
        dest_path_var_fields = RE_PATH_VARIABLE.findall(self.dest_path)
        if dest_path_var_fields:
            path_vars = self.request.path_vars and self.request.path_vars.val_dict or self.request.kwargs
            try:
                path = self.dest_path.format(**path_vars)
            except KeyError as e:
                raise error_codes.ARGUMENT_ERROR.format_prompt('param %s is required' % e.args[0])

        # 获取参数，并去除bk_app_code、bk_app_secret等参数
        params = self.request.get_strict_clean_params()
        bk_supplier_account = params.pop('bk_supplier_account', '0')

        # 将路径变量从参数中去除
        for key in dest_path_var_fields:
            params.pop(key, None)

        # 处理额外字段，将扩展字段添加到参数
        extra_param_fields = self.get_extra_param_fields()
        if 'creator' in extra_param_fields:
            params['creator'] = self.current_user.username
        if 'bk_supplier_account' in extra_param_fields:
            params['bk_supplier_account'] = bk_supplier_account

        if self.dest_http_method == 'GET':
            params, data = params, None
        else:
            params, data = None, json.dumps(params)
        return {
            'path': path,
            'params': params,
            'data': data,
        }

    def get_extra_param_fields(self):
        extra_param_fields = getattr(self, 'extra_param_fields', '') or ''
        return re.findall(r'[^,; ]+', extra_param_fields)
