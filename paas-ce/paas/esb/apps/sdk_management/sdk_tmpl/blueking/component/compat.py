# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
import sys

_ver = sys.version_info

is_py2 = (_ver[0] == 2)

is_py3 = (_ver[0] == 3)


if is_py2:
    from urlparse import urlparse

    str = unicode

elif is_py3:
    from urllib.parse import urlparse  # noqa

    str = str
