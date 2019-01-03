# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
from importlib import import_module

from django.conf import settings


# 保存目前运行的components的配置
ESB_CONFIG = None


def load_config(*args, **kwargs):
    """加载config
    """
    global ESB_CONFIG

    config = real_load_config(*args, **kwargs)

    ESB_CONFIG = config
    return config


def real_load_config():
    """Load config dict by run_version
    """
    # 直接从配置文件中加载config
    module_name, config_name = settings.ESB_SITE_ESB_CONF.rsplit('.', 1)
    config = getattr(import_module(module_name), config_name, None)
    return config
