# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

import json

from django.utils.encoding import force_unicode
from django.http import HttpResponse
from django.shortcuts import _get_queryset
from django.utils import translation


def get_object_or_None(klass, *args, **kwargs):   # noqa
    """
    Uses get() to return an object or None if the object does not exist.

    klass may be a Model, Manager, or QuerySet object. All other passed
    arguments and keyword arguments are used in the get() query.

    Note: Like with get(), a MultipleObjectsReturned will be raised if more than one
    object is found.
    """
    queryset = _get_queryset(klass)
    try:
        return queryset.get(*args, **kwargs)
    except queryset.model.DoesNotExist:
        return None


class JsonResponse(HttpResponse):
    def __init__(self, content, *args, **kwargs):
        content = json.dumps(content, ensure_ascii=False)
        super(JsonResponse, self).__init__(
            content, content_type='application/json; charset=utf-8', *args, **kwargs)


def get_error_prompt(form):
    """Get error messages for form
    """
    content = []
    fields = form.fields.keys()
    for k, v in sorted(form.errors.items(), key=lambda x: fields.index(x[0])
                       if x[0] in fields else -1):
        _msg = force_unicode(v[0])
        b_field = form[k] if k in form.fields else None
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


def i18n_form(form):
    from django.utils.translation import ugettext as _
    fields = form.visible_fields()
    for field in fields:
        field.label = _(field.label)
        field.help_text = _(field.help_text)
        if getattr(field.field, 'choices', []):
            choices = [
                (value, _(label))
                for value, label in field.field.choices
            ]
            setattr(field.field, 'choices', choices)
    return form


def get_cur_language():
    cur_language = translation.get_language()
    if cur_language not in ['zh-hans']:
        cur_language = 'zh-hans'
    return cur_language
