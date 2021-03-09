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
from django.test import TestCase

# from django.test.client import RequestFactory

from engine.api import register_app

"""
mock some method
"""


def fake_engine_init_post(app_code, auth_token, url, data):
    return True, {}


class EngineApiTestCase(TestCase):
    # 全局的没有用
    # @mock.patch('common.http.engine_http_post', side_effect=fake_engine_init_post)
    # 具体某个模块的就可以
    @mock.patch("engine.api.http_post", side_effect=fake_engine_init_post)
    def test_register_app(self, mocked_func):
        assert not mocked_func.called
        is_success, result = register_app("testaaa", "testaaa", "python")
        assert mocked_func.called
        self.assertTrue(is_success)
