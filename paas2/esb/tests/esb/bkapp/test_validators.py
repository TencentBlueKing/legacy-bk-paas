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

from common.base_utils import FancyDict
from common.base_validators import ValidationError
from esb.bkapp.validators import AccessTokenValidator, AppAuthValidator, AppSecretValidator


class TestAppAuthValidator:
    def test_validate_with_access_token(self, request_factory, mocker):
        validator = AppAuthValidator(verified_type="app_secret")

        request = request_factory.get("")

        # use AppSecretValidator
        request.g = FancyDict(authorization={})
        mocker.patch("esb.bkapp.validators.AppSecretValidator.validate", return_value=None)
        assert validator.validate(request) is None

        # use AccessTokenValidator
        request.g = FancyDict(authorization={"access_token": "fake-access-token"})
        mocker.patch("esb.bkapp.validators.AccessTokenValidator.validate", return_value=None)
        mocker.patch("esb.bkapp.validators.AccessTokenValidator.get_bk_app_code", return_value="app-test")
        validator.validate(request)
        assert request.g.app_code == "app-test"

        # AccessTokenValidator validate error
        request.g = FancyDict(authorization={"access_token": "fake-access-token"})
        mocker.patch("esb.bkapp.validators.AccessTokenValidator.validate", side_effect=ValidationError)
        with pytest.raises(ValidationError):
            validator.validate(request)

    def test_validate_with_signature_or_app_secret(self, request_factory, mocker):
        validator = AppAuthValidator(verified_type="app_secret")

        request = request_factory.get("")
        # has param bk_app_secret, use AppSecretValidator
        mocked_validate = mocker.patch(
            "esb.bkapp.validators.AppSecretValidator.validate",
            return_value=None,
        )
        request.g = FancyDict(authorization={"bk_app_secret": "secret"})
        validator.validate(request)
        mocked_validate.assert_called_once()

        request.g = FancyDict(authorization={"app_secret": "secret"})
        validator.validate(request)
        assert mocked_validate.call_count == 2


class TestAccessTokenValidator:

    @pytest.fixture
    def fake_request(self, request_factory):
        request = request_factory.get("")
        request.g = FancyDict(authorization={"access_token": "test"})
        return request

    def test_validate(self, mocker, fake_request):
        mocker.patch(
            "esb.bkapp.validators.AccessTokenValidator._verify_access_token",
            return_value=("app-test", "admin"),
        )
        validator = AccessTokenValidator()
        validator.validate(fake_request)

        assert validator._validated_data == {
            "bk_app_code": "app-test",
            "bk_username": "admin",
        }

    def test_validated_data(self):
        validator = AccessTokenValidator()
        with pytest.raises(ValidationError):
            validator.validated_data

        validator._validated_data = {"a": "b"}
        assert validator.validated_data == {"a": "b"}

    def test_get_bk_app_code(self):
        validator = AccessTokenValidator()
        validator._validated_data = {"bk_app_code": "app-test"}
        assert validator.get_bk_app_code() == "app-test"

    def test_get_username(self):
        validator = AccessTokenValidator()

        validator._validated_data = {"bk_username": ""}
        with pytest.raises(ValidationError):
            validator.get_bk_username()

        validator._validated_data = {"bk_username": "admin"}
        assert validator.get_bk_username() == "admin"

    def test_verify_access_token(self, mocker):
        mocker.patch(
            "components.bk.apisv2.bk_ssm.verify_access_token.VerifyAccessToken.invoke",
            return_value={"result": False}
        )
        with pytest.raises(ValidationError):
            AccessTokenValidator._verify_access_token("fake-access-token")

        mocker.patch(
            "components.bk.apisv2.bk_ssm.verify_access_token.VerifyAccessToken.invoke",
            return_value={
                "result": True,
                "data": {
                    "bk_app_code": "app-test",
                    "identity": {
                        "username": "admin",
                    }
                }
            }
        )
        bk_app_code, bk_username = AccessTokenValidator._verify_access_token("fake-access-token")
        assert bk_app_code == "app-test"
        assert bk_username == "admin"


class TestAppSecretValidator:
    @pytest.mark.parametrize(
        "authorization, expected",
        [
            (
                {"bk_app_secret": "valid-secret1"},
                None,
            ),
            (
                {"app_secret": "valid-secret2"},
                None,
            ),
            (
                {"bk_app_secret": "not-valid-secret"},
                ValidationError,
            ),
            (
                {},
                ValidationError,
            ),
        ]
    )
    def test_validate(self, mocker, request_factory, authorization, expected):
        mocker.patch(
            "esb.bkapp.validators.AppSecureInfo.get_by_app_code",
            return_value={"secure_key_list": ["valid-secret1", "valid-secret2"]}
        )
        request = request_factory.get("")
        request.g = FancyDict(app_code="app-test", authorization=authorization)
        validator = AppSecretValidator()

        if expected is None:
            assert validator.validate(request) is None
            return

        with pytest.raises(ValidationError):
            validator.validate(request)
