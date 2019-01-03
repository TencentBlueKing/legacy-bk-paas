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

from engine.constants import ServerCategoryEnum, ExternalServerCategoryEnum
from engine.forms import ServerForm, ExternalServerForm


class ServerFormTestCase(TestCase):

    def _gen_form(self, **kwargs):
        data = {
            'server_ip': "1.1.1.1",
            "server_port": "4245",
            "app_port": "8085",
            "server_cate": ServerCategoryEnum.TEST.value,
        }
        data.update(kwargs)

        return ServerForm(data)

    def test_form_invalid(self):

        form = self._gen_form(server_ip='a.b.c.d')
        self.assertFalse(form.is_valid())

        form = self._gen_form(server_port=-1)
        self.assertFalse(form.is_valid())

        form = self._gen_form(app_port=-1)
        self.assertFalse(form.is_valid())

        form = self._gen_form(server_cate=None)
        self.assertFalse(form.is_valid())

    def test_form_valid(self):
        form = self._gen_form()
        self.assertTrue(form.is_valid())


class ExternalServerFormTestCase(TestCase):

    def _gen_form(self, **kwargs):
        data = {
            "server_ip": "1.1.1.1",
            "server_port": "4245",
            "server_cate": ExternalServerCategoryEnum.MQ.value,
            "username": "test",
            "password": "12345"
        }
        data.update(kwargs)

        return ExternalServerForm(data)

    def test_form_invalid(self):

        form = self._gen_form(server_ip='a.b.c.d')
        self.assertFalse(form.is_valid())

        form = self._gen_form(server_port=-1)
        self.assertFalse(form.is_valid())

        form = self._gen_form(username="")
        self.assertFalse(form.is_valid())

        form = self._gen_form(password="")
        self.assertFalse(form.is_valid())

    def test_form_valid(self):
        form = self._gen_form()
        self.assertTrue(form.is_valid())
