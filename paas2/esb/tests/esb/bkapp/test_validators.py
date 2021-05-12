# -*- coding: utf-8 -*-
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
