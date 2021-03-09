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

from django.conf import settings

from esb.utils import SmartHost


SYSTEM_NAME = "DATA"

host = SmartHost(
    host_prod=getattr(settings, "HOST_DATA", ""),
)

bksql_host = SmartHost(
    host_prod=getattr(settings, "DATA_BKSQL_HOST", ""),
)

processorapi_host = SmartHost(
    host_prod=getattr(settings, "DATA_PROCESSORAPI_HOST", ""),
)

modelflow_host = SmartHost(host_prod=getattr(settings, "DATA_MODELFLOW_HOST", ""))

v3_dest_host_map = {
    "auth": getattr(settings, "DATAV3_AUTHAPI_HOST", ""),
    "access": getattr(settings, "DATAV3_ACCESSAPI_HOST", ""),
    "databus": getattr(settings, "DATAV3_DATABUSAPI_HOST", ""),
    "dataflow": getattr(settings, "DATAV3_DATAFLOWAPI_HOST", ""),
    "datamanage": getattr(settings, "DATAV3_DATAMANAGEAPI_HOST", ""),
    "dataquery": getattr(settings, "DATAV3_DATAQUERYAPI_HOST", ""),
    "meta": getattr(settings, "DATAV3_METAAPI_HOST", ""),
    "storekit": getattr(settings, "DATAV3_STOREKITAPI_HOST", ""),
    "bksql": getattr(settings, "DATAV3_BKSQL_HOST", ""),
    "model": getattr(settings, "DATAV3_MODELAPI_HOST", ""),
    "datacube": getattr(settings, "DATAV3_DATACUBEAPI_HOST", ""),
    "algorithm": getattr(settings, "DATAV3_ALGORITHMAPI_HOST", ""),
    "queryengine": getattr(settings, "DATAV3_QUERYENGINEAPI_HOST", ""),
    "datalab": getattr(settings, "DATAV3_DATALABAPI_HOST", ""),
}
