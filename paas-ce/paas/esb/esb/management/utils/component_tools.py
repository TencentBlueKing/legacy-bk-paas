# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
import re

from django.utils import translation
from django.template import engines

from esb.component.base import get_components_manager
from esb.utils.confapis import get_confapis_manager


class ComponentClient(object):

    is_confapi = False

    def __init__(self, comp_codename=None, comp_class=None):
        """
        :param comp_codename or comp_class
        """
        self.comp_codename = comp_codename
        self.comp_class = comp_class

        if not self.comp_class:
            self.comp_class = self.get_comp_class(self.comp_codename)

        self.system_name = self.get_system_name()
        self.component_name = self.get_component_name()
        self.comp_doc = self.get_comp_doc()

    def __str__(self):
        return '<%s-%s>' % (self.system_name, self.component_name)

    def get_info(self):
        return {
            'system_name': self.system_name,
            'component_name': self.component_name,
            'component_label': self.get_component_label(),
            'component_type': self.get_api_type(),
            'suggest_method': self.get_suggest_method(),
            'comp_doc': self.comp_doc,
            'doc_md': self.get_comp_doc_md(),
            'is_confapi': self.is_confapi,
            'label_en': self.get_component_label_en(),
        }

    def get_comp_class(self, comp_codename):
        components_manager = get_components_manager()
        comp_class = components_manager.get_comp_by_name(comp_codename)
        if not comp_class:
            raise Exception("Can't find component class of %s" % comp_codename)
        return comp_class

    def get_system_name(self):
        return self.comp_class.sys_name

    def get_component_name(self):
        return self.comp_class.get_component_name()

    def get_api_type(self):
        return self.comp_class.api_type

    def get_component_label(self):
        api_label = re.search(r'apiLabel\s*(.+)', self.comp_doc)
        if api_label:
            api_label = api_label.group(1).strip()
        if not api_label:
            return self.component_name

        with translation.override('zh-hans'):
            api_label = engines['jinja2'].from_string(api_label).render()

        return api_label

    def get_component_label_en(self):
        return ''

    def get_suggest_method(self):
        api_method = re.search(r'apiMethod\s*(.+)', self.comp_doc)
        if api_method:
            api_method = api_method.group(1).strip()
        if not api_method:
            return ''
        return api_method.upper()

    def get_comp_doc(self):
        comp_doc = self.comp_class.__doc__ or ''
        return comp_doc if isinstance(comp_doc, unicode) else comp_doc.decode('utf-8')

    def get_comp_doc_md(self):
        return {
            'en': self.comp_doc,
            'zh-hans': self.comp_doc,
        }


class ConfapiComponentClient(ComponentClient):

    is_confapi = True

    def __init__(self, channel_conf, comp_codename=None, comp_class=None):
        self.channel_conf = channel_conf
        self.component_conf = self.channel_conf['comp_conf']
        self.confapis_manager = get_confapis_manager()
        super(ConfapiComponentClient, self).__init__(comp_codename, comp_class)

    def get_component_name(self):
        return self.component_conf['name']

    def get_component_label(self):
        return self.component_conf['label']

    def get_component_label_en(self):
        return self.component_conf.get('label_en', '')

    def get_suggest_method(self):
        return self.component_conf['suggest_method'].upper()

    def get_api_type(self):
        return self.component_conf.get('api_type') or self.comp_class.api_type

    def get_comp_doc(self):
        return ''

    def get_comp_doc_md(self):
        """
        :return:
        {
            'en': '',
            'zh-hans': '',
        }
        """
        system_name = self.get_system_name().lower()
        component_name = self.get_component_name()
        return self.confapis_manager.get_apidoc(system_name, component_name)
