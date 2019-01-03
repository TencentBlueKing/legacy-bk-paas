# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

from __future__ import unicode_literals

import mock
from django.test import TestCase

from components.engine import register_app, _process_status
from release.constants import EventStatusEnum
from components.login import _call_login_api


def mock_fail_response(url, **kwargs):
    return False, {}


def mock_ok_response(url, **kwargs):
    return True, {'result': True, 'message': 'ok', 'data': {'token': '1234'}}


class RegisterAppTestCase(TestCase):

    @mock.patch('components.engine.http_post')
    def test_register_app(self, mocked_func):
        mocked_func.side_effect = mock_fail_response
        # assert not mocked_func.called

        ok, _, _ = register_app('test', 'test', 'python')
        self.assertFalse(ok)

        # assert mocked_func.called
        mocked_func.side_effect = mock_ok_response
        ok, _, _ = register_app('test', 'test', 'python')
        self.assertTrue(ok)


class ProcessStatusTestCase(TestCase):

    def test_process_status(self):
        all_success_list = [EventStatusEnum.SUCCESS.value, EventStatusEnum.SUCCESS.value]
        self.assertEqual(EventStatusEnum.SUCCESS.value, _process_status(all_success_list))

        one_fail_list = [EventStatusEnum.SUCCESS.value, EventStatusEnum.FAILURE.value]
        self.assertEqual(EventStatusEnum.FAILURE.value, _process_status(one_fail_list))

        all_ready_list = [EventStatusEnum.READY.value, EventStatusEnum.READY.value]
        self.assertEqual(EventStatusEnum.READY.value, _process_status(all_ready_list))

        pending_list = [EventStatusEnum.READY.value, EventStatusEnum.SUCCESS.value]
        self.assertEqual(EventStatusEnum.PENDING.value, _process_status(pending_list))


class LoginAPITestCase(TestCase):
    @mock.patch('components.login.http_delete')
    @mock.patch('components.login.http_post')
    @mock.patch('components.login.http_get')
    def test_call_login_api(self, mock_get, mock_post, mock_delete):
        mock_get.side_effect = mock_fail_response
        mock_post.side_effect = mock_fail_response
        mock_delete.side_effect = mock_fail_response

        param = {"bk_token": "test"}

        ok, message, data = _call_login_api(mock_post, 'get_user', {'params': param})
        self.assertFalse(ok)

        ok, message, data = _call_login_api(mock_get, 'get_user', {'params': param})
        self.assertFalse(ok)

        ok, message, data = _call_login_api(mock_delete, 'get_user', {'params': param})
        self.assertFalse(ok)

        mock_get.return_value = (True, {"result": False})
        mock_get.side_effect = None
        ok, message, data = _call_login_api(mock_get, 'get_user', {'params': param})
        self.assertFalse(ok)

        mock_get.return_value = (True, {"result": True})
        mock_get.side_effect = None
        ok, message, data = _call_login_api(mock_get, 'get_user', {'params': param})
        self.assertTrue(ok)
