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

from django import forms

from components.component import Component, SetupConfMixin
from esb.channel import get_channel_manager
from common.forms import BaseComponentForm, ListField, DefaultBooleanField, TypeCheckField
from common.constants import API_TYPE_OP, HTTP_METHOD
from .toolkit import configs


class SendMsg(Component, SetupConfMixin):
    suggest_method = HTTP_METHOD.POST
    label = u"通用消息发送"
    label_en = "Send message"

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP
    msg_type_map = configs.msg_type_map

    class Form(BaseComponentForm):
        msg_type = forms.CharField(label="msg type", required=True)
        receiver__username = ListField(label="recipients", required=True)
        sender = forms.CharField(label="mail sender", required=False)
        cc__username = ListField(label="CC", required=False)
        title = forms.CharField(label="subject", required=True)
        content = forms.CharField(label="content", required=True)
        body_format = forms.CharField(label="email format", required=False)
        attachments = TypeCheckField(label="attachments", promise_type=list, required=False)
        date = forms.CharField(label="notification sending time", required=False)
        remark = forms.CharField(label="notification tail text", required=False)
        wx_qy_agentid = forms.CharField(label="enterprise wechat agentid", required=False)
        wx_qy_corpsecret = forms.CharField(label="enterprise wechat corpsecret", required=False)
        is_content_base64 = DefaultBooleanField(
            label="content is encoded by base64 or not", default=False, required=False
        )

        def clean(self):
            data = self.cleaned_data
            if data["msg_type"] == "voice":
                data["auto_read_message"] = data["content"]

            if data["msg_type"] == "weixin":
                data["data"] = {
                    "heading": data["title"],
                    "message": data["content"],
                    "date": data["date"],
                    "remark": data["remark"],
                    "is_message_base64": data["is_content_base64"],
                }

            return data

    def handle(self):
        data = self.form_data
        msg_type = data.pop("msg_type")

        channel_manager = get_channel_manager()

        if msg_type not in configs.msg_type_map:
            self.response.payload = {"result": False, "message": "Unsupported type of msg type"}
            return

        path = "/cmsi/%s/" % self.msg_type_map[msg_type]
        channel_conf = channel_manager.get_channel_by_path(path, "POST")
        comp_conf = channel_conf.get("comp_conf") or {} if channel_conf else {}
        comp_obj = self.prepare_other("generic.cmsi.%s" % self.msg_type_map[msg_type], kwargs=data)
        comp_obj.setup_conf(comp_conf)
        self.response.payload = comp_obj.invoke()
