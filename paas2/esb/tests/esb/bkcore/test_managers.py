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
import pytest
from ddf import G

from esb.bkcore.models import ComponentSystem, ESBChannel

pytestmark = pytest.mark.django_db


class TestComponentSystem:
    def test_get_official_ids(self, mocker, unique_id):
        mocker.patch(
            "esb.bkcore.managers.BK_SYSTEMS",
            new_callable=mocker.PropertyMock(return_value={unique_id: "test"}),
        )

        G(ComponentSystem, name=unique_id)

        assert len(ComponentSystem.objects.get_official_ids()) == 1


class TestESBChannel:
    def test_filter_channels(self):
        system = G(ComponentSystem)

        G(ESBChannel, component_system=system, is_hidden=False, is_active=True)

        assert ESBChannel.objects.filter_channels(system_ids=[system.id], is_hidden=False, is_active=True).count() == 1
