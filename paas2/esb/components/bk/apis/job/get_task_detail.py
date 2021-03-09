# -*- coding: utf-8 -*-
from django import forms

from common.forms import BaseComponentForm
from components.component import Component
from common.constants import API_TYPE_Q

from .toolkit import tools, configs


class GetTaskDetail(Component):
    """
    apiLabel {{ _("查询作业模板详情") }}
    apiMethod GET

    ### {{ _("功能描述") }}

    {{ _("查询作业模板详情") }}

    ### {{ _("请求参数") }}

    {{ common_args_desc }}

    #### {{ _("接口参数") }}

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | app_id    |  int       | {{ _("是") }}     | {{ _("业务ID") }} |
    | task_id   |  int       | {{ _("是") }}     | {{ _("作业模板ID") }} |

    ### {{ _("请求参数示例") }}

    ```python
    {
        "app_code": "esb_test",
        "app_secret": "xxx",
        "bk_token": "xxx",
        "app_id": 1,
        "task_id": 1
    }
    ```

    ### {{ _("返回结果示例") }}

    ```python
    {
        "result": true,
        "code": "00",
        "message": "",
        "data": {
            "account": "",
            "name": "demo",
            "creater": "12345",
            "stepNum": 0,
            "serverSetId": 0,
            "nmStepBeanList": [
                {
                    "ccScriptName": "",
                    "text": "",
                    "serverSetId": 0,
                    "stepId": 1,
                    "ipList": "1:10.0.0.1",
                    "serverSetName": "",
                    "ccScriptId": 0,
                    "fileSpeedLimit": 0,
                    "scriptTimeout": 1000,
                    "scriptParam": "",
                    "scriptContent": "xxx",
                    "lastModifyTime": "",
                    "fileSource": "",
                    "type": 1,
                    "scriptType": 4,
                    "lastModifyUser": "",
                    "blockName": "step1",
                    "paramType": 1,
                    "fileTargetPath": "",
                    "scriptId": 1,
                    "taskId": 1,
                    "appId": 46,
                    "isPause": 0,
                    "ord": 1,
                    "createTime": "2016-02-24 21:50:31",
                    "account": "root",
                    "name": "step1",
                    "companyId": 1,
                    "creater": "12345",
                    "ccScriptParam": "",
                    "blockOrd": 1
                },
            ],
            "lastModifyTime": "2016-02-26 16:15:43",
            "appId": 1,
            "id": 195,
            "ipList": "",
            "createTime": "2016-02-24 21:50:31",
            "lastModifyUser": "12345",
            "globalVarList":[
                {
                    "id": 11,
                    "type": 1,
                    "name": "varA1",
                    "defaultValue": "valueisMe",
                    "appId": 1,
                    "taskId": 13,
                    "description": "xxx",
                    "stepIds": "1",
                    "ipListStatus": [],
                    "ccGroupInfoList": []
                },
                {
                    "id": 12,
                    "type": 2,
                    "name": "id-201782815057397",
                    "ipList": "1:10.0.0.1,1:10.0.0.2",
                    "serverSetId": "",
                    "ccServerSetId": "",
                    "appId": 3,
                    "taskId": 13,
                    "description": "xxx",
                    "stepIds": "13",
                    "ipListStatus": [
                        {
                            "ip": "10.0.0.1",
                            "source": 1,
                            "alived": 0,
                            "valid": 1,
                            "name": "host",
                            "displayIp": "10.0.0.1"
                        },
                        {
                            "ip": "10.0.0.2",
                            "source": 1,
                            "alived": 0,
                            "valid": 1,
                            "name": "host",
                            "displayIp": "10.0.0.2"
                        }
                    ],
                    "ccGroupInfoList": []
                }
            ]
        },
    }
    ```
    """

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    host = configs.host

    class Form(BaseComponentForm):
        app_id = forms.IntegerField(label="business ID", required=True)
        task_id = forms.IntegerField(label="task template ID", required=True)

        def clean(self):
            data = self.cleaned_data
            return {
                "appId": data["app_id"],
                "taskId": data["task_id"],
            }

    def handle(self):
        data = self.form_data
        data["operator"] = self.current_user.username

        client = tools.JOBClient(self.outgoing.http_client)
        data = tools.get_basic_json(action="queryTaskDetail", params=data)
        result = client.post(self.host, data=data)

        self.response.payload = result
