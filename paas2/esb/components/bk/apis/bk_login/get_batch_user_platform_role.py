# -*- coding: utf-8 -*-
import json
from django import forms

from common.forms import BaseComponentForm, ListField
from common.constants import API_TYPE_Q
from components.component import Component
from .toolkit import configs


class GetBatchUserPlatformRole(Component):
    """
    apiLabel {{ _("获取多个用户在平台应用的角色") }}
    apiMethod GET

    ### {{ _("功能描述") }}

    {{ _("获取多个用户在平台应用的角色") }}

    ### {{ _("请求参数") }}

    {{ common_args_desc }}

    #### {{ _("接口参数") }}

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | username_list |  string    | {{ _("是") }}     | {{ _("待获取信息的用户名列表") }}  |

    ### {{ _("请求参数示例") }}

    ```python
    {
        "app_code": "esb_test",
        "app_secret": "xxx",
        "bk_token": "xxx",
        "username_list": "admin;test"
    }
    ```

    ### {{ _("返回结果示例") }}

    ```python
    {
        "result": true,
        "code": "00",
        "message": "OK",
        "data": {
            "admin": {
                "bkdata": [1],
                "job": [1],
                "cmdb": [1, 2],
            }
        }
    }
    ```

    ### {{ _("返回结果参数说明") }}

    | {{ _("字段") }}      | {{ _("类型") }}      | {{ _("描述") }}      |
    |-----------|-----------|-----------|
    | data      | object    | {{ _("返回数据，成功返回请求数据") }} |

    #### data

    | {{ _("字段") }}      | {{ _("类型") }}      | {{ _("描述") }}      |
    |-----------|-----------|-----------|
    | [user].[app].role  | list  | {{ _("用户角色，0：普通用户，1：超级管理员，2：开发者，3：职能化用户，4：审计员") }} |
    """

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    class Form(BaseComponentForm):
        bk_token = forms.CharField(label="login token", required=False)
        username_list = ListField(label="username list", required=True)

    def handle(self):
        self.response.payload = self.outgoing.http_client.post(
            configs.host,
            "/login/accounts/get_batch_user_platform_role/",
            data=json.dumps(self.form_data),
            headers=configs.headers,
        )
