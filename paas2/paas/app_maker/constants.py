# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS
Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License.
You may obtain a copy of the License at http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
specific language governing permissions and limitations under the License.
"""

from django.utils.translation import ugettext as _

import re

APP_MAKER_CODE_CONNECTOR = "_"
APP_MAKER_CODE_CHECK_PATTERN = re.compile(r"^[a-z][a-z0-9_]{1,15}$")
APP_MAKER_CODE_CHECK_MSG = _(u"轻应用ID只允许小写英文字母,下划线或数字,并且以字母开头")
