# -*- coding: utf-8 -*-
from django import forms

from common.forms import BaseComponentForm
from components.component import Component
from common.constants import API_TYPE_Q

from .toolkit import tools, configs


class GetTask(Component):
    """
    apiLabel {{ _("查询作业模板") }}
    apiMethod GET

    ### {{ _("功能描述") }}

    {{ _("查询作业模板") }}

    ### {{ _("请求参数") }}

    {{ common_args_desc }}

    #### {{ _("接口参数") }}

    | {{ _("字段") }}                 |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |----------------------|------------|--------|------------|
    | app_id               |  int       | {{ _("是") }}     | {{ _("业务ID") }} |
    | name                 |  string    | {{ _("否") }}     | {{ _("作业名称") }} |
    | creater              |  string    | {{ _("否") }}     | {{ _("作业创建人") }} |
    | last_modify_user     |  string    | {{ _("否") }}     | {{ _("最后修改人") }} |
    | create_time_start    |  string    | {{ _("否") }}     | {{ _("创建起始时间，YYYY-MM-DD格式") }} |
    | create_time_end      |  string    | {{ _("否") }}     | {{ _("创建结束时间，YYYY-MM-DD格式") }} |
    | last_modify_time_start |  string  | {{ _("否") }}     | {{ _("最后修改起始时间，YYYY-MM-DD格式") }} |
    | last_modify_time_end |  string    | {{ _("否") }}     | {{ _("最后修改结束时间，YYYY-MM-DD格式") }} |

    ### {{ _("请求参数示例") }}

    ```python
    {
        "app_code": "esb_test",
        "app_secret": "xxx",
        "bk_token": "xxx",
        "app_id": 46,
        "name": "hotest",
        "creater": "12345",
        "last_modify_user": "12345",
        "create_time_start": "2016-02-22 23:12:34",
        "create_time_end": "2016-02-22 23:12:34",
        "last_modify_time_start": "2016-02-22 23:12:34",
        "last_modify_time_end": "2016-02-22 23:12:34"
    }
    ```

    ### {{ _("返回结果示例") }}

    ```python
    {
        "result": true,
        "code": "00",
        "message": "",
        "data": [
            {
                "account": "",
                "name": "hotest",
                "creater": "12345",
                "stepNum": 1,
                "serverSetId": 0,
                "nmStepBeanList": [],
                "lastModifyTime": "2016-02-22 23:12:34",
                "appId": 46,
                "id": 190,
                "ipList": "",
                "createTime": "2016-02-22 23:12:34",
                "lastModifyUser": "12345"
            },
        ],
    }
    ```
    """

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    host = configs.host

    class Form(BaseComponentForm):
        app_id = forms.IntegerField(label="business ID", required=True)
        name = forms.CharField(label="task name", required=False)
        creater = forms.CharField(label="creater", required=False)
        last_modify_user = forms.CharField(label="last modifier", required=False)
        create_time_start = forms.DateField(label="creation start time", required=False, input_formats=["%Y-%m-%d"])
        create_time_end = forms.DateField(label="creation end time", required=False, input_formats=["%Y-%m-%d"])
        last_modify_time_start = forms.DateField(
            label="last modification start time", required=False, input_formats=["%Y-%m-%d"]
        )
        last_modify_time_end = forms.DateField(
            label="last modification end time", required=False, input_formats=["%Y-%m-%d"]
        )

        def clean(self):
            data = self.cleaned_data
            return {
                "appId": data["app_id"],
                "name": data["name"],
                "creater": data["creater"],
                "lastModifyUser": data["last_modify_user"],
                "createTimeStart": data["create_time_start"].strftime("%Y-%m-%d") if data["create_time_start"] else "",
                "createTimeEnd": data["create_time_end"].strftime("%Y-%m-%d") if data["create_time_end"] else "",
                "lastModifyTimeStart": (
                    data["last_modify_time_start"].strftime("%Y-%m-%d") if data["last_modify_time_start"] else ""
                ),
                "lastModifyTimeEnd": (
                    data["last_modify_time_end"].strftime("%Y-%m-%d") if data["last_modify_time_end"] else ""
                ),
            }

    def handle(self):
        data = self.form_data
        data["operator"] = self.current_user.username

        client = tools.JOBClient(self.outgoing.http_client)
        data = tools.get_basic_json(action="queryTask", params=data)
        result = client.post(self.host, data=data)

        self.response.payload = result
