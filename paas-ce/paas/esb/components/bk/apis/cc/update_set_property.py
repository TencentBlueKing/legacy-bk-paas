# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
from django import forms

from common.forms import BaseComponentForm, TypeCheckField
from common.constants import API_TYPE_OP
from components.component import Component

from .toolkit import tools, configs


class UpdateSetProperty(Component):
    """
    apiLabel {{ _("更新集群属性") }}
    apiMethod POST

    ### {{ _("功能描述") }}

    {{ _("更新集群属性") }}

    ### {{ _("请求参数") }}

    {{ common_args_desc }}

    #### {{ _("接口参数") }}

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | app_id    |  int       | {{ _("是") }}     | {{ _("业务ID") }} |
    | set_ids   |  array     | {{ _("是") }}     | {{ _("集群ID") }} |
    | set_name  |  string    | {{ _("否") }}     | {{ _("集群名称") }} |
    | chn_name  |  string    | {{ _("否") }}     | {{ _("中文名称") }} |
    | group_flag |  string    | {{ _("否") }}     | {{ _("分组标识") }} |
    | env_type  |  int       | {{ _("否") }}     | {{ _("环境类型，包含1：测试 2：体验 3：正式，默认为3") }} |
    | service_status| int      | {{ _("否") }}     | {{ _("服务状态，包含0：关闭，1：开启，默认为1") }} |
    | capacity | int | {{ _("否") }} | {{ _("设计容量") }} |
    | des | string | {{ _("否") }} | {{ _("描述") }} |

    ### {{ _("请求参数示例") }}

    ```python
    {
        "app_code": "esb_test",
        "app_secret": "xxx",
        "bk_token": "xxx",
        "app_id": 1,
        "set_ids": ["1"],
        "set_name": "test"
    }
    ```

    ### {{ _("返回结果示例") }}

    ```python
    {
        "result": true,
        "code": "00",
        "message": "",
        "data": null
    }
    ```
    """
    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    host = configs.host

    class Form(BaseComponentForm):
        app_id = forms.CharField(label='business ID', required=True)
        set_ids = TypeCheckField(label='set IDs', promise_type=list, required=True)
        set_name = forms.CharField(label='set name', required=False)
        chn_name = forms.CharField(label='chinese name', required=False)
        group_flag = forms.CharField(label='group flag', required=False)
        env_type = forms.IntegerField(label='environment type', required=False)
        service_status = forms.IntegerField(label='service status', required=False)
        capacity = forms.IntegerField(label='capacity', required=False)
        des = forms.CharField(label='description', required=False)

        def clean(self):
            data = self.cleaned_data
            ret_data = {
                'ApplicationID': data['app_id'],
                'SetID': ','.join(data['set_ids']),
                'SetName': data['set_name'],
                'ChnName': data.get('chn_name'),
                'GroupFlag': data.get('group_flag'),
                'SetEnviType': data.get('env_type'),
                'ServiceStatus': data.get('service_status'),
                'Capacity': data.get('capacity'),
                'Des': data.get('des')
            }
            return {key: val for key, val in ret_data.iteritems() if val or val == 0}

    def handle(self):
        client = tools.CCClient(self)
        self.response.payload = client.post_request(
            self.host,
            '/api/set/updateset',
            data=self.form_data,
        )
