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


from __future__ import unicode_literals

from common.constants import enum

ApiErrorCodeEnum = enum(
    SUCCESS="00",
    PARAM_NOT_VALID="1200",
    USER_NOT_EXISTS="1201",
    # 做兼容
    USER_NOT_EXISTS2="1300",
    USER_INFO_UPDATE_FAIL="1202",
)

ApiErrorCodeEnumV2 = enum(
    SUCCESS=0,
    PARAM_NOT_VALID=1302100,
    USER_NOT_EXISTS=1302101,
    USER_INFO_UPDATE_FAIL=1302102,
    USER_NOT_EXISTS2=1302103,
)

ApiErrorCodeEnumV3 = enum(
    SUCCESS=0,
    PARAM_NOT_VALID=1302100,
    USER_NOT_EXISTS=1302101,
    USER_INFO_UPDATE_FAIL=1302102,
    USER_NOT_EXISTS2=1302103,
    RESOUCE_OWNER_MISMATCH=1302200,
)
