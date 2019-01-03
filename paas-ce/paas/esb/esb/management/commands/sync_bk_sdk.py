# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
"""
生成最新SDK
"""
from django.core.management.base import BaseCommand

from apps.sdk_management.utils import SDKGenerator
from esb.management.utils import conf_tools

import logging
logger = logging.getLogger(__name__)


class Command(BaseCommand):

    def handle(self, *args, **options):
        conf_client = conf_tools.ConfClient()
        sdk_channels = conf_client.default_channels
        for system_name, system_channels in conf_client.confapis_channels.iteritems():
            sdk_channels.setdefault(system_name, [])
            sdk_channels[system_name].extend(system_channels)

        sdk_generator = SDKGenerator(channels=sdk_channels)
        sdk_generator.generate_files_for_sdk()
        logger.info('generate open_pass_esb sdk files to %s' % sdk_generator.get_target_dir())
