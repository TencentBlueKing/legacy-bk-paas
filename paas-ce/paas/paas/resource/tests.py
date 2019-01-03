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
from common.utils import setup_view
from resource.views import ResourceDownloadView


class ResourceListTestCase(TestCase):
    def setUp(self):
        # Every test needs access to the request factory.
        self.factory = RequestFactory()
        self.user = BkUser.objects.create_user('test', password='test123')

    def test_resource_list(self):
        request = self.factory.get('/resource/')
        request.user = self.user

        v = setup_view(ResourceDownloadView(), request)
        self.assertEqual(v.template_name, "resource/index.html")

        context = v.get_context_data()
        self.assertTrue(len(context['resources']))
