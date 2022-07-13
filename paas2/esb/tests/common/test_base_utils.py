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

from common.base_utils import get_first_not_empty_value, smart_upper_v2


@pytest.mark.parametrize(
    "data, keys, default, expected",
    [
        (
            {"a": "b"},
            ["a"],
            None,
            "b",
        ),
        (
            {"a": "b", "c": "d"},
            ["a", "c"],
            None,
            "b",
        ),
        (
            {"a": "b", "c": "d"},
            ["not-exist", "c"],
            None,
            "d",
        ),
        (
            {"a": "", "c": "d"},
            ["a", "c"],
            None,
            "d",
        ),
        (
            {},
            ["a", "c"],
            "",
            "",
        ),
    ]
)
def test_get_first_not_empty_value(data, keys, default, expected):
    result = get_first_not_empty_value(data, keys, default)
    assert result == expected


@pytest.mark.parametrize(
    "value, expected",
    [
        (
            "request_friend_handler",
            "RequestFriendHandler",
        ),
        (
            "request",
            "Request",
        ),
    ]
)
def test_smart_upper_v2(value, expected):
    result = smart_upper_v2(value)
    assert result == expected
