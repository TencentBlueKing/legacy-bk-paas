# -*- coding: utf-8 -*-
from django import forms

from components.component import Component, SetupConfMixin
from common.forms import BaseComponentForm, TypeCheckField
from common.constants import API_TYPE_OP
from .toolkit import tools, configs


class SendVoiceMsg(Component, SetupConfMixin):
    """"""

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    class Form(BaseComponentForm):
        qcloud_app_id = forms.CharField(label="qcloud app id", required=True)
        qcloud_app_key = forms.CharField(label="qcloud app key", required=True)
        auto_read_message = forms.CharField(label="auto voice reading info", required=True)
        user_list_information = TypeCheckField(label="user list", promise_type=list, required=True)
        ext = forms.CharField(label="ext", required=False)

        def kwargs_generator(self, data):
            for user in data["user_list_information"]:
                user["nation_code"] = user.get("nation_code") or configs.default_nation_code

                yield {
                    "user": user,
                    "promptfile": data["auto_read_message"],
                    "playtimes": configs.voice_playtimes,
                    "prompttype": configs.voice_prompttype,
                    "tel": {
                        "mobile": user["mobile_phone"],
                        "nationcode": user["nation_code"],
                    },
                    "ext": data["ext"],
                }

        def clean(self):
            data = self.cleaned_data
            return {
                "kwargs_generator": self.kwargs_generator(data),
                "qcloud_app_id": data["qcloud_app_id"],
                "qcloud_app_key": data["qcloud_app_key"],
            }

    def handle(self):
        data = self.request.kwargs["kwargs_generator"]
        client = tools.QCloudVoiceClient(self.outgoing.http_client)
        result = {"successed": [], "failed": []}
        for kwargs in data:
            rnd = client.get_random()
            cur_time = client.get_cur_time()
            kwargs["time"] = cur_time
            kwargs["sig"] = client.generate_sig(
                self.request.kwargs["qcloud_app_key"], kwargs["tel"]["mobile"], rnd, cur_time
            )

            user = kwargs.pop("user")
            ret = client.post(
                "/v5/tlsvoicesvr/sendvoiceprompt?sdkappid=%s&random=%s" % (self.request.kwargs["qcloud_app_id"], rnd),
                data=kwargs,
            )
            user.update(ret)
            result["successed"].append(user) if ret["result"] == 0 else result["failed"].append(user)

        self.response.payload = result
