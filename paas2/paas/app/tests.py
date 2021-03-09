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
from django.test.client import RequestFactory

from app.utils import modify_app_db_info
from app.models import SecureInfo


# Create your tests here.
class AppModificationTestCase(TestCase):
    """
    test
    """

    def setUp(self):
        s = SecureInfo()
        s.app_code = "test_modify"
        s.save()

        self.factory = RequestFactory()

    def test_modify_app_db_info(self):
        app_code = "test_modify"
        data = {}
        request = self.factory.post("/", data=data)

        is_success, message = modify_app_db_info(app_code, request)
        self.assertFalse(is_success)

        data = {"db_host": "127.0.0.1", "db_port": "abcd", "db_username": "root", "db_password": "123456"}
        request = self.factory.post("/", data=data)
        is_success, message = modify_app_db_info(app_code, request)
        self.assertFalse(is_success)

        data = {"db_host": "127.0.0.1", "db_port": "3306", "db_username": "root", "db_password": "123456"}
        request = self.factory.post("/", data=data)
        is_success, message = modify_app_db_info(app_code, request)
        self.assertTrue(is_success)

        s = SecureInfo.objects.get(app_code=app_code)
        self.assertEqual(s.db_host, "127.0.0.1")
        self.assertEqual(s.db_port, 3306)
        self.assertEqual(s.db_username, "root")
        self.assertEqual(s.db_password, "123456")


# class AppCreateViewTestCase(TestCase):
# def test_check_app_code(self):
# resp = self.client.get('/app/check_app_code/', data={'app_code': 'testaaa'})

# self.assertEqual(resp.status_code, 200)
# print resp.body
