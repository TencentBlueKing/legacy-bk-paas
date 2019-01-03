# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

"""
Copyright © 2012-2017 Tencent BlueKing. All Rights Reserved. 蓝鲸智云 版权所有
"""
from django import forms
from django.utils.translation import ugettext as _

from esb.bkcore.models import ESBBuffetComponent, ESBBuffetMapping, ComponentSystem


def clean_data(data):
    for key, val in data.iteritems():
        if isinstance(val, basestring):
            data[key] = val.strip()
    return data


class ESBBuffetComponentForm(forms.Form):
    """Form for ESBBuffetComponent"""

    HTTP_METHOD_CHOICES = (
        ('GET', 'GET'),
        ('POST', 'POST'),
        # ('_ORIG', u'[所有] 透传原始请求类型(不建议使用)'),
    )

    FAVOR_CTYPE_CHOICES = (
        ('json', 'json'),
        ('form', 'form'),
    )

    TYPE_CHOICE = (
        (1, _(u'执行API')),
        (2, _(u'查询API')),
    )

    name = forms.CharField(label=_(u'API名称'), max_length=256, required=True)
    system = forms.ModelChoiceField(
        label=_(u'所属系统'),
        queryset=ComponentSystem.objects.all(),
        required=True,
        empty_label=None,
    )

    dest_url = forms.URLField(
        label=_(u'目标接口地址'),
        required=True,
        max_length=2048,
        help_text=_(u'可使用 http://domain.com/users/{username}/ 形式的路径变量')
    )
    dest_http_method = forms.ChoiceField(
        label=_(u'目标接口请求类型'),
        choices=HTTP_METHOD_CHOICES,
        required=True,
    )
    favor_post_ctype = forms.ChoiceField(
        label=_(u'编码POST参数方式'),
        choices=FAVOR_CTYPE_CHOICES,
        required=False,
        help_text=_(u'默认使用 json 编码请求参数，选择 form 后使用 form-urlencoded 编码')
    )
    extra_headers = forms.CharField(
        label=_(u'额外请求头信息'),
        required=False,
        widget=forms.HiddenInput()
    )
    extra_params = forms.CharField(
        label=_(u'额外请求参数'),
        required=False,
        widget=forms.HiddenInput()
    )

    registed_path = forms.RegexField(
        label=_(u'注册到的API路径'),
        regex=r'^/[/a-zA-Z0-9_{}-]+$',
        help_text=_(u'以斜杠开头，只能包含斜杠、大小写字母、数字、下划线，如："/host/get_host_list/"，可额外包含路径变量，如 "/users/{username}/"；注册到的请求类型+注册到的API路径，在自助接入中需全局唯一'),  # noqa
        required=True,
        max_length=255,
        error_messages={
            'invalid': _(u'输入的路径不符合要求'),
        })
    registed_http_method = forms.ChoiceField(
        label=_(u'注册到的请求类型'),
        choices=HTTP_METHOD_CHOICES,
        required=True
    )

    mappings_input = forms.ModelChoiceField(
        label=_(u'对请求参数应用mapping'),
        queryset=ESBBuffetMapping.objects.all(),
        required=False
    )
    mappings_output = forms.ModelChoiceField(
        label=_(u'对返回结果应用mapping'),
        queryset=ESBBuffetMapping.objects.all(),
        required=False
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

    def clean(self):
        data = clean_data(self.cleaned_data)
        method = data.get('registed_http_method', '')
        value = data.get('registed_path', '')
        value = '/%s/' % value.strip('/')
        data['registed_path'] = value

        if ESBBuffetComponent.objects.filter(
                registed_path=value, registed_http_method=method).exists():
            self._errors['registed_path'] = self.error_class([_(u'路径 %s 已经被占用了，请修改') % value])
            del data['registed_path']
        return data


class EditESBBuffetComponentForm(ESBBuffetComponentForm):

    id = forms.IntegerField(label='ID', widget=forms.HiddenInput())

    def clean(self):
        data = clean_data(self.cleaned_data)
        value = data.get('registed_path', '')
        method = data.get('registed_http_method', '')
        id = data['id']

        value = '/%s/' % value.strip('/')
        data['registed_path'] = value

        if ESBBuffetComponent.objects.exclude(id=id).filter(
                registed_path=value, registed_http_method=method).exists():
            self._errors['registed_path'] = self.error_class([_(u'路径 %s 已经被占用了，请修改') % value])
            del data['registed_path']
        return data


class ESBBuffetMappingForm(forms.Form):

    SOURCE_TYPE_CHOICES = [
        (1, 'jinja2'),
    ]

    name = forms.CharField(label=u'名称', max_length=40, required=True)
    source_type = forms.ChoiceField(
        label=u'源码类型', choices=SOURCE_TYPE_CHOICES, required=True,
        help_text=(u'目前只支持使用 Jinja2 模板作为 Mappings')
    )
    source = forms.CharField(label=u'源码', required=True, widget=forms.Textarea())

    def clean(self):
        data = clean_data(self.cleaned_data)
        name = data.get('name') or ''
        if ESBBuffetMapping.objects.filter(name=name).exists():
            self._errors['name'] = self.error_class([u'名称 {0} 已被占用，请修改'.format(name)])
            del data['name']
        return data


class EditESBBuffetMappingForm(ESBBuffetMappingForm):
    id = forms.IntegerField(label='ID', widget=forms.HiddenInput())

    def clean(self):
        data = clean_data(self.cleaned_data)
        id = data['id']
        name = data['name']
        if ESBBuffetMapping.objects.exclude(id=id).filter(name=name).exists():
            self._errors['name'] = self.error_class([u'名称 {0} 已被占用，请修改'.format(name)])
            del data['name']
        return data
