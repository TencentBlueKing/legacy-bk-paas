# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
"""
update system and channel data to db
"""
from django.core.management.base import BaseCommand


class Command(BaseCommand):

    def handle(self, *args, **options):
        from esb.management.commands import sync_function_controller
        sync_function_controller.Command().handle()

        from esb.management.commands import sync_system_and_channel_data
        sync_system_and_channel_data.Command().handle(force=False)

        from esb.management.commands import sync_api_docs
        sync_api_docs.Command().handle(all=False)
