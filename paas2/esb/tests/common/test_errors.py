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

from common.errors import BaseException, RequestThirdPartyException, RequestSSLException


class TestBaseException(object):
    def test_message(self):
        with pytest.raises(BaseException) as err:
            raise BaseException("test error")

        assert err.value.message == "test error"


class TestRequestThirdPartyException(object):
    def test_get_message(self):
        ex = RequestThirdPartyException(Exception("test"), "TEST", "echo")

        assert str(ex) != ""
        assert ex.get_message() != ""


class TestRequestSSLException(object):
    def test_get_message(self):
        raw_exc = Exception("test")
        raw_exc.cert = ("path1", "path2")
        raw_exc.SSL_ROOT_DIR = "/path/to/ssl"
        ex = RequestSSLException(raw_exc, "TEST", "echo")

        assert ex.get_message() != ""
