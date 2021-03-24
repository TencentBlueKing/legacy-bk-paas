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


def enum(**enums):
    return type("Enum", (), enums)


DATETIME_FORMAT_STRING = "%Y-%m-%d %H:%M:%S"

LICENSE_VAILD_CACHE_KEY = "BK_LICENSE_VALID"


# 用户管理与登录自身提供的用户信息字段KeyMap
USERMGR_BKLOGIN_FIELD_MAP = {
    "display_name": "chname",
    "telephone": "phone",
    "wx_id": "wx_userid",
    "email": "email",
    "role": "role",
    "language": "language",
    "time_zone": "time_zone",
    "qq": "qq",
}

BKLOGIN_USERMGR_FIELD_MAP = dict((v, k) for k, v in list(USERMGR_BKLOGIN_FIELD_MAP.items()))
