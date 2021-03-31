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

from common.constants import FunctionControllerCodeEnum


FUNCTION_CONTROLLERS = [
    {
        "func_code": FunctionControllerCodeEnum.SKIP_USER_AUTH.value,
        "func_name": "Whether to skip user authentication",
        "wlist": (
            "bk_cmdb,bk_fta_solutions,bk_gse,bk_iam,bk_job,bk_monitor,bk_nodeman,"
            "bk_paas,bk_paas_log_alert,bk_usermgr,bk_sops,bk_log_search,bk_bklog,"
            "bk_paas3,bk_lesscode,bk_apigateway"
        ),
    }
]
