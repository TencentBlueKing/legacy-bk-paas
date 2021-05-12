# -*- coding: utf-8 -*-
import pytest
from django.utils.encoding import force_bytes

from esb.outgoing import encode_dict


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
