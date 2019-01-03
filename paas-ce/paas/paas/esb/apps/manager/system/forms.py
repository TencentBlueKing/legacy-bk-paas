# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

from django import forms
from django.utils.translation import ugettext as _

from esb.bkcore.models import ComponentSystem, ESBChannel, SystemDocCategory
from esb.bkcore.constants import DEFAULT_DOC_CATEGORY
from esb.configs.default import SYSTEM_DOC_CATEGORY

DEFAULT_SYSTEM_NAMES = ['CC', 'JOB', 'GSE', 'AUTH', 'BK_LOGIN', 'DATA', 'FTA', 'CMSI']


class ComponentSystemForm(forms.ModelForm):
    """Form for ComponentSystem"""

    name = forms.RegexField(
        label=_(u'系统名称'),
        regex=r'^[a-zA-Z][a-zA-Z0-9_]*$',
        required=True,
        max_length=32,
        error_messages={
            'invalid': _(u'输入的系统名称不符合要求')
        },
        help_text=_(u'系统唯一标识，由英文字母、下划线(_)或数字组成，并且以字母开头')
    )
    execute_timeout = forms.IntegerField(
        label=_(u'执行类超时时长'),
        required=False,
        error_messages={
            'invalid': _(u'输入格式不正确')
        },
        min_value=1,
        max_value=86400,
        help_text=_(u'单位秒，未设置时超时时长为30秒'),
        widget=forms.NumberInput(attrs={'style': 'width: 450px;'})
    )
    query_timeout = forms.IntegerField(
        label=_(u'查询类超时时长'),
        required=False,
        error_messages={
            'invalid': _(u'输入格式不正确')
        },
        min_value=1,
        max_value=86400,
        help_text=_(u'单位秒，未设置时超时时长为30秒'),
        widget=forms.NumberInput(attrs={'style': 'width: 450px;'})
    )
    remark = forms.CharField(
        label=_(u'备注'),
        required=False,
        widget=forms.Textarea(attrs={'rows': '5'}),
    )

    class Meta:
        model = ComponentSystem
        fields = ['name', 'label', 'interface_admin', 'remark', 'execute_timeout', 'query_timeout']

    def add_and_clean_doc_category(self):
        # 添加新分类
        doc_category_name = self.data.get('doc_category') or DEFAULT_DOC_CATEGORY
        category_name_map = dict([
            (category['label'], name)
            for name, category in SYSTEM_DOC_CATEGORY.iteritems()
        ])
        doc_category_name = category_name_map.get(doc_category_name) or doc_category_name
        obj, _ = SystemDocCategory.objects.get_or_create(name=doc_category_name)
        self.instance.doc_category_id = obj.id
        self.instance.save()
        # 清理不用的分类
        doc_category_ids = ComponentSystem.objects\
            .filter(doc_category_id__isnull=False)\
            .order_by('doc_category_id')\
            .values_list('doc_category_id', flat=True)\
            .distinct()
        SystemDocCategory.objects.exclude(id__in=doc_category_ids).delete()

    def clean(self):
        data = self.cleaned_data
        for key, val in data.iteritems():
            if isinstance(val, basestring):
                data[key] = val.strip()
        return data

    def clean_name(self):
        name = self.cleaned_data['name'].upper()
        if name in DEFAULT_SYSTEM_NAMES:
            raise forms.ValidationError(_(u'默认系统名称，不能使用'))
        if ComponentSystem.objects.filter(name=name).exists():
            raise forms.ValidationError(_(u'系统名称已存在'))
        return self.cleaned_data['name']


class EditComponentSystemForm(ComponentSystemForm):

    def clean_name(self):
        name = self.cleaned_data['name'].upper()
        if ComponentSystem.objects.exclude(id=self.instance.id).filter(name=name).exists():
            raise forms.ValidationError(_(u'系统名称已存在'))
        # 如果是默认系统，则系统名不能修改
        system_name = self.instance.name.upper()
        if system_name in DEFAULT_SYSTEM_NAMES and name != system_name:
            raise forms.ValidationError(_(u'默认系统名称，不能修改'))
        if name != system_name and ESBChannel.objects.filter(component_system=self.instance).exists():
            raise forms.ValidationError(_(u'系统下存在通道，不能修改'))
        return self.cleaned_data['name']
