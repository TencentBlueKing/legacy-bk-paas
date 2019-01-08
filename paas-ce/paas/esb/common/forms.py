# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
"""
Bases for Component Forms
"""
import re
import json

from django import forms
from django.core import validators
from django.core.exceptions import ValidationError
from django.utils.encoding import force_unicode, smart_unicode
from django.forms import Field
from django.forms.utils import ErrorDict

from common.base_utils import FancyDict, str_bool
from common.errors import CommonAPIError


def get_error_prompt(form):
    """
    Get error messages for form
    """
    content = []
    fields = form.fields.keys()
    for k, v in sorted(form.errors.items(), key=lambda x: fields.index(x[0])
                       if x[0] in fields else -1):
        _msg = force_unicode(v[0])
        b_field = form._safe_get_field(k)
        # Get the default error messages
        messages = {}
        if b_field:
            for c in reversed(b_field.field.__class__.__mro__):
                messages.update(getattr(c, 'default_error_messages', {}))

        if b_field and _msg in messages.values():
            content.append(u'%s [%s] %s' % (b_field.label, b_field.name, _msg))
        else:
            content.append(u'%s' % _msg)
    return force_unicode(content[0])


class BaseComponentForm(forms.Form):
    """
    Base class for component form with some useful methods
    """
    field_collections = ()

    def __init__(self, *args, **kwargs):
        super(BaseComponentForm, self).__init__(*args, **kwargs)
        for collection in self.field_collections:
            for name, field in collection.fields:
                self.fields[name] = field

    get_error_prompt = get_error_prompt

    def _safe_get_field(self, field):
        return self[field] if field in self.fields else None

    @property
    def fancy_cleaned_data(self):
        return FancyDict(self.cleaned_data)

    def clean(self):
        data = super(BaseComponentForm, self).clean()
        for collection in self.field_collections:
            collection.refine_data(data)
        return data

    @classmethod
    def from_request(cls, request):
        if hasattr(request, 'g'):
            return cls(request.g.kwargs)
        return cls(request.kwargs)

    def get_cleaned_data_or_error(self, status=None):
        """
        获取当前form的cleaned data，如果验证不通过，直接抛出CommonAPIError
        """
        if self.is_valid():
            return self.cleaned_data
        else:
            raise CommonAPIError(self.get_error_prompt(), status=status)

    def full_clean(self):
        """
        Cleans all of self.data and populates self._errors and
        self.cleaned_data.
        """
        self._errors = ErrorDict()
        # Stop further processing.
        if not self.is_bound:
            return
        self.cleaned_data = {}
        # If the form is permitted to be empty, and none of the form data has
        # changed from the initial data, short circuit any validation.
        if self.empty_permitted and not self.has_changed():
            return
        self._clean_fields()
        # UPDATE: 如果输入数据通过不了field本身的校验，直接返回错误信息，
        # 不进行接下来的验证
        if not self.is_valid():
            return

        self._clean_form()
        self._post_clean()
        if self._errors:
            del self.cleaned_data

    def get_cleaned_data_when_exist(self, keys=[]):
        """
        Get cleaned_data of key when key in self.data
        """
        keys = keys or self.fields.keys()
        if isinstance(keys, dict):
            return dict([
                (key_dst, self.cleaned_data[key_src])
                for key_src, key_dst in keys.items()
                if key_src in self.data
            ])
        else:
            return dict([
                (key, self.cleaned_data[key])
                for key in keys
                if key in self.data
            ])


# Fields

class ListField(Field):
    """
    列表Field，目前支持使用逗号、分号分隔列表
    """
    default_error_messages = {
        'invalid_list': 'Must be a list',
    }
    delimiter = re.compile(r'[^,;\n\r ]+')

    def __init__(self, delimiter='', *args, **kwargs):
        if delimiter:
            self.delimiter = re.compile(delimiter)
        super(ListField, self).__init__(*args, **kwargs)

    def to_python_unicode(self, value):
        "Returns a Unicode object."
        if value in validators.EMPTY_VALUES:
            return ''
        return smart_unicode(value)

    def to_python(self, value):
        # 如果传入的数据类型本身就是list（ 比如用json loads过来的数据结构来校验），直接返回
        if isinstance(value, (list, tuple)):
            return list(value)

        # 尝试转换JSON格式的list
        try:
            result = json.loads(value)
            if isinstance(result, list):
                return result
        except Exception:
            pass

        value = self.to_python_unicode(value).strip()
        if not value:
            return []
        return self.delimiter.findall(value)


class TypeCheckField(Field):
    """
    进行参数类型校验的Field
    """
    invalid_type_msg = 'Must be the specified parameter data type'
    default_error_messages = {
        'invalid_list_type': '%s list' % invalid_type_msg,
        'invalid_dict_type': '%s dict' % invalid_type_msg,
        'invalid_type': invalid_type_msg,
    }

    def __init__(self, promise_type=None, *args, **kwargs):
        self.promise_type = promise_type
        super(TypeCheckField, self).__init__(*args, **kwargs)

    def to_python(self, value):
        if value in validators.EMPTY_VALUES:
            return self.promise_type()

        if self.promise_type and not isinstance(value, self.promise_type):
            if self.promise_type in [list, dict]:
                raise ValidationError('%s %s' % (self.invalid_type_msg, self.promise_type.__name__))
            else:
                raise ValidationError(self.invalid_type_msg)

        return value


class DefaultBooleanField(Field):
    """
    Similiar to `forms.BooleanField` but with a default value True.
    """
    def __init__(self, default=False, *args, **kwargs):
        self.default = default
        super(DefaultBooleanField, self).__init__(*args, **kwargs)

    def to_python(self, value):
        """Returns a Python boolean object."""
        value = super(DefaultBooleanField, self).to_python(value)
        if value in validators.EMPTY_VALUES:
            return self.default

        value = str_bool(value)
        return value
