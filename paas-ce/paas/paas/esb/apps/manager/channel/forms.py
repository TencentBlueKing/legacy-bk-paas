# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

import re
import json

from django import forms
from django.utils.translation import ugettext as _

from esb.bkcore.models import ESBChannel, ComponentSystem
from esb.common.base_utils import smart_int


class ESBChannelForm(forms.ModelForm):
    """Form for ESBChannel"""

    TYPE_CHOICE = (
        (1, _(u'执行API')),
        (2, _(u'查询API')),
    )
    PERM_LEVEL_CHOICE = (
        (0, _(u'无限制')),
        (1, _(u'普通权限')),
    )

    component_system = forms.ModelChoiceField(
        label=_(u'所属系统'),
        queryset=ComponentSystem.objects.all(),
        required=True,
        empty_label=None,
    )
    path = forms.RegexField(
        label=_(u'通道路径'),
        max_length=255,
        required=True,
        regex=r'^/[/a-zA-Z0-9_-]+$',
        help_text=_(u'通道路径，以斜杠开头，只能包含斜杠、字母、数字、下划线(_)、连接符(-)，一般设置为"/system_name/component_name/"，例如"/host/get_host_list/"；通道路径需唯一'),  # noqa
        error_messages={
            'invalid': _(u'输入的通道路径不符合要求')
        }
    )
    component_codename = forms.RegexField(
        label=_(u'对应组件代号'),
        max_length=255,
        required=True,
        regex=r'^[a-z][a-z0-9._]+[a-z0-9_]$',
        help_text=_(u'组件代号，只能包含小写字母、数字、下划线或点号，由三部分组成："前缀(generic).系统名小写.组件类名小写"，例如 "generic.host.get_host_list"'),  # noqa
        error_messages={
            'invalid': _(u'输入的组件代号不符合要求')
        }
    )
    timeout_time = forms.IntegerField(
        label=_(u'超时时长'),
        required=False,
        error_messages={
            'invalid': _(u'输入格式不正确')
        },
        min_value=1,
        max_value=86400,
        initial=None,
        help_text=_(u'单位秒，未设置时以所属系统超时时长为准'),
        widget=forms.NumberInput(attrs={'style': 'width: 450px;'})
    )
    type = forms.ChoiceField(
        label=_(u'API类型'),
        choices=TYPE_CHOICE,
        required=True,
        initial=2,
    )

    class Meta:
        model = ESBChannel
        # component_system 需要放在前面，name 和 component_codename 参数校验，依赖它的值
        fields = ['component_system', 'name', 'path', 'component_codename',
                  'is_active', 'timeout_time', 'type', 'comp_conf', 'component_name',
                  'rate_limit_required', 'rate_limit_conf']

    def clean_path(self):
        path = self.cleaned_data['path']
        path = '/%s/' % path.strip('/')

        if ESBChannel.objects.filter(path=path).exists():
            raise forms.ValidationError(_(u'通道路径已存在'))
        return path

    def clean_component_codename(self):
        component_codename = self.cleaned_data['component_codename']
        component_system = self.cleaned_data.get('component_system')

        if not component_system:
            return component_codename

        if self.instance and self.instance.component_codename == component_codename:
            return component_codename

        if not re.match(r'^generic\.%s\.[a-z][a-z0-9_]*$' % component_system.name.lower(), component_codename):
            raise forms.ValidationError(_(u'输入的组件代号不符合要求'))

        return component_codename

    def clean_component_name(self):
        component_codename = self.cleaned_data.get('component_codename')
        if not component_codename:
            return ''
        return component_codename.rsplit('.', 1)[1]

    def clean_rate_limit_conf(self):
        max_allowed_requests = smart_int(self.data.get('max_allowed_requests'))
        rate_limit_conf_unit = self.data.get('rate_limit_conf_unit')
        if max_allowed_requests is None or not rate_limit_conf_unit:
            return ''
        rate_limit_conf = {
            'app_ratelimit': {
                '__default': [{'tokens': max_allowed_requests, rate_limit_conf_unit: 1}]
            }
        }
        return json.dumps(rate_limit_conf)

    def clean(self):
        data = self.cleaned_data
        for key, val in data.iteritems():
            if isinstance(val, basestring):
                data[key] = val.strip()
        return data


class EditESBChannelForm(ESBChannelForm):

    def clean_path(self):
        path = self.cleaned_data['path']
        path = '/%s/' % path.strip('/')

        if ESBChannel.objects.exclude(id=self.instance.id).filter(path=path).exists():
            raise forms.ValidationError(_(u'通道路径已存在'))
        return path
