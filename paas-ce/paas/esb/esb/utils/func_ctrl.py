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

from esb.bkcore.models import FunctionController


class FunctionControllerClient(object):
    """功能控制器"""

    @classmethod
    def _get_func_ctrl_by_code(cls, func_code, data_type='list'):
        """根据功能标识获取对应数据

        :param str data_type: list，将字符串按照逗号、分号分隔转换为列表；json，将字符串json.loads
        """
        func_ctrl = FunctionController.objects.filter(func_code=func_code).first()
        if func_ctrl:
            if data_type == 'list':
                return func_ctrl.switch_status, re.findall(r'[^,;]+', func_ctrl.wlist or '')
            elif data_type == 'json':
                return func_ctrl.switch_status, json.loads(func_ctrl.wlist)
            else:
                return func_ctrl.switch_status, func_ctrl.wlist
        else:
            return None, None

    @classmethod
    def is_skip_user_auth(cls, app_code):
        """判定APP是否可跳过用户认证，如果功能开放，且APP在白名单内，则可跳过"""
        switch_status, wlist = FunctionControllerClient._get_func_ctrl_by_code('user_auth::skip_user_auth')
        if switch_status and app_code in wlist:
            return True
        else:
            return False
