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

from account.models import BkUser
from django.test import TestCase, Client


def mock_is_bk_token_valid(request):
    return True, request.user


class HomeRedirectTestCase(TestCase):
    def setUp(self):
        self.client = Client()

        self.username = "test"
        self.email = "test@test.com"
        self.password = "12345"
        self.test_user = BkUser.objects.create(username=self.username, email=self.email, password=self.password)

    @mock.patch("account.accounts.Account.is_bk_token_valid", side_effect=mock_is_bk_token_valid)
    def test_home_redirect(self, mocked_func):
        assert not mocked_func.called
        login = self.client.login(username=self.username, password=self.password)

        assert login

        self.assertIn("_auth_user_id", self.client.session)

        resp = self.client.get("/", follow=False)
        self.assertEqual(301, resp.status_code)

        # self.assertRedirects(resp, '/console/', status_code=301, fetch_redirect_response=False)
        # /console/独立跑是访问不到的
        self.assertRedirects(resp, "/console/", status_code=301, target_status_code=404)

        assert mocked_func.called
