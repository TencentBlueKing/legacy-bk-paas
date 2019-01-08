# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
import datetime

from django import forms
from django.utils import timezone

from esb.bkcore.models import WxmpAccessToken
from components.component import Component, SetupConfMixin
from common.forms import BaseComponentForm, DefaultBooleanField
from common.constants import API_TYPE_Q
from common.errors import CommonAPIError
from .toolkit import tools, configs


class GetToken(Component, SetupConfMixin):
    """"""

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    class Form(BaseComponentForm):
        appid = forms.CharField(label='wechat appid', required=True)
        secret = forms.CharField(label='wechat app secret', required=True)
        need_new_token = DefaultBooleanField(label='obtain a new token or not', default=False, required=False)

    def get_wx_token(self):
        params = {
            'grant_type': 'client_credential',
            'appid': self.form_data['appid'],
            'secret': self.form_data['secret'],
            'simple_get_token': 1,
        }
        client = tools.WEIXINClient(self.outgoing.http_client)
        result = client.get(path='/cgi-bin/token', params=params)
        if not result['result']:
            raise CommonAPIError(result['message'])
        return result['data']

    def handle(self):
        wx_app_id = self.form_data['appid']
        need_new_token = self.form_data['need_new_token']
        # 获取现有的token信息
        try:
            wx_access_token = WxmpAccessToken.objects.get(wx_app_id=wx_app_id)
        except Exception:
            wx_access_token = None

        if not wx_access_token or wx_access_token.has_expired() or need_new_token:
            wx_token = self.get_wx_token()
            expires = timezone.now() + datetime.timedelta(seconds=wx_token['expires_in'])
            wx_access_token, created = WxmpAccessToken.objects.get_or_create(
                wx_app_id=wx_app_id,
                defaults={
                    'access_token': wx_token['access_token'],
                    'expires': expires,
                }
            )
            if not created:
                wx_access_token.access_token = wx_token['access_token']
                wx_access_token.expires = expires
                wx_access_token.touch()
                wx_access_token.save()

        self.response.payload = {
            'result': True,
            'data': wx_access_token.get_info(),
        }
