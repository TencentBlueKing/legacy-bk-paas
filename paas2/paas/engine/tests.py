# -*- coding: utf-8 -*-
"""
mock some method
"""

import mock
from django.test import TestCase

# from django.test.client import RequestFactory

from engine.api import register_app


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
