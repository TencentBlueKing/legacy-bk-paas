# -*- coding: utf-8 -*-
from django import forms

from common.forms import BaseComponentForm, TypeCheckField
from common.constants import API_TYPE_OP
from components.component import Component
from .toolkit import tools, configs


class GseSetBaseReport(Component):
    """
    apiLabel {{ _("开启/关闭Agent基础数据采集上报功能") }}
    apiMethod POST

    ### {{ _("功能描述") }}

    {{ _("开启/关闭Agent基础数据采集上报功能") }}

    ### {{ _("请求参数") }}

    {{ common_args_desc }}

    #### {{ _("接口参数") }}

    | 字段        |  类型      | 必选   |  描述      |
    |-------------|------------|--------|------------|
    | app_id      |  int       | {{ _("是") }}     | {{ _("业务ID") }} |
    | sys_id      |  int       | {{ _("是") }}     | {{ _("系统信息上报dataid，为-1则关闭上报") }} |
    | cpu_id      |  int       | {{ _("是") }}     | {{ _("cpu信息上报dataid，为-1则关闭上报") }} |
    | mem_id      |  int       | {{ _("是") }}     | {{ _("mem信息上报dataid，为-1则关闭上报") }} |
    | net_id      |  int       | {{ _("是") }}     | {{ _("网卡信息上报dataid，为-1则关闭上报") }} |
    | disk_id     |  int       | {{ _("是") }}     | {{ _("磁盘IO信息上报dataid，为-1则关闭上报") }} |
    | proc_id     |  int       | {{ _("是") }}     | {{ _("进程信息上报dataid，为-1则关闭上报") }} |
    | crond_id    |  int       | {{ _("是") }}     | {{ _("crontab上报dataid，为-1则关闭上报") }} |
    | iptables_id |  int       | {{ _("是") }}     | {{ _("iptables信息上报dataid，为-1则关闭上报") }} |
    | ip_list     |  array     | {{ _("是") }}     | {{ _("IP列表") }} |

    #### ip_list

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-----------|------------|--------|------------|
    | ip        |  string    | {{ _("是") }}     | {{ _("IP地址") }} |
    | source    |  int       | {{ _("是") }}     | {{ _("子网ID") }} |

    ### {{ _("请求参数示例") }}

    ```python
    {
        "app_code": "esb_test",
        "app_secret": "xxx",
        "bk_token": "xxx",
        "username": "admin",
        "app_id": 1,
        "sys_id": -1,
        "cpu_id": -1,
        "mem_id": -1,
        "net_id": -1,
        "disk_id": -1,
        "proc_id": -1,
        "crond_id": -1,
        "iptables_id": -1,
        "ip_list": [
            {
                "ip": "10.0.0.1",
                "source": 1,
            }
        ]
    }
    ```

    ### {{ _("返回结果示例") }}

    ```python
    {
        "result": true,
        "code": "00",
        "message": "",
        "data": {
            "errorCode": 0,
            "gseTaskId": "GSETASK:20170621165117:3673",
            "errorMessage": "succ"
        },
    }
    ```
    """

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP
    host = configs.host

    class Form(BaseComponentForm):
        app_id = forms.IntegerField(label="business ID", required=True)
        sys_id = forms.IntegerField(label="system info report dataid", required=True)
        cpu_id = forms.IntegerField(label="cpu info report dataid", required=True)
        mem_id = forms.IntegerField(label="mem info report dataid", required=True)
        net_id = forms.IntegerField(label="NIC info report dataid", required=True)
        disk_id = forms.IntegerField(label="disk io info report dataid", required=True)
        proc_id = forms.IntegerField(label="process info report dataid", required=True)
        crond_id = forms.IntegerField(label="crontab report ataid", required=True)
        iptables_id = forms.IntegerField(label="iptables info report dataid", required=True)
        ip_list = TypeCheckField(label="ip list", promise_type=list, required=True)

        def clean(self):
            data = self.cleaned_data
            return {
                "applicationId": data["app_id"],
                "sysId": data["sys_id"],
                "cpuId": data["cpu_id"],
                "memId": data["mem_id"],
                "netId": data["net_id"],
                "diskId": data["disk_id"],
                "procId": data["proc_id"],
                "crondId": data["crond_id"],
                "iptablesId": data["iptables_id"],
                "ipList": [GseSetBaseReport.IPForm(info).get_cleaned_data_or_error() for info in data["ip_list"]],
            }

    class IPForm(BaseComponentForm):
        ip = forms.CharField(label="ip list", required=True)
        source = forms.IntegerField(label="subnet ID", required=True)

    def handle(self):
        data = self.form_data
        data["operator"] = self.current_user.username

        client = tools.JOBClient(self.outgoing.http_client)
        params = tools.get_basic_json("gseSetBaseReport", params=data)
        result = client.post(self.host, data=params)

        self.response.payload = result
