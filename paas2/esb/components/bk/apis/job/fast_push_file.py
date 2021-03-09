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

from django import forms

from common.forms import BaseComponentForm, TypeCheckField
from components.component import Component
from common.constants import API_TYPE_OP

from .toolkit import tools, configs


class FastPushFile(Component):
    """
    apiLabel {{ _("快速分发文件") }}
    apiMethod POST

    ### {{ _("功能描述") }}

    {{ _("快速分发文件") }}

    ### {{ _("请求参数") }}

    {{ common_args_desc }}

    #### {{ _("接口参数") }}

    | {{ _("字段") }}             |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |------------------|------------|--------|------------|
    | app_id           |  int       | {{ _("是") }}     | {{ _("业务ID") }} |
    | file_source      |  array     | {{ _("是") }}     | {{ _("源文件信息，包含内容见下面参数描述") }} |
    | file_target_path |  string    | {{ _("是") }}     | {{ _("目标路径") }} |
    | ip_list          |  array     | {{ _("是") }}     | {{ _("目标机器，包含内容见下面参数描述") }} |
    | target_app_id    |  int       | {{ _("否") }}     | {{ _("目标机器所属业务，全业务需要") }} |
    | account          |  string    | {{ _("是") }}     | {{ _("目标机器账户名") }} |

    #### file_source

    | {{ _("字段") }}          |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |---------------|------------|--------|------------|
    | source_app_id |  int       | {{ _("否") }}     | {{ _("源机器所属业务，全业务需要") }} |
    | file          |  string    | {{ _("是") }}     | {{ _("源文件路径") }} |
    | ip_list       |  array     | {{ _("是") }}     | {{ _("IP信息，其中包含ip（源文件服务器IP）和source（IP的子网ID）") }} |
    | account       |  string    | {{ _("是") }}     | {{ _("源文件服务器账户名") }} |

    #### ip_list

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | ip        |  string    | {{ _("是") }}     | {{ _("IP地址") }} |
    | source    |  int       | {{ _("是") }}     | {{ _("子网ID") }} |

    ### {{ _("请求参数示例") }}

    ```python
    {
        "app_code": "esb_test",
        "app_secret": "xxx",
        "bk_token": "xxx",
        "app_id": "1",
        "file_source": [
            {
                "account": "root",
                "ip_list": [
                    {
                        "ip": "10.0.0.1",
                        "source": 1
                    }
                ],
                "file": "/tmp/tmp.txt"
            }
        ],
        "account": "root",
        "file_target_path": "/tmp",
        "ip_list": [
            {
                "ip": "10.0.0.2",
                "source": 1
            }
        ],
    }
    ```

    ### {{ _("返回结果示例") }}

    ```python
    {
        "result": true,
        "code": "00",
        "message": "",
        "data": {
            "taskInstanceName": "APIXXXX1456316951760",
            "taskInstanceId": 10000
        }
    }
    ```
    """  # noqa

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    host = configs.host

    class Form(BaseComponentForm):
        app_id = forms.IntegerField(label="business ID", required=True)
        file_source = TypeCheckField(label="source file information", promise_type=list, required=True)
        file_target_path = forms.CharField(label="target file path", required=True)
        target_app_id = forms.IntegerField(label="target business ID", required=False)
        ip_list = TypeCheckField(label="target hosts", promise_type=list, required=True)
        account = forms.CharField(label="account name", required=True)

        def clean(self):
            data = self.cleaned_data
            file_source = [FastPushFile.FileSourceForm(f_s).get_cleaned_data_or_error() for f_s in data["file_source"]]
            ip_list = [FastPushFile.HostForm(ip).get_cleaned_data_or_error() for ip in data["ip_list"]]
            params = {
                "applicationId": data["app_id"],
                "fileSource": file_source,
                "fileTargetPath": data["file_target_path"],
                "account": data["account"],
                "ipList": ip_list,
            }
            if data["target_app_id"] is not None:
                params.update(targetAppId=data["target_app_id"])
            return params

    class FileSourceForm(BaseComponentForm):
        source_app_id = forms.IntegerField(label=u"源机器所属业务", required=False)
        file = forms.CharField(label=u"源文件路径", required=True)
        ip_list = TypeCheckField(label=u"源文件机器", promise_type=list, required=True)
        account = forms.CharField(label=u"源文件机器账户名", required=True)

        def clean(self):
            data = self.cleaned_data
            ip_list = [FastPushFile.HostForm(ip).get_cleaned_data_or_error() for ip in data["ip_list"]]
            params = {
                "file": data["file"],
                "account": data["account"],
                "ipList": ip_list,
            }
            if data["source_app_id"] is not None:
                params.update(sourceAppId=data["source_app_id"])
            return params

    class HostForm(BaseComponentForm):
        ip = forms.CharField(label=u"IP地址", required=True)
        source = forms.IntegerField(label=u"子网ID", required=True)

        def clean(self):
            data = self.cleaned_data
            return {
                "ip": data["ip"],
                "source": data["source"],
            }

    def handle(self):
        data = self.form_data
        data["starter"] = self.current_user.username

        client = tools.JOBClient(self.outgoing.http_client)
        params = tools.get_basic_json("fastPushFile", params=data)
        result = client.post(self.host, data=params)

        self.response.payload = result
