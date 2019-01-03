# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

from __future__ import unicode_literals

from app.models import App


def validate_app_name(name, old_name):
    """
    校验app名称
    """
    if len(name) > 20:
        return False, "应用名称长度不能超过20个字符"

    if old_name:
        exists = App.objects.filter(name=name).exclude(name=old_name).exists()
    else:
        exists = App.objects.filter(name=name).exists()

    if exists:
        return False, "应用名称[{}]已存在".format(name)
    return True, "校验通过"
