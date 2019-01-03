# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
import json
import textwrap

import markdown
from django.template import engines
from django.utils import translation

from common.constants import API_TYPE_Q, API_TYPE_OP
from common.base_utils import get_md5, smart_unicode
from esb.bkcore.models import ComponentAPIDoc, ESBChannel
from esb.management.utils import component_tools
from esb.utils import config


class ApiDocManager(object):

    def __init__(self):
        self.is_update_all_api_doc = False
        self.all_doc_md_md5 = self.get_all_doc_md_md5()

    def get_api_doc(self, channel):
        api_doc = APIDoc(channel)
        api_doc_info = api_doc.get_doc_info()

        old_doc_md_md5 = self.get_old_doc_md5(channel.path)
        if not (self.is_update_all_api_doc or api_doc.is_doc_changed(old_doc_md_md5)):
            raise DocNotChangedException
        return api_doc_info

    def get_old_doc_md5(self, path):
        return self.all_doc_md_md5.get(path)

    def get_all_doc_md_md5(self):
        components = ESBChannel.objects.values_list('id', 'path')
        components = dict(components)
        all_doc_md_md5 = {}
        api_docs = ComponentAPIDoc.objects.values('component_id', 'doc_md_md5')
        for api_doc in api_docs:
            component_id = api_doc['component_id']
            key = components.get(component_id)
            if not key:
                continue
            all_doc_md_md5[key] = api_doc['doc_md_md5']
        return all_doc_md_md5


API_PATH = u"""
### {{ _("请求地址") }}

{{ api_path }}

"""

API_METHOD = u"""
### {{ _("请求方法") }}

{{ api_method }}

"""


class APIDoc(object):

    def __init__(self, channel):
        self.jinja2_engine = engines['jinja2']
        self.jinja2_context = {}

        self.channel = channel
        self.api_path = self.channel.api_path
        self.api_data = self.get_api_data()

        self.update_doc_md()
        self.raw_doc_md_md5 = self.get_raw_doc_md_md5()

    def get_doc_info(self):
        return {
            'doc_md': self.doc_md,
            'doc_html': self.get_doc_html(),
            # 用于计算原始文档的 md5
            'raw_doc_md_md5': self.raw_doc_md_md5,
            'system_name': self.api_data['system_name'],
            'component_name': self.api_data['component_name'],
        }

    def get_api_data(self):
        if self.channel.is_confapi:
            channel_conf = self.get_channel_conf()
            component_client = component_tools.ConfapiComponentClient(
                channel_conf, comp_codename=self.channel.component_codename)
        else:
            component_client = component_tools.ComponentClient(
                comp_codename=self.channel.component_codename)
        return component_client.get_info()

    def get_channel_conf(self):
        extra_info = self.channel.extra_info_json()
        return {
            'comp_codename': self.channel.component_codename,
            'comp_conf': {
                'name': self.channel.component_name,
                'label': self.channel.name,
                'suggest_method': extra_info.get('suggest_method', ''),
                'api_type': API_TYPE_Q if self.channel.type == 2 else API_TYPE_OP,
            }
        }

    def get_doc_html(self):
        doc_html = {}
        for language, _doc_md in self.doc_md.items():
            doc_html[language] = self.format_md_to_html(_doc_md)
        return doc_html

    def get_raw_doc_md_md5(self):
        return get_md5(json.dumps(self.doc_md))

    def is_doc_changed(self, old_doc_md_md5):
        return old_doc_md_md5 != self.raw_doc_md_md5

    def update_doc_md(self):
        doc_md = {}
        for language, _doc_md in self.api_data['doc_md'].items():
            with translation.override(language):
                common_args_desc = self.get_doc_common_args()
                self.jinja2_context['common_args_desc'] = textwrap.dedent(common_args_desc)

                _doc_md = textwrap.dedent(_doc_md).strip()
                _doc_md = self.clear_api_flag(_doc_md)
                _doc_md = self.add_api_method(_doc_md)
                _doc_md = self.add_url(_doc_md)
                _doc_md = self.format(_doc_md, self.jinja2_context)

                doc_md[language] = _doc_md
        self.doc_md = doc_md

    def clear_api_flag(self, doc_md):
        doc_md = doc_md.splitlines()
        for index, line in enumerate(doc_md):
            if line.startswith('api'):
                doc_md[index] = ''
            else:
                break
        return '\n'.join(doc_md).strip()

    def add_url(self, doc_md):
        self.jinja2_context['api_path'] = self.api_path
        return self.insert_to_doc_md(doc_md, API_PATH)

    def add_api_method(self, doc_md):
        api_method = self.api_data['suggest_method'].upper()
        if not api_method:
            return doc_md
        self.jinja2_context['api_method'] = api_method
        return self.insert_to_doc_md(doc_md, API_METHOD)

    def insert_to_doc_md(self, doc_md, content):
        return u'%s\n%s' % (smart_unicode(content), doc_md)

    def format(self, content, context):
        return self.jinja2_engine.from_string(content).render(context=context)

    def format_md_to_html(self, doc_md):
        doc_html = markdown.markdown(
            doc_md,
            extensions=[
                'tables',
                'attr_list',
                'fenced_code',
                'smart_strong',
                'codehilite',
                'toc'
            ],
        )
        return doc_html

    def get_doc_common_args(self):
        doc_common_args = config.ESB_CONFIG['config'].get('doc_common_args', '')
        return self.jinja2_engine.from_string(doc_common_args).render().replace('&gt;', '>')


class DocNotChangedException(Exception):
    pass
