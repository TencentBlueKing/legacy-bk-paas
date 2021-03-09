# -*- coding: utf-8 -*-
from common.forms import BaseComponentForm, ListField
from common.constants import API_TYPE_Q
from components.component import Component
from .toolkit import configs


class GetAppInfo(Component):
    """
    apiLabel {{ _("获取应用信息") }}
    apiMethod GET

    ### {{ _("功能描述") }}

    {{ _("获取应用信息") }}

    ### {{ _("请求参数") }}

    {{ common_args_desc }}

    #### {{ _("接口参数") }}

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | target_app_code |  string    | {{ _("否") }}     | {{ _("目标蓝鲸应用ID，多个以英文逗号分隔，为空则表示所有应用") }} |

    ### {{ _("请求参数示例") }}

    ```python
    {
        "app_code": "esb_test",
        "app_secret": "xxx",
        "bk_token": "xxx",
        "target_app_code": "bk_test,esb_test",
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
                "app_code": "bk_test",
                "app_name": "BKTest"
            },
            {
                "app_code": "esb_test",
                "app_name": "ESBTest"
            }
        ]
    }
    ```
    """

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    class Form(BaseComponentForm):
        target_app_code = ListField(label="target app_code", required=False)

        def clean(self):
            return {"target_app_code": ";".join(self.cleaned_data["target_app_code"])}

    def handle(self):
        self.response.payload = self.outgoing.http_client.get(
            configs.host,
            "/paas/api/app_info/",
            params=self.form_data,
            headers=configs.headers,
        )
