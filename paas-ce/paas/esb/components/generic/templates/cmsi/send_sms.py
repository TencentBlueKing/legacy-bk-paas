# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
import json
import base64

from django import forms

from components.component import Component, SetupConfMixin
from common.forms import BaseComponentForm, ListField, DefaultBooleanField
from common.constants import API_TYPE_OP
from .toolkit import configs, tools


class SendSms(Component, SetupConfMixin):
    """
    apiLabel {{ _("发送短信") }}
    apiMethod POST

    ### {{ _("功能描述") }}

    {{ _("发送短信") }}

    ### {{ _("请求参数") }}

    {{ common_args_desc }}

    #### {{ _("接口参数") }}

    | {{ _("字段") }}               |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |--------------------|------------|--------|------------|
    | receiver           |  string    | {{ _("否") }}     | {{ _("短信接收者，包含接收者电话号码，多个以逗号分隔，若receiver、receiver__username同时存在，以receiver为准") }} |
    | receiver__username |  string    | {{ _("否") }}     | {{ _("短信接收者，包含用户名，用户需在蓝鲸平台注册，多个以逗号分隔，若receiver、receiver__username同时存在，以receiver为准") }} |
    | content            |  string    | {{ _("是") }}     | {{ _("短信内容") }} |
    | is_content_base64  |  bool      | {{ _("否") }}     | {{ _("消息内容是否base64编码，默认False，不编码，请使用base64.b64encode方法编码") }} |

    ### {{ _("请求参数示例") }}

    ```python
    {
        "bk_app_code": "esb_test",
        "bk_app_secret": "xxx",
        "bk_token": "xxx",
        "receiver": "1234567890",
        "receiver__username": "admin",
        "content": "Welcome to Blueking",
    }
    ```

    ### {{ _("返回结果示例") }}

    ```python
    {
        "result": true,
        "code": "00",
        "message": "OK",
    }
    ```
    """  # noqa

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP
    host = configs.host
    contact_way = 'phone'

    class Form(BaseComponentForm):
        receiver = ListField(label='SMS receiver', required=False)
        receiver__username = ListField(label='SMS receiver', required=False)
        content = forms.CharField(label='message content', required=True)
        is_content_base64 = DefaultBooleanField(
            label='content is encoded by base64 or not', default=False, required=False)

        def decode_content(self, content, is_content_base64):
            if is_content_base64:
                try:
                    content = base64.b64decode(content)
                except Exception:
                    pass
            return content

        def clean(self):
            data = self.cleaned_data
            if data['receiver']:
                data['receiver__username'] = None
            data['content'] = self.decode_content(data['content'], data['is_content_base64'])
            return data

    def handle(self):
        # QCloud 短信配置
        self.qcloud_app_id = getattr(self, 'qcloud_app_id', '') or getattr(configs, 'qcloud_app_id', '')
        self.qcloud_app_key = getattr(self, 'qcloud_app_key', '') or getattr(configs, 'qcloud_app_key', '')

        # 第三方接口地址配置
        self.dest_url = getattr(self, 'dest_url', '') or getattr(configs, 'send_sms_dest_url', '')

        data = self.request.kwargs
        if data['receiver']:
            tools.validate_receiver(data['receiver'], contact_way=self.contact_way)
        if data['receiver__username']:
            user_data = tools.get_receiver_with_username(
                receiver__username=data['receiver__username'],
                contact_way=self.contact_way
            )
            data.update(user_data)

        # TODO: can be updated
        if self.dest_url:
            result = self.outgoing.http_client.request_by_url(
                'POST',
                self.dest_url,
                data=json.dumps(data)
            )

            if result['result'] and data.get('_extra_user_error_msg'):
                result = {
                    'result': False,
                    'message': u'Some users failed to send sms. %s' % data['_extra_user_error_msg']
                }

            self.response.payload = result
        elif self.qcloud_app_id and self.qcloud_app_key:
            params = {
                'sms_type': 0,
                'phone_numbers': data['receiver'],
                'content': data['content'],
                'sdk_app_id': self.qcloud_app_id,
                'app_key': self.qcloud_app_key,
            }
            result = self.invoke_other('generic.qcloud_sms.send_multi_sms', kwargs=params)

            if result['result'] and data.get('_extra_user_error_msg'):
                result = {
                    'result': False,
                    'message': u'Some users failed to send sms. %s' % data['_extra_user_error_msg']
                }
            self.response.payload = result
        else:
            self.response.payload = {
                'result': False,
                'message': 'Unfinished interface shall be improved by the component developer'
            }
