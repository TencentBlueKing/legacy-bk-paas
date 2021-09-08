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
import pytest
from builtins import object

from common.constants import FunctionControllerCodeEnum
from esb.bkcore.models import FunctionController
from esb.utils.func_ctrl import FunctionControllerClient
from esb.utils.jwt_utils import JWTKey

pytestmark = pytest.mark.django_db


class TestFunctionControllerClient(object):
    def test_save_jwt_key(self):
        assert not FunctionController.objects.filter(func_code=FunctionControllerCodeEnum.JWT_KEY.value).exists()

        private_key, public_key = JWTKey().generate()
        FunctionControllerClient.save_jwt_key(private_key, public_key)

        assert FunctionController.objects.filter(func_code=FunctionControllerCodeEnum.JWT_KEY.value).exists()
