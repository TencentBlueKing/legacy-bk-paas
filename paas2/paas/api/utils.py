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

import json
from api.constants import ApiErrorCodeEnumV2


def InnerFeedback(data=None, result=True, code="00", message=""):  # noqa
    """
    内部接口之间交互的方式
    这里其实没做什么，只是规范了一下格式而已
    try catch 放在内部检查并给出详细的信息
    @param data: 接口真正返回的数据
    @param result: 是否成功
    @param code:
    @param message:
    @return:
    """
    _type_name = type(data).__name__
    if _type_name == "ValuesQuerySet":
        data = list(data)
    return {
        "data": data,
        "result": result,
        "code": code,
        "message": message,
    }


class InnerFeedBackClassV2(object):
    def __init__(self, data={}, code=0, message=""):
        _type_name = type(data).__name__
        if _type_name == "ValuesQuerySet":
            self.data = list(data)
        else:
            self.data = data
        self.code = code
        self.message = message

    def get_json(self):
        return {
            "bk_error_msg": self.message,
            "bk_error_code": self.code,
            "data": self.data,
            "result": self.code == ApiErrorCodeEnumV2.SUCCESS,
        }

    def __setitem__(self, key, value):
        self.__dict__[key] = value


def get_post_data(request):
    try:
        post_data = json.loads(request.body)
        return post_data
    except Exception:
        return {}
