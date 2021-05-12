# -*- coding: utf-8 -*-
import pytest

from common import base_utils


@pytest.mark.parametrize(
    "value, expected",
    [
        ("request_friend_handler", "requestFriendHandler"),
    ]
)
def test_smart_upper(value, expected):
    result = base_utils.smart_upper(value)
    assert result == expected
