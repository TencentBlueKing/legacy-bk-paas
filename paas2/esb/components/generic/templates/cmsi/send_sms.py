# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS
Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License.
You may obtain a copy of the License at http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
specific language governing permissions and limitations under the License.
"""

import json
import base64

from django import forms
from django.utils.encoding import force_text

from components.component import Component, SetupConfMixin
from common.forms import BaseComponentForm, ListField, DefaultBooleanField
from common.constants import API_TYPE_OP, HTTP_METHOD
from .toolkit import configs, tools


class SendSms(Component, SetupConfMixin):
    suggest_method = HTTP_METHOD.POST
    label = u"发送短信"
    label_en = "Send SMS"

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP
    host = configs.host
    contact_way = "phone"

    class Form(BaseComponentForm):
        receiver = ListField(label="SMS receiver", required=False)
        receiver__username = ListField(label="SMS receiver", required=False)
        content = forms.CharField(label="message content", required=True)
        is_content_base64 = DefaultBooleanField(
            label="content is encoded by base64 or not", default=False, required=False
        )

        def decode_content(self, content, is_content_base64):
            if is_content_base64:
                try:
                    content = base64.b64decode(content)
                except Exception:
                    pass
            return content

        def clean(self):
            data = self.cleaned_data
            if data["receiver"]:
                data["receiver"] = [{"telephone": item} for item in data["receiver"]]
                data["receiver__username"] = None
            data["content"] = self.decode_content(data["content"], data["is_content_base64"])
            return data

    def handle(self):
        # QCloud 短信配置
        self.qcloud_app_id = getattr(self, "qcloud_app_id", "") or getattr(configs, "qcloud_app_id", "")
        self.qcloud_app_key = getattr(self, "qcloud_app_key", "") or getattr(configs, "qcloud_app_key", "")
        self.qcloud_sms_sign = getattr(self, "qcloud_sms_sign", "") or getattr(configs, "qcloud_sms_sign", "")

        data = self.request.kwargs
        if data["receiver"]:
            tools.validate_receiver(data["receiver"], contact_way=self.contact_way)
        if data["receiver__username"]:
            try:
                user_data = tools.get_receiver_with_username(
                    receiver__username=data["receiver__username"], contact_way=self.contact_way
                )
            except tools.NoValidUser as err:
                result = {
                    "result": False,
                    "message": force_text(err),
                }
                self.response.payload = tools.inject_invalid_usernames(result, err.invalid_usernames)
                return

            data.update(user_data)

        # TODO: can be updated
        if self.dest_url:
            result = self.outgoing.http_client.request_by_url("POST", self.dest_url, data=json.dumps(data))

            if result["result"] and data.get("_extra_user_error_msg"):
                result = {
                    "result": False,
                    "message": u"Some users failed to send sms. %s" % data["_extra_user_error_msg"],
                }

            self.response.payload = tools.inject_invalid_usernames(result, data.get("_invalid_usernames"))
        elif self.qcloud_app_id and self.qcloud_app_key:
            for tel in tools.group_by_nation_code(data["receiver"]):
                params = {
                    "sms_type": 0,
                    "tel": tel,
                    "content": data["content"],
                    "sdk_app_id": self.qcloud_app_id,
                    "app_key": self.qcloud_app_key,
                    "sms_sign": self.qcloud_sms_sign,
                }
                result = self.invoke_other("generic.qcloud_sms.send_multi_sms", kwargs=params)
                if not result["result"]:
                    self.response.payload = result
                    return

            if result["result"] and data.get("_extra_user_error_msg"):
                result = {
                    "result": False,
                    "message": u"Some users failed to send sms. %s" % data["_extra_user_error_msg"],
                }
            self.response.payload = tools.inject_invalid_usernames(result, data.get("_invalid_usernames"))
        else:
            result = {
                "result": False,
                "message": "Unfinished interface shall be improved by the component developer",
            }
            self.response.payload = tools.inject_invalid_usernames(result, data.get("_invalid_usernames"))
