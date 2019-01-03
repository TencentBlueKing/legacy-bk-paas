# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

from django.conf import settings
from django.test import TestCase
from django.test.client import RequestFactory

import mock
from account.backends import BkBackend, is_bk_token_valid
from account.models import BkUser
from common.constants import RoleCodeEnum
from account.forms import PasswordChangeForm


class BkTokenTestCase(TestCase):

    @mock.patch('account.backends.get_user_info')
    @mock.patch('account.backends.verify_bk_login')
    def test_toekn_validate(self, mock_verify_bk_login, mock_get_user_info):

        mock_verify_bk_login.return_value = (True, {"username": "test"})
        mock_get_user_info.return_value = (True, {"username": "test",
                                                  "company": "test",
                                                  "phone": "13911111111",
                                                  "email": "test@test.com",
                                                  "role": RoleCodeEnum.STAFF.value,
                                                  })

        rf = RequestFactory()
        request = rf.get('/')

        # no bk_token
        ok, _ = is_bk_token_valid(request)
        self.assertFalse(ok)

        # success
        request.COOKIES[settings.BK_COOKIE_NAME] = 'whatever'
        ok, _ = is_bk_token_valid(request)
        self.assertTrue(ok)

        # bk_token invalid
        request.COOKIES[settings.BK_COOKIE_NAME] = 'whatever'
        mock_verify_bk_login.return_value = (False, {"username": "test"})
        ok, _ = is_bk_token_valid(request)
        self.assertFalse(ok)

        # update user info fail, still success
        request.COOKIES[settings.BK_COOKIE_NAME] = 'whatever'
        mock_verify_bk_login.return_value = (True, {"username": "test"})
        mock_get_user_info.return_value = (False, {})
        ok, _ = is_bk_token_valid(request)
        self.assertTrue(ok)


class BkBackendTestCase(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.user = BkUser.objects.create_user('test', password='test123')

    @mock.patch('account.backends.is_bk_token_valid')
    def test_toekn_validate(self, mock_is_bk_token_valid):
        rf = RequestFactory()
        request = rf.get('/')

        # fail
        mock_is_bk_token_valid.return_value = (False, '')
        b = BkBackend()
        result = b.authenticate(request)
        self.assertFalse(result)

        # get model via username fail
        mock_is_bk_token_valid.return_value = (True, '')
        b = BkBackend()
        result = b.authenticate(request)
        self.assertFalse(result)

        # get model via username success
        mock_is_bk_token_valid.return_value = (True, 'test')
        b = BkBackend()
        result = b.authenticate(request)
        self.assertTrue(result)

    def tearDown(self):
        BkUser.objects.get(username='test').delete()


class ChangePasswordFormTestCase(TestCase):
    def test_password_invalid(self):
        data = {"new_password1": ""}
        form = PasswordChangeForm(data)
        self.assertFalse(form.is_valid())

        data = {"new_password1": "abc"}
        form = PasswordChangeForm(data)
        self.assertFalse(form.is_valid())

        data = {"new_password1": "abc", "new_password2": "abcd"}
        form = PasswordChangeForm(data)
        self.assertFalse(form.is_valid())

        data = {"new_password1": "abc", "new_password2": "abc"}
        form = PasswordChangeForm(data)
        self.assertTrue(form.is_valid())
