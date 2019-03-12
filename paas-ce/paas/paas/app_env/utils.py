# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

from __future__ import unicode_literals

import re


def _validate_env_var_name(name):
    if not name:
        return False, "变量名不能为空!"

    if not name.startswith("BKAPP_"):
        return False, "变量名必须以BKAPP_开头"

    check_result = re.match(r'^[a-zA-Z0-9_]+$', name)
    if not check_result or len(name) > 50:
        return False, "请输入合法的变量名, 只允许字母数字下划线!"

    return True, None


def _validate_env_var_value(value):
    if not value:
        return False, "变量值不能为空!"
    if len(value) > 1000:
        return False, "变量值不能超过1000个字符!"

    if '"' in value:
        return False, "变量值不能包含引号!"
    return True, None


def validate_env_var(name, value):
    is_valid, message = _validate_env_var_name(name)
    if not is_valid:
        return False, message
    is_valid, message = _validate_env_var_value(value)
    if not is_valid:
        return False, message

    return True, 'valid'
