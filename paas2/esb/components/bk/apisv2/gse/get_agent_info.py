# -*- coding: utf-8 -*-
import json

from django import forms

from components.component import Component
from common.forms import BaseComponentForm, TypeCheckField
from common.constants import API_TYPE_Q, HTTP_METHOD
from common.errors import error_codes
from lib.gse.cacheApi import ttypes

from .toolkit import tools, configs


class GetAgentInfo(Component):
    suggest_method = HTTP_METHOD.POST
    label = u"Agent心跳信息查询"
    label_en = "query agent heartbeat info"

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    class Form(BaseComponentForm):
        bk_supplier_id = forms.IntegerField(label="bk supplier id", required=False)
        bk_supplier_account = forms.CharField(label="bk supplier account", required=False)
        hosts = TypeCheckField(label="host list", promise_type=list, required=True)

        def clean(self):
            data = self.get_cleaned_data_when_exist()
            new_hosts = []
            for host in data["hosts"]:
                host = GetAgentInfo.HostForm(host).get_cleaned_data_or_error()
                host = ttypes.cache_ip_info(
                    gse_composite_id=str(host["bk_cloud_id"]),
                    ip=host["ip"],
                )
                new_hosts.append(host)
            return {"request": ttypes.agent_status_request(hosts=new_hosts)}

    class HostForm(BaseComponentForm):
        ip = forms.CharField(label="ip", required=True)
        bk_cloud_id = forms.IntegerField(label="cloud area id", required=True)

    def handle(self):
        client = tools.GSECacheAPIClient(
            host=configs.gse_cacheapi_host,
            port=configs.gse_cacheapi_port,
            use_test_env=self.request.use_test_env,
            component=self,
        )
        response = client.request("get_agent_info", args=[self.form_data["request"]])
        self.response.payload = self.format_response(response)

    def format_response(self, response):
        if response.bk_error_code != 0:
            return {
                "result": False,
                "code": response.bk_error_code,
                "message": response.bk_error_msg,
            }

        ret_data = {}
        for key, value in response.result.items():
            try:
                value = json.loads(value)
            except Exception:
                raise error_codes.THIRD_PARTY_RESULT_ERROR.format_prompt(args=configs.SYSTEM_NAME)
            value.pop("gse_composite_id", None)
            ret_data[key] = value

        return {
            "result": True,
            "code": 0,
            "data": ret_data,
            "message": response.bk_error_msg,
        }
