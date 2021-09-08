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

from django.test import TestCase

from esb.channel.confapis import ConfapisChannelManager


class TestConfapisChannelManager(TestCase):
    def register_channel_groups(self, manager, path, method, rewrite_channels=None):
        manager.register_channel_groups({}, [(path, {"comp_codename": "test"})], rewrite_channels or {})

    def test_get_channel_by_path_matched(self):
        path = "/v2/confapi"
        method = "GET"

        manager = ConfapisChannelManager()
        self.register_channel_groups(manager, path, method)
        channel = manager.get_channel_by_path(path, method)
        self.assertEqual(channel["raw_path"], path)

    def test_search_channel_by_repath_matched(self):
        path = "/v2/confapi/vars/{var}"
        method = "GET"

        manager = ConfapisChannelManager()
        self.register_channel_groups(manager, path, method)

        channel, path_vars = manager.search_channel_by_repath(path.format(var="test"), method)
        self.assertEqual(path_vars.val_dict["var"], "test")
        self.assertEqual(channel["raw_path"], path)

    def test_search_channel_by_repath_unmatch(self):
        path = "/v2/confapi/vars/{var}"
        method = "GET"

        manager = ConfapisChannelManager()
        self.register_channel_groups(manager, path, method)

        confing, path_vars = manager.search_channel_by_repath(path.format(var=""), method)
        self.assertIsNone(path_vars)
