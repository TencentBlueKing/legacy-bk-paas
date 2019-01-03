# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
from django import forms
import arrow

from common.constants import API_TYPE_OP
from common.forms import BaseComponentForm
from components.component import Component
from .toolkit import tools, configs


class ImapRelay(Component):
    """[FTA] 外网请求代理

    {% block api_doc %}

    描述
    ~~~~

    参数说明
    ~~~~~~~~

    {{ common_args_desc }}

    其他参数

    ===============  ======  ========  ===========================================
    参数名称         必须    类型      参数说明
    ===============  ======  ========  ===========================================
    method           Y       string    请求方法（GET, POST)
    url              Y       int       请求URL
    kwargs           N       kwargs    其他requests支持的参数
    ===============  ======  ========  ===========================================

    请求参数示例
    ~~~~~~~~~~~~

    .. code:: json

        {
            "app_id": "46",
            "method": "GET",
            "url": 'http',
            "data": '',
        }

    结果说明
    ~~~~~~~~

    .. code:: json

        {
            "result": true,
            "code": "00",
            "message": "",
            "data": ''
        }

    {% endblock %}
    """

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_OP

    class Form(BaseComponentForm):
        # 没实际用处，仅供ESB使用
        app_id = forms.CharField(label='business ID', required=True)

        # Email 公共参数
        email = forms.CharField(label='email address', required=True)
        password = forms.CharField(label='email password', required=True)
        imap_host = forms.CharField(label='imap address', required=True)
        imap_port = forms.IntegerField(label='imap port', required=True)
        secure = forms.BooleanField(label=u'imap SSL is on or not', required=False)

        # Email 拉取参数
        charset = forms.CharField(label='charset', required=False)
        unseen = forms.BooleanField(label='unseen', required=False)
        before = forms.CharField(label='befort', required=False)
        since = forms.CharField(label='since', required=False)
        size_limit = forms.IntegerField(label='size limit', required=False)
        sent_from = forms.CharField(label='sent from', required=False)
        sent_to = forms.CharField(label='sent to', required=False)
        subject = forms.CharField(label='title', required=False)
        index = forms.IntegerField(label='paging index', required=False)
        limit = forms.IntegerField(label='paging limit', required=False)

        def clean_before(self):
            if not self.data.get('before'):
                return ''
            try:
                return arrow.get(self.data['before'])
            except Exception as error:
                raise forms.ValidationError('before datetime parser error: %s' % error)

        def clean_since(self):
            if not self.data.get('since'):
                return ''
            try:
                return arrow.get(self.data['since'])
            except Exception as error:
                raise forms.ValidationError('since datetime parser error: %s' % error)

    def handle(self):
        # Email 公共参数
        email = self.form_data['email']
        password = self.form_data['password']
        imap_host = self.form_data['imap_host']
        imap_port = self.form_data['imap_port']
        secure = self.form_data.get('secure', False)
        client = tools.IMAPClient(email, password, imap_host, imap_port, secure=secure)

        # Email 拉取参数
        charset = self.form_data.get('charset', 'utf-8')
        unseen = self.form_data.get('unseen')
        before = self.form_data.get('before')
        since = self.form_data.get('since')
        size_limit = self.form_data.get('size_limit', 200 * 1024)
        sent_from = self.form_data.get('sent_from')
        sent_to = self.form_data.get('sent_to')
        subject = self.form_data.get('subject')
        index = self.form_data.get('index')
        limit = self.form_data.get('limit')

        result = client.request(charset, unseen, before, since, size_limit, sent_from, sent_to, subject, index, limit)
        self.response.payload = result
