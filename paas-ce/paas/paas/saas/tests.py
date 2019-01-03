# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

from __future__ import unicode_literals

from django.test import TestCase
from django.test.client import RequestFactory

from account.models import BkUser
from app.constants import AppStateEnum
from common.utils import setup_view
from saas.models import SaaSApp
from saas.views import RecordView


class RecordTestCase(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.user = BkUser.objects.create_user('test', password='test123')

        self.code = 'test'
        saas = SaaSApp()
        saas.code = self.code
        saas.name = self.code
        saas.save()

    def test_get(self):
        # not include resolves the url
        # https://stackoverflow.com/questions/48580465/django-requestfactory-loses-url-kwargs
        request = self.factory.get('/saas/test/release/record/')
        kwargs = {'app_code': 'test'}
        request.user = self.user

        v = setup_view(RecordView(), request, **kwargs)
        context = v.get_context_data()

        self.assertEqual(self.code, context["app_code"])
        self.assertEqual(AppStateEnum.DEVELOPMENT.value, context["app_state"])

    def tearDown(self):
        SaaSApp.objects.get(code=self.code).delete()
        BkUser.objects.get(username='test').delete()
