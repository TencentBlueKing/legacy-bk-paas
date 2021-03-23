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

from builtins import str
from past.builtins import basestring
import json


from release.models import UserOperateRecord


def record_user_operate(app_code, username, operate_type, before_data="", arfter_data="", extra_data=""):
    """
    用户操作记录创建
    @param app_code: app编码
    @param username: 操作人
    @param operate_type: 操作类型
    @param before_data: 操作前数据
    @param arfter_data: 操作后数据
    @param extra_data: 其他数据
    """
    if isinstance(extra_data, dict):
        extra_data = json.dumps(extra_data)

    if not isinstance(extra_data, basestring):
        extra_data = str(extra_data)

    result = UserOperateRecord.objects.create_operate_record(
        app_code, username, operate_type, before_data, arfter_data, extra_data
    )
    return result
