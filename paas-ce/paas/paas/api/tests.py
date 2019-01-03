# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

import json

from django.conf import settings
from django.test import TestCase
from django.test.client import RequestFactory

from account.models import BkUser
from app.models import App
# from common.utils import setup_view
from api.views import AppInfoAPIView, AppInfoV2APIView


class AppInfoAPITestCase(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        # from django.test.client import Client
        # self.client = Client()
        self.user = BkUser.objects.create_user('test', password='test123')

        self.code = 'test'

        app = App()
        app.code = self.code
        app.name = self.code
        app.introduction = "introduction"
        app.creater = 'admin',
        app.language = 'python'
        app.auth_token = '1234'
        app.deploy_token = '1234'
        app.tags = None
        app.save()

    def test_app_info_api(self):

        kwargs = {
            "HTTP_X_APP_TOKEN": settings.ESB_TOKEN,
            "HTTP_X_APP_CODE": "esb"
        }
        request = self.factory.get("/paas/api/app_info/?target_app_code={}".format(self.code), **kwargs)
        request.user = self.user

        view = AppInfoAPIView.as_view()
        response = view(request)
        self.assertEqual(response.status_code, 200)

        data = json.loads(response.content)

        self.assertTrue(data["result"])
        self.assertEqual("00", data["code"])

    def test_app_info_api_v2(self):
        kwargs = {
            "HTTP_X_APP_TOKEN": settings.ESB_TOKEN,
            "HTTP_X_APP_CODE": "esb"
        }
        request = self.factory.get("/paas/api/v2/app_info/?target_app_code={}".format(self.code), **kwargs)
        request.user = self.user

        view = AppInfoV2APIView.as_view()
        response = view(request)
        self.assertEqual(response.status_code, 200)

        # {"bk_error_msg": "", "bk_error_code": 0, "data": [{"bk_app_code": "test", "bk_app_name": "test"}]}
        data = json.loads(response.content)

        self.assertEqual(0, data["bk_error_code"])

    def tearDown(self):
        App.objects.get(code=self.code).delete()
