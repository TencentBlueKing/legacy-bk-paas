# -*- coding: utf-8 -*-
from django import forms

from common.base_utils import get_not_empty_value
from common.forms import BaseComponentForm, TypeCheckField
from common.constants import API_TYPE_OP
from components.component import Component
from .toolkit import tools, configs


class GseProcOperate(Component):
    """
    apiLabel {{ _("进程操作") }}
    apiMethod POST

    ### {{ _("功能描述") }}

    {{ _("进程操作") }}

    ### {{ _("请求参数") }}

    {{ common_args_desc }}

    #### {{ _("接口参数") }}

    | {{ _("字段") }}        |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-------------|------------|--------|------------|
    | app_id      |  int       | {{ _("是") }}     | {{ _("业务ID") }} |
    | operate_type|  int       | {{ _("是") }}     | {{ _("操作类型，可选值：0:启动进程(start); 1:停止进程(stop); 2:进程状态查询; 3:注册托管进程; 4:取消托管进程; 7:重启进程(restart); 8:重新加载进程(reload); 9:杀死进程(kill)") }} |
    | proc_list   |  array     | {{ _("是") }}     | {{ _("待操作进程信息") }} |

    #### proc_list

    | {{ _("字段") }}        |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-------------|------------|--------|------------|
    | ip_list     |  array     | {{ _("是") }}     | {{ _("IP列表") }} |
    | setup_path  |  string    | {{ _("是") }}     | {{ _("进程路径，例如/usr/local/gse/gseagent/plugins/unifyTlogc/sbin") }} |
    | proc_name   |  string    | {{ _("是") }}     | {{ _("进程名称，例如bk_gse_unifyTlogc") }} |
    | pid_path    |  string    | {{ _("是") }}     | {{ _("pid文件所在路径, 例如/usr/local/gse/gseagent/plugins/unifyTlogc/log/bk_gse_unifyTlogc.pid") }} |
    | username    |  string    | {{ _("否") }}     | {{ _("系统用户名，不传默认为root") }} |
    | cmd_shell_ext | string   | {{ _("否") }}     | {{ _("进程操作控制脚本的扩展名: sh:默认值shell适于Linux或cygwin,bat:windows的dos脚本,ps1:windows的Powershell脚本;注意：这个是针对ip_list参数下所有IP统一配置，所以确保接口传递的ip_list参数下所有IP都能支持指定的脚本。") }} |
    | cpu_lmt     | int        | {{ _("否") }}     | {{ _("进程使用cpu限制，超过限制agent会根据配置的cmd_shell_ext调用相应类型的stopCmd停止进程。") }} |
    | mem_lmt     | int        | {{ _("否") }}     | {{ _("进程使用mem限制，超过限制agent会根据配置的cmd_shell_ext调用相应类型的stopCmd停止进程。") }} |

    #### ip_list

    | {{ _("字段") }}        |  {{ _("类型") }}      | {{ _("必选") }}   |  {{ _("描述") }}      |
    |-------------|------------|--------|------------|
    | ip          |  string    | {{ _("是") }}     | {{ _("IP地址") }} |
    | source      |  int       | {{ _("是") }}     | {{ _("子网ID") }} |

    ### {{ _("请求参数示例") }}

    ```python
    {
        "app_code": "esb_test",
        "app_secret": "xxx",
        "bk_token": "xxx",
        "username": "admin",
        "app_id": 46,
        "operate_type": 1,
        "proc_list": [
            {
                "ip_list": [
                    {
                        "ip": "10.0.0.1",
                        "source": 1,
                    }
                ],
                "setup_path": "/usr/local/gse/gseagent/plugins/unifyTlogc/sbin",
                "proc_name": "bk_gse_unifyTlogc",
                "pid_path": "/usr/local/gse/gseagent/plugins/unifyTlogc/log/bk_gse_unifyTlogc",
                "username": "root",
                "cmd_shell_ext": "bat",
                "cpu_lmt": 50,
                "mem_lmt": 50,
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
            "gseTaskId": "GSETASK:20170413215154:8239",
            "errorMessage": "success"
        },
    }
    ```
    """  # noqa

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP
    host = configs.host

    class Form(BaseComponentForm):
        app_id = forms.IntegerField(label="business ID", required=True)
        operate_type = forms.IntegerField(label="operation type", required=True)
        proc_list = TypeCheckField(label="process information", promise_type=list, required=True)

        def clean(self):
            data = self.cleaned_data
            return {
                "applicationId": data["app_id"],
                "operType": data["operate_type"],
                "processInfos": [
                    GseProcOperate.ProcForm(proc).get_cleaned_data_or_error() for proc in data["proc_list"]
                ],
            }

    class ProcForm(BaseComponentForm):
        ip_list = TypeCheckField(label="ip list", promise_type=list, required=True)
        setup_path = forms.CharField(label="process setup path", required=True)
        proc_name = forms.CharField(label="process name", required=True)
        pid_path = forms.CharField(label="pid file path", required=True)
        username = forms.CharField(label="system username", required=False)
        cmd_shell_ext = forms.CharField(label="cmd shell extension", required=False)
        cpu_lmt = forms.IntegerField(label="cpu limit", required=False)
        mem_lmt = forms.IntegerField(label="mem limit", required=False)

        def clean(self):
            data = self.cleaned_data
            new_data = {
                "ipList": [GseProcOperate.IPForm(ip).get_cleaned_data_or_error() for ip in data["ip_list"]],
                "setupPath": data["setup_path"],
                "procName": data["proc_name"],
                "pidPath": data["pid_path"],
                "userName": data["username"],
                "cmdShellExt": data["cmd_shell_ext"],
                "cpuLmt": data["cpu_lmt"],
                "memLmt": data["mem_lmt"],
            }
            return get_not_empty_value(new_data)

    class IPForm(BaseComponentForm):
        ip = forms.CharField(label="ip address", required=True)
        source = forms.IntegerField(label="subnet ID", required=True)

    def handle(self):
        data = self.form_data
        data["operator"] = self.current_user.username

        client = tools.JOBClient(self.outgoing.http_client)
        params = tools.get_basic_json("gseProcessOperate", params=data)
        result = client.post(self.host, data=params)

        self.response.payload = result
