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


EngineErrorCodes = enum(
    E1304000_DEFAULT_CODE=1304000,
    E1304001_DATABASE_ERROR=1304001,
    E1304101_PAASAGENT_ERROR=1304101,
    E1304102_PAASAGENT_INACTIVEATED_ERROR=1304102,
    E1304103_PAASAGENT_UNAUTHORIZED_ERROR=1304103,
    E1304104_PAASAGENT_NOTSTARTED_ERROR=1304104,
    E1304201_RABBITMQ_ERROR=1304201,
    E1304202_RABBITMQ_INACTIVEATED_ERROR=1304202,
    E1304203_RABBITMQ_UNAUTHORIZED_ERROR=1304203,
    E1304301_ASSIGN_SERVER_ERROR=1304301,
    E1304302_ASSIGN_PORT_ERROR=1304302,
    E1304401_ROUTER_ERROR=1304401,
)
