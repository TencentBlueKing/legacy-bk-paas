# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
import base64

from django import forms
from django.utils import timezone

from components.component import Component, SetupConfMixin
from common.forms import BaseComponentForm, ListField, TypeCheckField, DefaultBooleanField
from common.constants import API_TYPE_OP
from .toolkit import configs


class SendMpWeixin(Component, SetupConfMixin):
    """
    apiLabel {{ _("发送公众号微信消息") }}
    apiMethod POST

    ### {{ _("功能描述") }}

    {{ _("发送公众号微信消息") }}

    ### {{ _("请求参数") }}

    {{ common_args_desc }}

    #### {{ _("接口参数") }}

    | {{ _("字段") }}   |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |--------------------|------------|--------|------------|
    | receiver           |  string    | {{ _("是") }}     | {{ _("微信接收者，包含绑定在指定公众号上的微信用户的 openid，多个以逗号分隔") }} |
    | data               |  dict      | {{ _("是") }}     | {{ _("消息内容") }} |

    #### data

    | {{ _("字段") }}               |  {{ _("类型") }}       | {{ _("必选") }}   |  {{ _("描述") }}      |
    |--------------------|------------|--------|------------|
    | heading            |  string    | {{ _("是") }}     | {{ _("通知头部文字") }} |
    | message            |  string    | {{ _("是") }}     | {{ _("通知文字") }} |
    | date               |  string    | {{ _("否") }}     | {{ _('通知发送时间，默认为当前时间 "YYYY-mm-dd HH:MM"') }} |
    | remark             |  string    | {{ _("否") }}     | {{ _("通知尾部文字") }} |
    | is_message_base64  |  bool      | {{ _("否") }}     | {{ _("通知文字message是否base64编码，默认False，不编码，若编码请使用base64.b64encode方法") }} |

    ### {{ _("请求参数示例") }}

    ```python
    {
        "bk_app_code": "esb_test",
        "bk_app_secret": "xxx",
        "bk_token": "xxx",
        "receiver": "xxx",
        "data": {
            "heading": "message",
            "message": "This is a test.",
            "date": "2017-02-22 15:36",
            "remark": "zhen is a test"
        }
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

    class Form(BaseComponentForm):
        receiver = ListField(label='wechat receiver', required=True)
        data = TypeCheckField(label='message data', promise_type=dict, required=True)

        def clean(self):
            data = self.cleaned_data
            return {
                'touser': data['receiver'],
                'data': SendMpWeixin.DataForm(data['data']).get_cleaned_data_or_error(),
            }

    class DataForm(BaseComponentForm):
        heading = forms.CharField(label="notification header text", required=True)
        message = forms.CharField(label="notification text", required=True)
        date = forms.CharField(label="notification sending time", required=False)
        remark = forms.CharField(label="notification tail text", required=False)
        is_message_base64 = DefaultBooleanField(
            label='notification text is encoded by base64 or not', default=False, required=False)

        def decode_message(self, message, is_message_base64):
            if is_message_base64:
                try:
                    message = base64.b64decode(message)
                except:
                    pass
            return message

        def clean(self):
            data = self.cleaned_data
            date = data.get('date') or timezone.now().strftime('%Y-%m-%dT%H:%M:%SZ')

            return {
                "first": {
                    "value": data['heading']
                },
                "keyword1": {
                    "value": self.decode_message(data['message'], data['is_message_base64'])
                },
                "keyword2": {
                    "value": date
                },
                "remark": {
                    "value": data.get('remark', '')
                }
            }

    def handle(self):
        # 组件会根据 wx_app_id & wx_secret 申请微信的 access_token，
        # 业务如希望集中管理 access_token，可优化 components/apis/weixin_mp/get_token.py 中 access_token 获取逻辑
        self.wx_template_id = getattr(self, 'wx_template_id', '') or getattr(configs, 'wx_template_id', '')
        self.wx_app_id = getattr(self, 'wx_app_id', '') or getattr(configs, 'wx_app_id', '')
        self.wx_secret = getattr(self, 'wx_secret', '') or getattr(configs, 'wx_secret', '')

        data = self.form_data
        data.update({
            'appid': self.wx_app_id,
            'secret': self.wx_secret,
            'template_id': self.wx_template_id,
            'url': self.request.kwargs.get('url', ''),
        })
        self.response.payload = self.invoke_other('generic.weixin_mp.send_msg_with_tpl', kwargs=data)
