# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

from __future__ import unicode_literals

from django.utils.translation import ugettext_lazy as _

from common.constants import ModeEnum

ENV_MODE_TYPE_CHOICES = [
    (ModeEnum.ALL.value, _('所有环境')),
    (ModeEnum.TEST.value, _('测试环境')),
    (ModeEnum.PROD.value, _('正式环境')),
]


def gen_mode_choice_html():
    mode_choices_html = ['<select class="form-control env_mode">']
    for key, value in ENV_MODE_TYPE_CHOICES:
        mode_choices_html.append(u'<option value="{key}" > {value} </option>'.format(key=key, value=value))
    mode_choices_html.append('<select>')
    return ''.join(mode_choices_html)


MODE_CHOICE_HTML = gen_mode_choice_html()
