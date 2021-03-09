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


from common.log import logger
from common.bk_iam import Permission

from django.dispatch import Signal
from django.dispatch import receiver


_app_creator_permission = Signal(providing_args=["app_code", "app_name", "username"])


@receiver(_app_creator_permission)
def apply_app_creator_permission(sender, **kwargs):
    try:
        kwargs.pop("signal")
        Permission().apply_app_developer_permission(**kwargs)
    except Exception:
        logger.exception("apply_app_creator_permission fali")
        logger.error("args=%s", kwargs)
