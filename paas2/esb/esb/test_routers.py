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

import mock
import pytest
from ddf import G
from django.http import Http404
from django.test import TestCase

from common.constants import API_TYPE_OP, API_TYPE_Q
from common.errors import APIError, error_codes
from esb.bkcore.models import ComponentSystem
from esb.routers import timeout_handler, timeout_handler_for_buffet

from . import routers

pytestmark = pytest.mark.django_db


class PatchesTestCase(TestCase):
    def start_patch_object(self, obj, attr):
        patch = mock.patch.object(obj, attr)
        self.patches.append(patch)
        return patch.start()

    def setUp(self):
        self.patches = []

    def tearDown(self):
        for p in self.patches:
            p.stop()


class TestGetChannelConf(PatchesTestCase):
    def setUp(self):
        super(TestGetChannelConf, self).setUp()
        self.confapis_channel_manager = self.start_patch_object(routers, "get_confapis_channel_manager").return_value
        self.components_manager = self.start_patch_object(routers, "get_components_manager").return_value
        self.channel_manager = self.start_patch_object(routers, "get_channel_manager").return_value
        self.path = ""
        self.request = mock.MagicMock(method="GET")
        self.channel = mock.MagicMock()
        self.path_vars = mock.MagicMock()

    def mock_channel_conf(
        self, by_path=None, by_repath=None, confapi_by_path=None, confapi_by_repath=None, path_vars=None
    ):
        self.channel_manager.get_channel_by_path.return_value = by_path
        self.channel_manager.search_channel_by_repath.return_value = (by_repath, path_vars)
        self.confapis_channel_manager.get_channel_by_path.return_value = confapi_by_path
        self.confapis_channel_manager.search_channel_by_repath.return_value = (confapi_by_repath, path_vars)

    def test_get_channel_by_path(self):
        self.mock_channel_conf(by_path=self.channel)

        channel = routers.get_channel_conf(self.path, self.request)

        self.channel_manager.get_channel_by_path.assert_called_once_with(self.path, self.request.method)
        self.assertEqual(channel, self.channel)

    def test_search_channel_by_repath(self):
        self.mock_channel_conf(by_repath=self.channel, path_vars=self.path_vars)

        channel = routers.get_channel_conf(self.path, self.request)

        self.channel_manager.search_channel_by_repath.assert_called_once_with(self.path, self.request.method)
        self.assertEqual(channel, self.channel)
        self.assertEqual(self.request.g.path_vars, self.path_vars)

    def test_confapi_get_channel_by_path(self):
        self.mock_channel_conf(confapi_by_path=self.channel)

        channel = routers.get_channel_conf(self.path, self.request)

        self.confapis_channel_manager.get_channel_by_path.assert_called_once_with(self.path, self.request.method)
        self.assertEqual(channel, self.channel)

    def test_confapi_search_channel_by_repath(self):
        self.mock_channel_conf(confapi_by_repath=self.channel, path_vars=self.path_vars)

        channel = routers.get_channel_conf(self.path, self.request)

        self.confapis_channel_manager.search_channel_by_repath.assert_called_once_with(self.path, self.request.method)
        self.assertEqual(channel, self.channel)
        self.assertEqual(self.request.g.path_vars, self.path_vars)

    def test_get_nothing(self):
        self.mock_channel_conf()

        with self.assertRaises(Http404):
            routers.get_channel_conf(self.path, self.request)


class TestRouterView(PatchesTestCase):
    def setUp(self):
        super(TestRouterView, self).setUp()
        self.path = "/"
        self.channel_type = "api"

        self.components_manager = self.start_patch_object(routers, "get_components_manager").return_value
        self.channel_manager = self.start_patch_object(routers, "get_channel_manager").return_value
        self.get_channel_conf = self.start_patch_object(routers, "get_channel_conf")
        self.channel_conf = self.get_channel_conf.return_value = self.make_channel_conf()
        self.request = mock.MagicMock(method="GET")
        self.channel_manager.get_rewrite_path_by_path.return_value = None

    def make_channel_conf(self):
        channel_conf = mock.MagicMock()

        channel_conf["channel"].is_active = True

        return channel_conf

    def test_comp_path(self):
        for path, comp_path in [
            ("a", "/a/"),
            ("a/", "/a/"),
            ("/a", "/a/"),
            ("/a/", "/a/"),
            ("//a//", "/a/"),
        ]:
            request = mock.MagicMock()
            routers.router_view(self.channel_type, request, path)
            self.assertEqual(request.g.comp_path, comp_path)

    def test_channel_is_not_active(self):
        self.channel_conf["channel"].is_active = False
        with self.assertRaisesMessage(APIError, str(error_codes.INACTIVE_CHANNEL)):
            routers.router_view(self.channel_type, self.request, self.path)

    def test_comp_cls_not_found(self):
        self.components_manager.get_comp_by_name.return_value = None
        esb_channel = self.channel_conf["channel"]

        with self.assertRaisesMessage(
            APIError, str(error_codes.COMPONENT_NOT_FOUND.format_prompt(esb_channel.component_codename))
        ):
            routers.router_view(self.channel_type, self.request, self.path)

        self.components_manager.get_comp_by_name.assert_called_once()

    def test_set_request_validators(self):
        channel_obj = self.channel_conf["classes"][self.channel_type].return_value
        esb_channel = self.channel_conf["channel"]
        request_validators = [mock.MagicMock()]
        esb_channel.request_validators = request_validators

        routers.router_view(self.channel_type, self.request, self.path)
        channel_obj.set_request_validators.assert_called_once_with(request_validators)

    def test_append_request_validators(self):
        channel_obj = self.channel_conf["classes"][self.channel_type].return_value
        esb_channel = self.channel_conf["channel"]
        request_validators = [mock.MagicMock()]
        esb_channel.append_request_validators = request_validators

        routers.router_view(self.channel_type, self.request, self.path)
        channel_obj.append_request_validators.assert_called_once_with(request_validators)

    def test_timeout_time_from_timeout_handler(self):
        sys_name = "test"
        self.components_manager.get_comp_by_name.return_value = mock.MagicMock(sys_name=sys_name)
        timeout_time = id(self)
        timeout_handler = self.start_patch_object(routers, "timeout_handler")
        timeout_handler.return_value = timeout_time

        routers.router_view(self.channel_type, self.request, self.path)

        self.assertEqual(self.request.g.timeout, timeout_time)
        self.assertEqual(self.request.g.sys_name, sys_name)

    def test_timeout_time_from_settings(self):
        sys_name = "test"
        self.components_manager.get_comp_by_name.return_value = mock.MagicMock(sys_name=sys_name)
        timeout_time = id(self)
        timeout_handler = self.start_patch_object(routers, "timeout_handler")
        timeout_handler.side_effect = Exception()

        with self.settings(REQUEST_TIMEOUT_SECS=timeout_time):
            routers.router_view(self.channel_type, self.request, self.path)

        self.assertEqual(self.request.g.timeout, timeout_time)
        self.assertEqual(self.request.g.sys_name, sys_name)

    def test_handle_request(self):
        channel_obj = self.channel_conf["classes"][self.channel_type].return_value

        routers.router_view(self.channel_type, self.request, self.path)

        channel_obj.handle_request.assert_called_once_with(self.request)


@pytest.mark.parametrize(
    "esb_channel, comp_cls, expected",
    [
        # channel timeout is not None
        (
            {
                "timeout_time": 5,
            },
            {},
            5,
        ),
        # system is None
        (
            {
                "timeout_time": None,
                "component_system_id": None,
            },
            {},
            None,
        ),
        # system is not None, api_type is API_TYPE_OP
        (
            {
                "timeout_time": None,
                "component_system_id": 1,
            },
            {
                "api_type": API_TYPE_OP,
            },
            20,
        ),
        # system is not None, api_type is API_TYPE_Q
        (
            {
                "timeout_time": None,
                "component_system_id": 1,
            },
            {
                "api_type": API_TYPE_Q,
            },
            10,
        ),
        # system is not None, api_type is not unknown
        (
            {
                "timeout_time": None,
                "component_system_id": 1,
                "type": 1,
            },
            {
                "api_type": "unknown"
            },
            20,
        ),
        # system is not None, api_type is not unknown
        (
            {
                "timeout_time": None,
                "component_system_id": 1,
                "type": 0,
            },
            {
                "api_type": "unknown"
            },
            10,
        ),
    ]
)
def test_timeout_handler(mocker, esb_channel, comp_cls, expected):
    system = G(ComponentSystem, execute_timeout=20, query_timeout=10)

    if esb_channel.get("component_system_id") is not None:
        esb_channel["component_system_id"] = system.id

    esb_channel = mocker.MagicMock(**esb_channel)
    comp_cls = mocker.MagicMock(**comp_cls)
    assert timeout_handler(esb_channel, comp_cls) == expected


@pytest.mark.parametrize(
    "comp_obj, expected",
    [
        # componet timeout is not None
        (
            {
                "timeout_time": 5,
            },
            5,
        ),
        # system is None
        (
            {
                "timeout_time": None,
                "system_id": None,
            },
            None,
        ),
        # system is not None
        (
            {
                "timeout_time": None,
                "system_id": 1,
                "type": 1,
            },
            20,
        ),
        # system is not None
        (
            {
                "timeout_time": None,
                "system_id": 1,
                "type": 2,
            },
            10,
        ),
    ]
)
def test_timeout_handler(mocker, comp_obj, expected):
    system = G(ComponentSystem, execute_timeout=20, query_timeout=10)

    if comp_obj.get("system_id") is not None:
        comp_obj["system_id"] = system.id

    comp_obj = mocker.MagicMock(**comp_obj)
    assert timeout_handler_for_buffet(comp_obj) == expected
