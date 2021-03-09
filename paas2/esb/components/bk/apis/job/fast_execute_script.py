# -*- coding: utf-8 -*-
from django import forms

from common.forms import BaseComponentForm, TypeCheckField
from components.component import Component
from common.constants import API_TYPE_OP

from .toolkit import tools, configs


class FastExecuteScript(Component):
    """
    apiLabel {{ _("快速执行脚本") }}
    apiMethod POST

    ### {{ _("功能描述") }}

    {{ _("快速执行脚本") }}

    ### {{ _("请求参数") }}

    {{ common_args_desc }}

    #### {{ _("接口参数") }}

    | {{ _("字段") }}          |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |---------------|------------|--------|------------|
    | app_id        |  int       | {{ _("是") }}     | {{ _("业务ID") }} |
    | content       |  string    | {{ _("是") }}     | {{ _("执行脚本步骤的脚本内容，base64编码后的内容") }} |
    | script_timeout|  int       | {{ _("否") }}     | {{ _("脚本执行超时时间，范围60~72000，默认1000，单位为秒") }} |
    | script_param  |  string    | {{ _("否") }}     | {{ _("脚本执行参数") }} |
    | type          |  int       | {{ _("是") }}     | {{ _("脚本类型：1(shell脚本)、2(bat脚本)、3(perl脚本)、4(python脚本)、5(Powershell脚本)") }} |
    | ip_list       |  array     | {{ _("是") }}     | {{ _("目标机器，包含内容见下面描述") }} |
    | account       |  string    | {{ _("是") }}     | {{ _("目标机器账户名") }} |
    | is_param_sensitive |  int  | {{ _("是") }}     | {{ _("是否敏感参数: 1是, 0不是(默认为0)") }} |

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
        "app_id": 1,
        "content": "xxx",
        "ip_list": [
            {
                "ip": "10.0.0.1",
                "source": 1
            }
        ],
        "type": 1,
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
            "taskInstanceName": "APIXXXX1456715609220",
            "taskInstanceId": 10000
        },
    }
    ```
    """  # noqa

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    host = configs.host

    class Form(BaseComponentForm):
        app_id = forms.IntegerField(label="business ID", required=True)
        content = forms.CharField(label="script content", required=True)
        script_timeout = forms.IntegerField(label="script execution timeout", required=False)
        script_param = forms.CharField(label="script execution parameters", required=False)
        type = forms.IntegerField(label="script type", required=True)
        ip_list = TypeCheckField(label="target hosts", promise_type=list, required=True)
        account = forms.CharField(label="account name", required=True)
        is_param_sensitive = forms.IntegerField(label="a sensitive parameter or not", required=False)

        def clean(self):
            data = self.cleaned_data
            ip_list = [FastExecuteScript.HostForm(ip).get_cleaned_data_or_error() for ip in data["ip_list"]]
            params = {
                "applicationId": data["app_id"],
                "content": data["content"],
                "scriptTimeout": 1000 if data["script_timeout"] is None else data["script_timeout"],
                "scriptParam": data["script_param"],
                "type": data["type"],
                "account": data["account"],
                "ipList": ip_list,
            }
            if data["is_param_sensitive"] is not None:
                params["isParamSensitive"] = data["is_param_sensitive"]
            return params

    class HostForm(BaseComponentForm):
        ip = forms.CharField(label="IP address", required=True)
        source = forms.IntegerField(label="subnet ID", required=True)

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
        params = tools.get_basic_json("fastExecuteScript", params=data)
        result = client.post(self.host, data=params)

        self.response.payload = result
