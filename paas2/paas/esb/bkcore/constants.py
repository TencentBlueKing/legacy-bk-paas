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


# 此配置用于在 migrations 中向 DB 同步数据，此方案已不推荐，不要通过更新此配置同步数据
# 目前，同步数据采用在 esb 项目中开发 django command 的方案
FUNCTION_CONTROLLERS = [
    {
        "func_code": "user_auth::skip_user_auth",
        "func_name": _(u"是否跳过用户身份验证"),
        "wlist": "bk_paas_log_alert",
    }
]


DEFAULT_DOC_CATEGORY = _(u"默认分类")
