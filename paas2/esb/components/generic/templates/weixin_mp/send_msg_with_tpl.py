# -*- coding: utf-8 -*-
import json

from django import forms

from common.constants import API_TYPE_OP
from components.component import Component, SetupConfMixin
from common.forms import BaseComponentForm, ListField, TypeCheckField
from .toolkit import configs, tools


class SendMsgWithTpl(Component, SetupConfMixin):
    """"""

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    class Form(BaseComponentForm):
        appid = forms.CharField(label="wechat appid", required=True)
        secret = forms.CharField(label="wechat app secret", required=True)
        touser = ListField(label="touser", required=True)
        template_id = forms.CharField(label="template ID", required=True)
        data = TypeCheckField(label="message data", promise_type=dict, required=False)

    def send_msg(self, wx_client, access_token, data):
        return wx_client.post(
            path="/cgi-bin/message/template/send?access_token=%s" % access_token,
            data=json.dumps(data),
        )

    def get_wx_access_token(self, params, need_new_token=False):
        params["need_new_token"] = need_new_token
        wx_token = self.invoke_other("generic.weixin_mp.get_token", kwargs=params)
        return wx_token["data"]["access_token"]

    def handle(self):
        data = self.request.kwargs
        common_params = {
            "template_id": data["template_id"],
            "url": data.get("url", ""),
            "data": data["data"],
            "simple_get_token": 1,
        }
        wx_client = tools.WEIXINClient(self.outgoing.http_client)

        succ_flag = True
        access_token = self.get_wx_access_token(data)
        for wx_openid in data["touser"]:
            common_params["touser"] = wx_openid
            result = self.send_msg(wx_client, access_token, common_params)
            if not result["result"] and result["data"].get("errcode") in (40001, 40014, 42001):
                # Token 失效，刷新 Token 并重试
                access_token = self.get_wx_access_token(data, need_new_token=True)
                result = self.send_msg(wx_client, access_token, common_params)
            if not result["result"]:
                succ_flag = False

        if succ_flag:
            self.response.payload = {"result": True, "message": "WeChat message sending succeeded"}
        else:
            self.response.payload = {"result": False, "message": "WeChat message sending failed"}
