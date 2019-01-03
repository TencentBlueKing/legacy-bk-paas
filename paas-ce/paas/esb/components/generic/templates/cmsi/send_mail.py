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
from common.base_utils import str_bool
from common.constants import API_TYPE_OP
from .toolkit import configs, tools, send_mail_with_smtp


class SendMail(Component, SetupConfMixin):
    """
    apiLabel {{ _("发送邮件") }}
    apiMethod POST

    ### {{ _("功能描述") }}

    {{ _("发送邮件") }}

    ### {{ _("请求参数") }}

    {{ common_args_desc }}

    #### {{ _("接口参数") }}

    | {{ _("字段") }}               |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |--------------------|------------|--------|------------|
    | receiver           |  string    | {{ _("否") }}     | {{ _("邮件接收者，包含邮件完整地址，多个以逗号分隔，若receiver、receiver__username同时存在，以receiver为准") }} |
    | receiver__username |  string    | {{ _("否") }}     | {{ _("邮件接收者，包含用户名，用户需在蓝鲸平台注册，多个以逗号分隔，若receiver、receiver__username同时存在，以receiver为准") }} |
    | sender             |  string    | {{ _("否") }}     | {{ _("发件人") }} |
    | title              |  string    | {{ _("是") }}     | {{ _("邮件主题") }} |
    | content            |  string    | {{ _("是") }}     | {{ _("邮件内容") }} |
    | cc                 |  string    | {{ _("否") }}     | {{ _("抄送人，包含邮件完整地址，多个以逗号分隔") }} |
    | cc__username       |  string    | {{ _("否") }}     | {{ _("抄送人，包含用户名，用户需在蓝鲸平台注册，多个以逗号分隔，若cc、cc__username同时存在，以cc为准") }} |
    | body_format        |  string    | {{ _("否") }}     | {{ _("邮件格式，包含'Html', 'Text'，默认为'Html'") }} |
    | is_content_base64  |  bool      | {{ _("否") }}     | {{ _("邮件内容是否base64编码，默认False，不编码，请使用base64.b64encode方法编码") }} |


    ### {{ _("请求参数示例") }}

    ```python
    {
        "bk_app_code": "esb_test",
        "bk_app_secret": "xxx",
        "bk_token": "xxx",
        "receiver": "admin@bking.com",
        "sender": "admin@bking.com",
        "title": "This is a Test",
        "content": "<html>Welcome to Blueking</html>",
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
    contact_way = 'email'
    smtp_timeout = 10

    class Form(BaseComponentForm):
        sender = forms.CharField(label='sender', required=False)
        receiver = ListField(label='email recipients', required=False)
        receiver__username = ListField(label='email recipients', required=False)
        cc = ListField(label='CC', required=False)
        cc__username = ListField(label='CC', required=False)
        title = forms.CharField(label='email subject', required=True)
        content = forms.CharField(label='email content', required=True)
        is_content_base64 = DefaultBooleanField(
            label='content is encoded by base64 or not', default=False, required=False)
        body_format = forms.CharField(label='email format', required=False)

        def clean(self):
            data = self.cleaned_data
            if not(data['receiver'] or data['receiver__username']):
                raise forms.ValidationError(
                    'Receiver [receiver, receiver__username] shall not be empty at the same time')
            if data['receiver']:
                data['receiver__username'] = None
            if data['cc']:
                data['cc__username'] = None
            if data['is_content_base64']:
                try:
                    data['content'] = base64.b64decode(data['content'])
                except:
                    pass
            return data

    def handle(self):
        # 默认支持通过 SMTP 服务器或第三方接口发送邮件，
        # 为实现邮件发送，需完善组件配置，有以下两种方式：
        # 1. 在 ./toolkit/configs.py 更新 SMTP 配置或第三方接口配置
        # 2. 在 ESB 管理页面，修改"发送邮件"通道的"组件配置"

        # SMTP 配置，具体更新配置的方式参考上文描述
        self.smtp_host = getattr(self, 'smtp_host', '') or getattr(configs, 'smtp_host', '')
        self.smtp_port = getattr(self, 'smtp_port', None) or getattr(configs, 'smtp_port', None)
        self.smtp_user = getattr(self, 'smtp_user', '') or getattr(configs, 'smtp_user', '')
        self.smtp_pwd = getattr(self, 'smtp_pwd', '') or getattr(configs, 'smtp_pwd', '')
        self.mail_sender = getattr(self, 'mail_sender', '') or getattr(configs, 'mail_sender', '')
        self.smtp_usessl = getattr(self, 'smtp_usessl', '') or getattr(configs, 'smtp_usessl', False)
        self.smtp_usessl = str_bool(self.smtp_usessl)
        self.smtp_usetls = getattr(self, 'smtp_usetls', '') or getattr(configs, 'smtp_usetls', False)
        self.smtp_usetls = str_bool(self.smtp_usetls)

        # 第三方接口地址配置，具体更新配置的方式参考上文描述
        self.dest_url = getattr(self, 'dest_url', '') or getattr(configs, 'dest_url', '')

        data = self.request.kwargs
        # 检验接收者邮箱格式
        if data['receiver']:
            tools.validate_receiver(data['receiver'], contact_way=self.contact_way)
        if data['cc']:
            tools.validate_receiver(data['cc'], contact_way=self.contact_way)
        # 根据蓝鲸平台用户数据，将用户名转换为邮箱地址
        if data['receiver__username'] or data['cc__username']:
            user_data = tools.get_receiver_with_username(
                receiver__username=data['receiver__username'],
                cc__username=data['cc__username'],
                contact_way=self.contact_way
            )
            data.update(user_data)
        if not data['sender']:
            data['sender'] = self.mail_sender

        if self.dest_url:
            # 如果配置了第三方接口地址，则请求第三方接口实现邮件发送
            # 注意：如果通过第三方接口，则第三方接口协议需兼容组件参数
            result = self.outgoing.http_client.request_by_url(
                'POST',
                self.dest_url,
                data=json.dumps(data)
            )

            if result['result'] and data.get('_extra_user_error_msg'):
                result = {
                    'result': False,
                    'message': u'Some users failed to send email. %s' % data['_extra_user_error_msg'],
                }
            self.response.payload = result

        elif self.smtp_host:
            # 如果配置了 SMTP 服务，则通过 SMTP 邮件服务器，发送邮件
            # 具体更新配置的方式参考上文描述
            smtp_client = send_mail_with_smtp.SMTPClient(
                smtp_host=self.smtp_host,
                smtp_port=int(self.smtp_port or 25),
                smtp_user=self.smtp_user,
                smtp_pwd=self.smtp_pwd,
                smtp_usessl=self.smtp_usessl,
                smtp_usetls=self.smtp_usetls,
                smtp_timeout=self.smtp_timeout,
            )
            result = smtp_client.send_mail(data)

            if result['result'] and data.get('_extra_user_error_msg'):
                result = {
                    'result': False,
                    'message': u'Some users failed to send email. %s' % data['_extra_user_error_msg']
                }

            self.response.payload = result
        else:
            self.response.payload = {
                'result': False,
                'message': 'Unfinished interface shall be improved by the component developer'
            }
