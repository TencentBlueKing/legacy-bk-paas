# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
from common.forms import BaseComponentForm, ListField
from common.constants import API_TYPE_Q
from components.component import Component
from .toolkit import tools, configs


class GetProcessPortByIp(Component):
    """[CC] 根据主机查询进程端口接口

    {% block api_doc %}

    描述
    ~~~~

    根据主机查询进程端口接口

    参数说明
    ~~~~~~~~

    {{ common_args_desc }}

    其他参数

    ===============  ======  ========  ================================================================
    参数名称         必须    类型      参数说明
    ===============  ======  ========  ================================================================
    ips              Y       string    IP地址，多个以逗号分隔
    ===============  ======  ========  ================================================================

    请求参数示例
    ~~~~~~~~~~~~

    .. code:: json

        {
            "ips": "10.0.0.1"
        }

    结果说明
    ~~~~~~~~

    .. code:: json

        {
            "result": true,
            "code": "00",
            "message": "",
            "data": [
                {
                    "InnerIP": "10.0.0.1",
                    "OuterIP": "",
                    "ApplicationID": "1",
                    "Source": "1",
                    "ApplicationName": "资源池",
                    "Process": []
                },
                {
                    "InnerIP": "10.0.0.1",
                    "OuterIP": "",
                    "ApplicationID": "2",
                    "Source": "1",
                    "ApplicationName": "数据平台测试",
                    "Process": []
                }
            ]
        }

    {% endblock %}
    """
    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    host = configs.host

    class Form(BaseComponentForm):
        ips = ListField(label='ip list', required=True)

        def clean(self):
            data = self.cleaned_data
            return {
                'ips': ','.join(data['ips'])
            }

    def handle(self):
        client = tools.CCClient(self)
        self.response.payload = client.post_request(
            self.host,
            '/api/process/getProcessPortByIP',
            data=self.form_data,
        )
