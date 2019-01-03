# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
from django import forms

from common.forms import BaseComponentForm
from common.constants import API_TYPE_Q
from components.component import Component
from .toolkit import configs, tools


class GetUser(Component):
    """
    apiLabel {{ _("获取用户信息") }}
    apiMethod GET

    ### {{ _("功能描述") }}

    {{ _("获取用户信息") }}

    ### {{ _("请求参数") }}

    {{ common_args_desc }}

    ### {{ _("请求参数示例") }}

    ```python
    {
        "bk_app_code": "esb_test",
        "bk_app_secret": "xxx",
        "bk_token": "xxx",
    }
    ```
    ### {{ _("返回结果示例") }}

    ```python
    {
        "result": true,
        "code": 0,
        "message": "OK",
        "data": {
            "bk_username": "admin",
            "qq": "12345",
            "bk_role": 1,
            "language": "zh-cn",
            "phone": "12345678911",
            "wx_userid": "",
            "email": "11@qq.com",
            "chname": "admin",
            "time_zone": "Asia/Shanghai"
        }
    }
    ```

    ### {{ _("返回结果参数说明") }}

    #### data

    | {{ _("字段") }}      | {{ _("类型") }}      | {{ _("描述") }}      |
    |-----------|-----------|-----------|
    | bk_username    | string    | {{ _("用户名") }} |
    | qq             | string    | {{ _("用户QQ") }} |
    | language       | string    | {{ _("语言") }} |
    | phone          | string    | {{ _("手机号") }} |
    | wx_userid      | string    | {{ _("企业号用户USERID/公众号用户OPENID") }} |
    | email          | string    | {{ _("邮箱") }} |
    | chname         | string    | {{ _("中文名") }} |
    | time_zone      | string    | {{ _("时区") }} |
    """
    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    class Form(BaseComponentForm):
        bk_token = forms.CharField(label='login token', required=False)
        bk_username = forms.CharField(label='username', required=False)

    def handle(self):
        client = tools.LOGINClient(self.outgoing.http_client)
        self.response.payload = client.get(
            host=configs.host,
            path='/login/api/v2/get_user/',
            params=self.form_data,
        )
