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

import re

from .base_utils import ChoicesEnum


RE_PATH_VARIABLE = re.compile(r"\{([A-Za-z0-9_-]+)\}")
RE_PATH_STAGE_VARIABLE = re.compile(r"\{stageVariables\.([A-Za-z0-9_-]+)\}")


class ApiTypeEnum(ChoicesEnum):

    ESB = 0
    OFFICIAL_API = 1

    CLOUDS_DMZ_API = 10
    CLOUDS_API = 11

    _choices_labels = (
        (ESB, u"ESB"),
        (OFFICIAL_API, u"官方云API"),
        (CLOUDS_DMZ_API, u"云API[隔离区]"),
        (CLOUDS_API, u"云API[非隔离区]"),
    )
