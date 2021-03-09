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

from components.component import Component
from common.forms import BaseComponentForm, TypeCheckField, ListField
from common.constants import API_TYPE_OP

from .toolkit import tools, configs


class GsePushFile(Component):
    """
    apiLabel {{ _("文件内容推送") }}
    apiMethod POST

    ### {{ _("功能描述") }}

    {{ _("文件内容推送") }}

    ### {{ _("请求参数") }}

    {{ common_args_desc }}

    #### {{ _("接口参数") }}

    | {{ _("字段") }}        |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-------------|------------|--------|------------|
    | app_id      |  int       | {{ _("是") }}     | {{ _("业务ID") }} |
    | file_list   |  array     | {{ _("是") }}     | {{ _("文件列表") }} |
    | target_path |  string    | {{ _("是") }}     | {{ _("文件目标路径") }} |
    | ip_list     |  array     | {{ _("否") }}     | {{ _("目标机器") }} |
    | group_ids   |  string    | {{ _("否") }}     | {{ _("蓝鲸配置平台动态分组ID，多个之间逗号分隔，和ip_list至少一个必选，如果两个同时存在，则以group_ids为准") }} |
    | account     |  string    | {{ _("是") }}     | {{ _("目标机器账户名") }} |

    #### file_list

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | file_name |  string    | {{ _("是") }}     | {{ _("文件名") }} |
    | content   |  string    | {{ _("是") }}     | {{ _("文件内容，文件内容为空，则放弃执行该文件，base64编码后的内容") }} |

    #### ip_list

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | ip        |  string    | {{ _("是") }}     | {{ _("IP地址") }} |
    | source    |  string    | {{ _("是") }}     | {{ _("子网ID") }} |

    ### {{ _("请求参数示例") }}

    ```python
    {
        "app_code": "esb_test",
        "app_secret": "xxx",
        "bk_token": "xxx",
        "app_id": 1,
        "file_list": [
            {
                "file_name": "a.txt",
                "content": "aGVsbG8gd29ybGQh",
            },
            {
                "file_name": "b.txt",
                "content": "aGVsbG8gd29ybGQh",
            },
        ],
        "target_path": "/tmp/1/",
        "ip_list": [
            {
                "ip": "10.0.0.1",
                "source": 1
            }
        ],
        "account": "root",
    }
    ```

    ### {{ _("返回结果示例") }}

    ```python
    {
        "result": true,
        "code": "00",
        "message": "",
        "data": {
            "taskInstanceName": "Test",
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
        file_list = TypeCheckField(label="file list", promise_type=list, required=True)
        target_path = forms.CharField(label="target file path", required=True)
        ip_list = TypeCheckField(label="target ip list", promise_type=list, required=False)
        group_ids = ListField(label="group IDs", required=False)
        account = forms.CharField(label="account name", required=True)

        def clean(self):
            data = self.cleaned_data
            new_data = {
                "appId": data["app_id"],
                "fileList": [GsePushFile.FileForm(f).get_cleaned_data_or_error() for f in data["file_list"]],
                "targetPath": data["target_path"],
                "account": data["account"],
            }
            if data["ip_list"]:
                new_data["ipList"] = [GsePushFile.IPForm(ip).get_cleaned_data_or_error() for ip in data["ip_list"]]
            elif data["group_ids"]:
                new_data["groupIds"] = ",".join(data["group_ids"])
            else:
                raise forms.ValidationError(
                    "At least one of target ip list [ip_list] and group IDs [group_ids] does exist"
                )
            return new_data

    class FileForm(BaseComponentForm):
        file_name = forms.CharField(label="file name", required=True)
        content = forms.CharField(label="file content", required=True)

        def clean(self):
            data = self.cleaned_data
            return {"fileName": data["file_name"], "content": data["content"]}

    class IPForm(BaseComponentForm):
        ip = forms.CharField(label="ip address", required=True)
        source = forms.IntegerField(label="subnet ID", required=True)

    def handle(self):
        data = self.form_data
        data["starter"] = self.current_user.username

        client = tools.JOBClient(self.outgoing.http_client)
        params = tools.get_basic_json("gsePushFile", params=data)
        result = client.post(self.host, data=params)

        self.response.payload = result
