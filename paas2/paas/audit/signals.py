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
from audit.models import AuditEventLog

from django.dispatch import Signal
from django.dispatch import receiver


_record_audit_log = Signal(
    providing_args=[
        "system",
        "username",
        "op_type",
        "op_object_type",
        "op_object_id",
        "op_object_name",
        "data_before",
        "data_after",
        "comment",
    ]
)


@receiver(_record_audit_log)
def audit_log(sender, **kwargs):
    try:
        kwargs.pop("signal")
        AuditEventLog.objects.create(**kwargs)
    except Exception:
        logger.exception("log audit event log fail")
        logger.error("args=%s", kwargs)
