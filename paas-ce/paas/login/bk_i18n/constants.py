# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
from __future__ import unicode_literals

from bkaccount.constants import LanguageEnum


DJANGO_LANG_TO_BK_LANG = {
    'zh-hans': LanguageEnum.ZH_CN,
    'en': LanguageEnum.EN
}

BK_LANG_TO_DJANGO_LANG = {v: k for k, v in DJANGO_LANG_TO_BK_LANG.iteritems()}
