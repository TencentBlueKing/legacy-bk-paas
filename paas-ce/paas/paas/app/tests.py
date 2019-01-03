# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

from django.test import TestCase
from django.test.client import RequestFactory

from account.models import BkUser
from app.models import App
from app.utils import validate_app_name
from common.utils import setup_view
from app.views import CheckAppCodeView, ErrorView


class AppNameValidateTestCase(TestCase):
    def setUp(self):
        self.old_name = 'oldname'

        app = App()
        app.code = self.old_name
        app.name = self.old_name
        app.introduction = "introduction"
        app.creater = 'admin',
        app.language = 'python'
        app.auth_token = '1234'
        app.deploy_token = '1234'
        app.tags = None
        app.save()

    def test_util_validate_app_name(self):
        new_name = 'a' * 21

        r, _ = validate_app_name(new_name, None)
        self.assertFalse(r)

        r, _ = validate_app_name(self.old_name, None)
        self.assertFalse(r)

        new_name = 'validname'
        # change from old_name to new_name
        r, _ = validate_app_name(new_name, self.old_name)
        self.assertTrue(r)

        # totally new
        r, _ = validate_app_name(new_name, None)
        self.assertTrue(r)

    def tearDown(self):
        App.objects.get(code=self.old_name).delete()


class CheckAppCodeTestCase(TestCase):
    def setUp(self):
        # Every test needs access to the request factory.
        self.factory = RequestFactory()
        self.user = BkUser.objects.create_user('test', password='test123')

        self.old_name = 'oldname'
        app = App()
        app.code = self.old_name
        app.name = self.old_name
        app.introduction = "introduction"
        app.creater = 'admin',
        app.language = 'python'
        app.auth_token = '1234'
        app.deploy_token = '1234'
        app.tags = None
        app.save()

    def _do_request(self, app_code):
        request = self.factory.get("/app/check/app_code/?app_code={}".format(app_code))
        request.user = self.user
        # test view template or context_data
        v = setup_view(CheckAppCodeView(), request)
        context = v.get_context_data()
        result = context["result"]

        return result

    def test_get(self):
        false_app_codes = ['', 'ab', 'a' * 17, '12ab', 'ab_cd', self.old_name]
        for app_code in false_app_codes:
            self.assertFalse(self._do_request(app_code))

        true_app_codes = ['abc', 'abcd', 'a' * 16]
        for app_code in true_app_codes:
            self.assertTrue(self._do_request(app_code))

    def tearDown(self):
        App.objects.get(code=self.old_name).delete()


class ErrorViewTest(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.user = BkUser.objects.create_user('test', password='test123')

    def test_get(self):
        app_code = 'test'
        error_id = '1'
        url = "/app/{}/error/{}/".format(app_code, error_id)
        template_name = 'error/app_error_dialog{}.html'.format(error_id)

        request = self.factory.get(url)
        request.user = self.user
        kwargs = {"app_code": app_code, "error_id": error_id}

        # test view template or context_data
        v = setup_view(ErrorView(), request, **kwargs)

        self.assertEqual(v.get_template_names(), [template_name])

        context = v.get_context_data()
        self.assertEqual(context["app_code"], app_code)
