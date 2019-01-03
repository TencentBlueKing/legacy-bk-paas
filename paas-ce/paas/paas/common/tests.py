# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

from __future__ import unicode_literals

from django.conf import settings
from django.test import TestCase

import mock
import requests
from common.constants import LogoImgRelatedDirEnum
from common.http import _gen_header, http_delete, http_get, http_post
from common.utils import file_size_bytes_to_m, get_app_logo, should_update_logo


class CommonUtilsTestCase(TestCase):
    def test_file_size_bytes_to_m(self):

        size = None
        self.assertEqual(size, file_size_bytes_to_m(size))

        size = 0
        self.assertEqual(size, file_size_bytes_to_m(0))

        size = 1024 * 1024
        self.assertEqual(1.0, file_size_bytes_to_m(size))

    def test_get_app_logo(self):
        app_code = 'bk_framework'
        logo_name = '{}/{}.png'.format(LogoImgRelatedDirEnum.APP.value, app_code)
        result = '{}{}'.format(settings.MEDIA_URL, logo_name)

        self.assertEqual(result, get_app_logo(app_code))

        app_code = "not_exists"
        self.assertEqual("", get_app_logo(app_code))

    def test_should_update_logo(self):
        app_code = "test"
        app_logo_name = "{}/{}.png".format(LogoImgRelatedDirEnum.APP.value, app_code)

        ok, _ = should_update_logo(app_code, app_logo_name)
        self.assertFalse(ok)

        ok, logo_name = should_update_logo('test1', app_logo_name)
        self.assertTrue(ok)


class CommonHttpTestCase(TestCase):
    def _mock_response(self, status=200, content="CONTENT", json_data=None, raise_for_status=None):
        """
        https://gist.github.com/evansde77/45467f5a7af84d2a2d34f3fcb357449c

        since we typically test a bunch of different
        requests calls for a service, we are going to do
        a lot of mock responses, so its usually a good idea
        to have a helper function that builds these things
        """
        mock_resp = mock.Mock()
        # mock raise_for_status call w/optional error
        mock_resp.raise_for_status = mock.Mock()
        if raise_for_status:
            mock_resp.raise_for_status.side_effect = raise_for_status
        # set status code and content
        mock_resp.status_code = status
        mock_resp.content = content
        # add json data if provided
        if json_data:
            mock_resp.json = mock.Mock(
                return_value=json_data
            )
        return mock_resp

    @mock.patch('requests.get')
    def test_http_get(self, mock_get):
        # 200
        mock_resp = self._mock_response(status=200)
        mock_get.return_value = mock_resp

        ok, data = http_get("http://not_exists.com/", data={})
        self.assertTrue(ok)

        # 200, with json
        json_data = {"a": 1, "b": 2}
        mock_resp = self._mock_response(status=200, json_data=json_data)
        mock_get.return_value = mock_resp

        ok, data = http_get("http://not_exists.com/", data={})
        self.assertTrue(ok)
        self.assertEqual(json_data, data)

        # not 200
        mock_resp = self._mock_response(status=400)
        mock_get.return_value = mock_resp

        ok, data = http_get("http://not_exists.com/", data={})
        self.assertFalse(ok)

        # timeout
        # https://stackoverflow.com/questions/48723711/python-mock-requests-post-to-throw-exception
        mock_get.side_effect = requests.exceptions.Timeout()

        ok, data = http_get("http://not_exists.com/", data={})
        self.assertFalse(ok)

    @mock.patch('requests.post')
    def test_http_post(self, mock_post):
        # 200
        mock_resp = self._mock_response(status=200)
        mock_post.return_value = mock_resp

        ok, data = http_post("http://not_exists.com/", data={})
        self.assertTrue(ok)

        # 200, with json
        json_data = {"a": 1, "b": 2}
        mock_resp = self._mock_response(status=200, json_data=json_data)
        mock_post.return_value = mock_resp

        ok, data = http_post("http://not_exists.com/", data={})
        self.assertTrue(ok)
        self.assertEqual(json_data, data)

    @mock.patch('requests.delete')
    def test_http_delete(self, mock_delete):
        # 200
        mock_resp = self._mock_response(status=200)
        mock_delete.return_value = mock_resp

        ok, data = http_delete("http://not_exists.com/", data={})
        self.assertTrue(ok)

        # 200, with json
        json_data = {"a": 1, "b": 2}
        mock_resp = self._mock_response(status=200, json_data=json_data)
        mock_delete.return_value = mock_resp

        ok, data = http_delete("http://not_exists.com/", data={})
        self.assertTrue(ok)
        self.assertEqual(json_data, data)

    def test_default_header(self):
        headers = {
            "Content-Type": "application/json",
        }
        self.assertEqual(headers, _gen_header())
