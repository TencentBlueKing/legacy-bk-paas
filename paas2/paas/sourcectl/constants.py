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

from common.constants import enum


# 应用代码初始化模板
SourceInitTemplateEnum = enum(
    DJANGO_APP_FRAMEWORK="django_app_framework",  # django应用开发框架
    DJANGO_APP_FRAMEWORK_WITH_SAMPLE="django_app_framework_with_sample",  # django应用开发样例
    SPRING_BOOT_APP_FRAMEWORK="spring_boot_app_framework",  # spring-boot应用开发框架
    SPRING_BOOT_APP_FRAMEWORK_WITH_SAMPLE="spring_boot_app_framework_with_sample",  # spring-boot应用开发样例
)
