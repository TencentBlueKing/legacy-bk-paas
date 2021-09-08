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
from django.utils.encoding import force_bytes

from esb.utils import SmartHost
from esb.outgoing import encode_dict, BasicHttpClient


@pytest.mark.parametrize(
    "data, expected",
    [
        (
            {
                "abc": "xyz",
            },
            {
                "abc": force_bytes("xyz"),
            },
        ),
        (
            {
                "abc": u"测试",
            },
            {
                "abc": force_bytes(u"测试"),
            },
        ),
    ]
)
def test_encode_dict(data, expected):
    result = encode_dict(data)
    assert result == expected


class TestBasicHttpClient(object):
    def test_request_by_url(self, mocker):
        def side_effect(*args, **kwargs):
            return args, kwargs

        mocker.patch(
            "esb.outgoing.BasicHttpClient.request",
            side_effect=side_effect,
        )

        client = BasicHttpClient()
        args, kwargs = client.request_by_url("GET", "http://demo.example.com/test/", k1="v1")
        assert args == ("GET", "http://demo.example.com", "/test/")
        assert kwargs == {"k1": "v1"}

    @pytest.mark.parametrize(
        "host, path, use_test_env, expected",
        [
            (
                "http://demo.example.com",
                "/test/",
                False,
                "http://demo.example.com/test/",
            ),
            (
                "demo.example.com",
                "/test/",
                False,
                "http://demo.example.com/test/",
            ),
            (
                SmartHost(host_prod="https://demo.example.com"),
                "/test/",
                False,
                "https://demo.example.com/test/",
            ),
            (
                SmartHost(host_prod="", host_test="https://demo.example.com"),
                "/test/",
                True,
                "https://demo.example.com/test/",
            ),
        ]
    )
    def test_make_url(self, host, path, use_test_env, expected):
        result = BasicHttpClient.make_url(host, path, use_test_env)
        assert result == expected
