# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
import requests
from . import imap

rpool = requests.Session()


class HttpClient(object):

    def request(self, method, url, **kwargs):
        # 超时时间必须ESB控制
        kwargs['timeout'] = 5

        try:
            resp = rpool.request(method, url, **kwargs)
            result = {'result': True, 'data': resp.content}
        except Exception as error:
            result = {'result': False, 'message': '%s' % error}

        return result


class IMAPClient(object):

    def __init__(self, email, password, imap_host, imap_port, secure=False):
        self.client = imap.MailPoller(email, password, imap_host, imap_port, secure=secure)

    def request(self, charset=None, unseen=None, before=None, since=None, size_limit=None, sent_from=None,
                sent_to=None, subject=None, index=None, limit=None):
        try:
            data = self.client.fetch_by(
                charset, unseen, before, since, size_limit, sent_from, sent_to, subject, index, limit)
            result = {'result': True, 'data': data}
        except Exception as error:
            result = {'result': False, 'message': '%s' % error}

        return result
