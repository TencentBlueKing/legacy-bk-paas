# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
import json

from django import forms

from components.component import Component
from common.forms import BaseComponentForm
from common.constants import API_TYPE_OP

from .toolkit import tools, configs


class ModifyAppLogo(Component):
    """
    apiLabel {{ _("修改轻应用 logo") }}
    apiMethod POST

    ### {{ _("功能描述") }}

    {{ _("修改轻应用 logo") }}

    ### {{ _("请求参数") }}

    {{ common_args_desc }}

    #### {{ _("接口参数") }}

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | bk_light_app_code |  string  | {{ _("是") }}     | {{ _("轻应用的 ID") }} |
    | logo              |  string  | {{ _("是") }}     | {{ _("png 格式图片文件的 Base64 编码字符串") }} |

    ### {{ _("请求参数示例") }}

    ```python
    {
        "bk_app_code": "gcloud",
        "bk_app_secret": "xxx",
        "bk_token": "xxx",
        "bk_light_app_code": "gcloud_fdfh2kl0k",
        "logo": "iVBORw0KGgoA......AAABJRU5ErkJggg=="
    }
    ```

    ### {{ _("返回结果示例") }}

    ```python
    {
        "result": true,
        "code": 0,
        "message": "",
        "data": {}
    }
    ```
    """  # noqa

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    host = configs.host

    class Form(BaseComponentForm):
        bk_light_app_code = forms.CharField(label='bk light app code', required=True)
        logo = forms.CharField(label='logo', required=True)

    def handle(self):
        self.form_data['operator'] = self.current_user.username

        client = tools.PAASClient(self.outgoing.http_client)
        self.response.payload = client.post(
            host=self.host,
            path='/paas/api/v2/modify_app_logo/',
            data=json.dumps(self.form_data)
        )
