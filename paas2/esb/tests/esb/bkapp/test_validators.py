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

from esb.bkapp.validators import SignatureValidator


class TestSignatureValidator:

    @pytest.mark.parametrize(
        "method, path, params, signature, app_secrets, expected",
        [
            (
                "GET",
                "/echo/",
                {
                    "abc": "xyz",
                    "bk_nonce": 12345,
                    "bk_timestamp": 1936162716,
                },
                "8lzxAJAoNX4D3O1QXfDpH+TzD20=",
                ["valid-secret"],
                True
            ),
            (
                "GET",
                "/echo/",
                {
                    "abc": "xyz",
                    "bk_nonce": 12345,
                    "bk_timestamp": 1936162716,
                },
                "8lzxAJAoNX4D3O1QXfDpH+TzD20=",
                ["invalid-secret"],
                False,
            ),
            (
                "GET",
                "/echo/",
                {
                    "abc": "xyz",
                    "bk_nonce": 12345,
                    "bk_timestamp": 1936162716,
                },
                "8lzxAJAoNX4D3O1QXfDpH+TzD20=",
                ["invalid-secret", "valid-secret"],
                True,
            ),
        ]
    )
    def test_verify_signature(self, method, path, params, signature, app_secrets, expected):
        validator = SignatureValidator()
        result = validator.verify_signature(method, path, params, signature, app_secrets)
        assert result == expected
