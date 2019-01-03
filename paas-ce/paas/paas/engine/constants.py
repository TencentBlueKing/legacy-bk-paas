# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

from __future__ import unicode_literals

from enum import Enum


class ServerCategoryEnum(Enum):
    TEST = "tapp"
    PROD = "app"


SERVER_CATEGORY_CHOICES = [
    (ServerCategoryEnum.TEST.value, "测试服务器"),
    (ServerCategoryEnum.PROD.value, "正式服务器"),
]


class ExternalServerCategoryEnum(Enum):
    MQ = "rabbitmq"


THIRD_SERVER_CATEGORY_CHOICES = [(ExternalServerCategoryEnum.MQ.value, "RabbitMQ服务"), ]
