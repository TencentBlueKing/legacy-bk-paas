# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
import json

from esb.bkcore.models import ESBChannel
from components.component import Component, SetupConfMixin
from common.forms import BaseComponentForm, DefaultBooleanField
from common.constants import API_TYPE_Q
from common.errors import CommonAPIError
from .toolkit import configs


class GetToken(Component, SetupConfMixin):
    """"""

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    class Form(BaseComponentForm):
        need_new_token = DefaultBooleanField(label='obtain a new token or not', default=False, required=False)

    def get_wx_config(self):
        try:
            send_weixin_channel = ESBChannel.objects.get(path='/cmsi/send_weixin/')
        except Exception:
            raise CommonAPIError(
                'Channel with path [/cmsi/send_weixin/] does not exist, can not get WeChat configuration')
        return dict(json.loads(send_weixin_channel.comp_conf))

    def handle(self):
        wx_config = self.get_wx_config()
        wx_type = wx_config.get('wx_type')
        if wx_type in ['qy', 'qywx']:
            wx_qy_corpid = wx_config.get('wx_qy_corpid')
            wx_qy_corpsecret = wx_config.get('wx_qy_corpsecret')
            if not (wx_qy_corpid and wx_qy_corpsecret):
                raise CommonAPIError(
                    'Please improve the component configuration of component [/cmsi/send_weixin/] '
                    'in ESB channel management')
            kwargs = {
                'corpid': wx_qy_corpid,
                'corpsecret': wx_qy_corpsecret,
            }
            self.response.payload = self.invoke_other('generic.weixin_qy.get_token', kwargs=kwargs)
        elif wx_type in ['mp']:
            wx_app_id = wx_config.get('wx_app_id')
            wx_secret = wx_config.get('wx_secret')
            if not (wx_app_id and wx_secret):
                raise CommonAPIError(
                    'Please improve the component configuration of component [/cmsi/send_weixin/] '
                    'in ESB channel management')
            kwargs = {
                'appid': wx_app_id,
                'secret': wx_secret,
                'need_new_token': self.form_data['need_new_token'],
            }
            self.response.payload = self.invoke_other('generic.weixin_mp.get_token', kwargs=kwargs)
        else:
            self.response.payload = {
                'result': False,
                'message': 'In the component configuration for component [/cmsi/send_weixin/], '
                'the value of wx_type is not in the optional range'
            }
