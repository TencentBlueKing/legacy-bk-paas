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


from app_env.forms import AppEnvForm
from common.constants import ModeEnum


class AppEnvFormTestCase(TestCase):
    def _gen_form(self, **kwargs):
        data = {
            "name": "test",
            "value": "123",
            "intro": "just test",
            "mode": ModeEnum.ALL.value,
        }
        data.update(kwargs)

        return AppEnvForm(data)

    def test_form_invalid(self):

        form = self._gen_form(name="")
        self.assertFalse(form.is_valid())

        form = self._gen_form(name="ab-c")
        self.assertFalse(form.is_valid())

        form = self._gen_form(name="c"*45)
        self.assertFalse(form.is_valid())

        form = self._gen_form(value="")
        self.assertFalse(form.is_valid())

        form = self._gen_form(value="c"*2000)
        self.assertFalse(form.is_valid())

        form = self._gen_form(intro="")
        self.assertFalse(form.is_valid())

        form = self._gen_form(mode="no_exists")
        self.assertFalse(form.is_valid())

    def test_form_valid(self):
        form = self._gen_form()
        self.assertTrue(form.is_valid())
