# -*- coding: utf-8 -*-
from django import forms

from common.forms import BaseComponentForm
from common.constants import API_TYPE_Q
from components.component import Component
from .toolkit import configs


class IsLogin(Component):
    """
    apiLabel {{ _("验证用户登录态") }}
    apiMethod GET

    ### {{ _("功能描述") }}

    {{ _("验证用户登录态") }}

    ### {{ _("请求参数") }}

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | app_code  |  string    | {{ _("是") }}     | {{ _("应用ID") }}     |
    | app_secret|  string    | {{ _("是") }}     | {{ _("应用TOKEN，可以通过 蓝鲸智云开发者中心 -> 点击应用ID -> 基本信息 获取") }} |
    | bk_token  |  string    | {{ _("是") }}     | {{ _("当前用户登录态，bk_token与username必须一个有效，bk_token可以通过Cookie获取") }} |

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
        "data": {
            "username": "admin"
        }
    }
    ```
    """

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    class Form(BaseComponentForm):
        bk_token = forms.CharField(label="login token", required=True)

    def handle(self):
        self.response.payload = self.outgoing.http_client.get(
            configs.host,
            "/login/accounts/is_login/",
            params=self.form_data,
            headers=configs.headers,
        )
