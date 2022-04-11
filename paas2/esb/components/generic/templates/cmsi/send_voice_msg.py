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
from django import forms
from django.utils.encoding import force_text

from components.component import Component, SetupConfMixin
from common.forms import BaseComponentForm, TypeCheckField, ListField
from common.constants import API_TYPE_OP, HTTP_METHOD
from .toolkit import configs, tools


class SendVoiceMsg(Component, SetupConfMixin):
    suggest_method = HTTP_METHOD.POST
    label = u"公共语音通知"
    label_en = "Send voice message"

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP
    host = configs.host
    contact_way = "phone"
    dest_url = ""

    class Form(BaseComponentForm):
        auto_read_message = forms.CharField(label="auto voice reading info", required=True)
        user_list_information = TypeCheckField(label="user list", promise_type=list, required=False)
        receiver__username = ListField(label="BlueKing user list", required=False)

        def clean(self):
            data = self.cleaned_data
            user_list_information = [
                SendVoiceMsg.UserListInfoForm(user_info).get_cleaned_data_or_error()
                for user_info in data["user_list_information"]
                if user_info
            ]
            if not (data.get("receiver__username") or user_list_information):
                raise forms.ValidationError(
                    "The parameters [user_list_information and receiver__username] shall not be empty at the same time"
                )
            data["user_list_information"] = user_list_information
            if user_list_information:
                data["receiver__username"] = None
            return data

    class UserListInfoForm(BaseComponentForm):
        username = forms.CharField(label="person notified", required=True)
        mobile_phone = forms.CharField(label="mobile phone of the person notified", required=False)

        def clean(self):
            data = self.cleaned_data
            if data["mobile_phone"] and not data["mobile_phone"].isdigit():
                raise forms.ValidationError("Mobile phone [mobile_phone] of the person notified must be a number")
            return data

    def handle(self):
        # QCloud 语音配置
        self.qcloud_app_id = getattr(self, "qcloud_app_id", "") or getattr(configs, "qcloud_app_id", "")
        self.qcloud_app_key = getattr(self, "qcloud_app_key", "") or getattr(configs, "qcloud_app_key", "")

        data = self.form_data
        # 将 receiver__username 中的用户名，转换为接口需要的 user_list_information 信息
        if data["receiver__username"]:
            try:
                user_data = tools.get_user_contact_with_username(
                    username_list=data["receiver__username"],
                    contact_way=self.contact_way,
                )
            except tools.NoValidUser as err:
                result = {
                    "result": False,
                    "message": force_text(err),
                }
                self.response.payload = tools.inject_invalid_usernames(result, err.invalid_usernames)
                return

            data["user_list_information"] = [
                {
                    "username": username,
                    "mobile_phone": contact_info["telephone"],
                    "nation_code": contact_info.get("nation_code"),
                }
                for username, contact_info in user_data["user_contact_info"].iteritems()
            ]
            data["_extra_user_error_msg"] = user_data["_extra_user_error_msg"]

        # TODO: can be updated
        if self.dest_url:
            result = self.outgoing.http_client.request_by_url("POST", self.dest_url, data=json.dumps(data))

            if result["result"] and data.get("_extra_user_error_msg"):
                result = {
                    "result": False,
                    "data": result.get("data"),
                    "message": u"Some users failed to send voice. %s" % data["_extra_user_error_msg"],
                }
            self.response.payload = tools.inject_invalid_usernames(result, data.get("_invalid_usernames"))
        elif self.qcloud_app_id and self.qcloud_app_key:
            params = {
                "user_list_information": data["user_list_information"],
                "auto_read_message": data["auto_read_message"],
                "qcloud_app_id": self.qcloud_app_id,
                "qcloud_app_key": self.qcloud_app_key,
            }
            ret = self.invoke_other("generic.qcloud_voice.send_voice_msg", kwargs=params)

            if not ret["failed"] and data.get("_extra_user_error_msg"):
                result = {
                    "result": False,
                    "data": ret,
                    "message": u"Some users failed to send voice. %s" % data["_extra_user_error_msg"],
                }
            elif ret["failed"]:
                result = {
                    "result": False,
                    "data": ret,
                    "message": "Some users failed to send voice. %s"
                    % ",".join(map(lambda x: x["username"], ret["failed"])),
                }
            else:
                result = {"result": True, "data": ret, "message": "OK"}
            self.response.payload = tools.inject_invalid_usernames(result, data.get("_invalid_usernames"))
        else:
            result = {
                "result": False,
                "message": "Unfinished interface shall be improved by the component developer",
            }
            self.response.payload = tools.inject_invalid_usernames(result, data.get("_invalid_usernames"))
