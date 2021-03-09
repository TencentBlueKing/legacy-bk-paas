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


from audit.signals import _record_audit_log


def record_audit_log(
    system,
    username,
    op_type,
    op_object_type,
    op_object_id,
    op_object_name,
    data_before=None,
    data_after=None,
    comment=None,
):

    data = {
        "system": system,
        "username": username,
        "op_type": op_type,
        "op_object_type": op_object_type,
        "op_object_id": op_object_id,
        "op_object_name": op_object_name,
    }

    if data_before is not None:
        data["data_before"] = data_before
    if data_after is not None:
        data["data_after"] = data_after

    _record_audit_log.send(sender="open_paas", **data)
