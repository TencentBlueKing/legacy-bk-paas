# -*- coding: utf-8 -*-
import json

from django import forms

from common.constants import API_TYPE_OP
from components.component import Component, SetupConfMixin
from common.forms import BaseComponentForm, ListField
from .toolkit import configs, tools


class SendMessage(Component, SetupConfMixin):
    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    class Form(BaseComponentForm):
        corpid = forms.CharField(label="corp ID", required=True)
        corpsecret = forms.CharField(label="corp secret", required=True)
        agentid = forms.IntegerField(label="corp agentid", required=True)
        touser = ListField(label="touser", required=True)
        content = forms.CharField(label="content", required=True)

    def get_wx_access_token(self, params):
        wx_token = self.invoke_other("generic.weixin_qy.get_token", kwargs=params)
        return wx_token["data"]["access_token"]

    def handle(self):
        access_token = self.get_wx_access_token(params=self.form_data)
        data = {
            "touser": "|".join(self.form_data["touser"]),
            "msgtype": "text",
            "agentid": self.form_data["agentid"],
            "text": {
                "content": self.form_data["content"],
            },
        }

        wx_client = tools.WEIXINClient(self.outgoing.http_client)
        result = wx_client.post(
            path="/cgi-bin/message/send?access_token=%s" % access_token,
            data=json.dumps(data, ensure_ascii=False).encode("utf-8"),
        )

        if result["result"]:
            invaliduser = result.get("data", {}).get("invaliduser")
            if invaliduser:
                self.response.payload = {
                    "result": False,
                    "message": u"WeChat message sending failed, invalid user: %s" % invaliduser,
                }
            else:
                self.response.payload = {"result": True, "message": u"WeChat message sending succeeded"}
        else:
            ret_data = result.get("data", {})
            message = "WeChat message sending failed"
            if ret_data.get("invaliduser"):
                message = u"%s, invalid user: %s" % (message, ret_data["invaliduser"])
            if ret_data.get("errmsg"):
                message = u"%s, %s" % (message, ret_data["errmsg"])
            self.response.payload = {"result": False, "message": message, "data": result, "params": data}
