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
from django.db import models

from components.constants import BK_SYSTEMS


class ComponentSystemManager(models.Manager):
    def get_official_ids(self, exclude_names=None):
        system_objs = self.filter(name__in=BK_SYSTEMS.keys())
        if exclude_names:
            system_objs = system_objs.exclude(name__in=exclude_names)
        return list(system_objs.values_list("id", flat=True))


class ESBChannelManager(models.Manager):
    def filter_channels(self, system_ids=None, is_hidden=None, is_active=None):
        queryset = self.all()

        if system_ids is not None:
            queryset = queryset.filter(component_system_id__in=system_ids)

        if is_hidden is not None:
            queryset = queryset.filter(is_hidden=is_hidden)

        if is_active is not None:
            queryset = queryset.filter(is_active=is_active)

        return queryset