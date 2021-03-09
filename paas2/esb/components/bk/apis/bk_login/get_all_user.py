# -*- coding: utf-8 -*-
from django import forms

from common.forms import BaseComponentForm
from common.constants import API_TYPE_Q
from components.component import Component
from .toolkit import configs, tools


class GetAllUser(Component):
    """
    apiLabel {{ _("获取所有用户信息") }}
    apiMethod GET

    ### {{ _("功能描述") }}

    {{ _("获取所有用户信息") }}

    ### {{ _("请求参数") }}

    {{ common_args_desc }}

    #### {{ _("接口参数") }}

    | {{ _("字段") }} | {{ _("类型") }} | {{ _("必选") }} |  {{ _("描述") }}    |
    |-----------------|-----------------|-----------------|---------------------|
    | role            |  string         | {{ _("否") }}   | {{ _("用户角色，0：普通用户，1：超级管理员，2：开发者，3：职能化用户，4：审计员") }} |

    ### {{ _("请求参数示例") }}

    ```python
    {
        "app_code": "esb_test",
        "app_secret": "xxx",
        "bk_token": "xxx",
    }
    ```

    ### {{ _("返回结果示例") }}

    ```python
    {
        "result": true,
        "code": "00",
        "message": "OK",
        "data": [
            {
                "username": "admin",
                "qq": "12345",
                "phone": "12345678911",
                "role": "1",
                "email": "11@qq.com",
                "chname": "admin"
            },
        ]
    }
    ```
    """

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    class Form(BaseComponentForm):
        role = forms.CharField(label="user role", required=False)

        def clean(self):
            return self.get_cleaned_data_when_exist(keys={"role": "bk_role"})

    def handle(self):
        result = self.invoke_other("generic.v2.usermanage.get_all_users", kwargs=self.form_data)
        result["code"] = "00" if result["code"] == 0 else str(result["code"])
        result["data"] = map(tools.convert_user_info, result["data"] or [])
        self.response.payload = result
