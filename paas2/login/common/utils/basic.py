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

from past.builtins import basestring
from django.utils.html import escape as html_escape


def escape_html_return_msg(func):
    """
    装饰器：用于验证信息返回xss转义
    """

    def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)
        # 对于字符串类型，进行html转义
        return [html_escape(item) if isinstance(item, basestring) else item for item in result]

    return wrapper
