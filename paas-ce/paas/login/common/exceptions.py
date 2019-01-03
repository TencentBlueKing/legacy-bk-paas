# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
from __future__ import unicode_literals

from common.constants import enum


LoginErrorCodes = enum(
    E1302000_DEFAULT_CODE=1302000,
    E1302001_BASE_SETTINGS_ERROR=1302001,
    E1302002_BASE_DATABASE_ERROR=1302002,
    E1302003_BASE_HTTP_DEPENDENCE_ERROR=1302003,
    E1302004_BASE_BKSUITE_DATABASE_ERROR=1302004,
    E1302005_BASE_LICENSE_ERROR=1302005,
    E1302006_ENTERPRISE_LOGIN_ERROR=1302006,
)
