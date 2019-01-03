# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
from django import forms

from components.component import Component, SetupConfMixin
from common.forms import BaseComponentForm, ListField
from common.constants import API_TYPE_OP
from .toolkit import configs


class SendQyWeixin(Component, SetupConfMixin):
    """
    apiLabel {{ _("发送企业微信") }}
    apiMethod POST

    ### {{ _("功能描述") }}

    {{ _("发送企业微信") }}

    ### {{ _("请求参数") }}

    {{ common_args_desc }}

    #### {{ _("接口参数") }}

    | {{ _("字段") }}      |  {{ _("类型") }}      | {{ _("必选") }}    |  {{ _("描述") }}      |
    |--------------------|------------|--------|------------|
    | receiver           |  string    | {{ _("是") }}     | {{ _("微信接收者，包含企业微信用户ID，多个以逗号分隔") }} |
    | content            |  string    | {{ _("是") }}     | {{ _("消息内容，长度最长为2048字符") }} |

    ### {{ _("请求参数示例") }}

    ```python
    {
        "bk_app_code": "esb_test",
        "bk_app_secret": "xxx",
        "bk_token": "xxx",
        "receiver": "1234567890",
        "content": "This is a Test",
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
    """

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    class Form(BaseComponentForm):
        receiver = ListField(label='wechat receiver', required=True)
        content = forms.CharField(label=u'message content', required=True)

        def clean(self):
            return {
                'touser': self.cleaned_data['receiver'],
                'content': self.cleaned_data['content'],
            }

    def handle(self):
        # 组件会根据 corpid & corpsecret 申请微信的 access_token
        # 业务如希望集中管理 access_token，可优化 components/apis/weixin_qy/get_token.py 中 access_token 获取逻辑
        self.wx_qy_corpid = getattr(self, 'wx_qy_corpid', '') or getattr(configs, 'wx_qy_corpid', '')
        self.wx_qy_corpsecret = getattr(self, 'wx_qy_corpsecret', '') or getattr(configs, 'wx_qy_corpsecret', '')
        self.wx_qy_agentid = getattr(self, 'wx_qy_agentid', '') or getattr(configs, 'wx_qy_agentid', '')

        data = self.form_data
        data.update({
            'corpid': self.wx_qy_corpid,
            'corpsecret': self.wx_qy_corpsecret,
            'agentid': self.wx_qy_agentid,
        })

        self.response.payload = self.invoke_other('generic.weixin_qy.send_message', kwargs=data)
