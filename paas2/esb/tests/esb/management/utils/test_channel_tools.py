# encoding: utf-8
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


import mock
from django.test import TestCase

from common.constants import HTTP_METHOD
from esb.component.base import get_components_manager
from esb.management.utils.channel_tools import ChannelClient


class TestChannelClient(TestCase):
    channel_config = {"comp_codename": "generic.v2.test.comp"}
    confapi_channel_config = {
        "comp_conf": {
            "name": "test",
            "suggest_method": "GET",
            "dest_http_method": "GET",
            "label": u"中文",
            "label_en": "english",
            "dest_path": "/a/b/c/",
            "api_type": "query",
        },
        "is_confapi": True,
        "comp_codename": "generic.v2.test.confapi",
        "comp_conf_to_db": {
            "name": "test",
            "suggest_method": "GET",
            "dest_http_method": "GET",
            "label": u"中文",
            "label_en": "english",
            "dest_path": "/a/b/c/",
            "api_type": "query",
        },
        "is_hidden": False,
        "method": "GET",
    }

    def setUp(self):
        self.components_manager = get_components_manager()

        self.mock_channel_cls = mock.MagicMock(
            suggest_method=HTTP_METHOD.POST,
            label=u"测试",
            label_en="test",
            sys_name="test",
        )
        self.components_manager.name_component_map[self.channel_config["comp_codename"]] = self.mock_channel_cls

        self.mock_confapi_channel_cls = mock.MagicMock(sys_name="confapi", **self.confapi_channel_config["comp_conf"])
        self.components_manager.name_component_map[
            self.confapi_channel_config["comp_codename"]
        ] = self.mock_confapi_channel_cls

    def tearDown(self):
        del self.components_manager.name_component_map[self.channel_config["comp_codename"]]
        del self.components_manager.name_component_map[self.confapi_channel_config["comp_codename"]]

    def test_is_channel_path_standard_channel_config(self):
        client = ChannelClient("/v2/%s/comp/" % self.mock_channel_cls.sys_name, self.channel_config)
        self.assertTrue(client.is_channel_path_standard())

    def test_is_channel_path_standard_confapi_channel_config_with_v2_prefix(self):
        client = ChannelClient("/v2/%s/comp/" % self.mock_confapi_channel_cls.sys_name, self.confapi_channel_config)

        self.assertTrue(client.is_channel_path_standard())

    def test_is_channel_path_standard_confapi_channel_config_without_v2_prefix(self):
        client = ChannelClient("/%s/comp/" % self.mock_confapi_channel_cls.sys_name, self.confapi_channel_config)

        self.assertTrue(client.is_channel_path_standard())
