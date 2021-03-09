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

Classes to serialize the RESTful representation of OpenPaaS API models.
"""

from rest_framework import serializers

from api import models


class BkAppSerializer(serializers.ModelSerializer):
    """Serialize a :class:`~api.models.BkApp` model."""

    token = serializers.ReadOnlyField(required=False)
    app_envs = serializers.ReadOnlyField(required=False)

    class Meta:
        """Metadata options for a :class:`AppSerializer`."""

        model = models.BkApp


class BkAppEventSerializer(serializers.ModelSerializer):
    """Serialize a :class:`~api.models.BkAppEventLog` model."""

    logs = serializers.ReadOnlyField(required=False)

    class Meta:
        """Metadata options for a :class:`AppSerializer`."""

        model = models.BkAppEvent
