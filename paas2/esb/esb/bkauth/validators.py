# -*- coding: utf-8 -*-
from common.base_validators import BaseValidator, ValidationError
from esb.bkcore.models import UserAuthToken
from esb.utils.func_ctrl import FunctionControllerClient


class BaseUserAuthValidator(BaseValidator):
    def validate_bk_token(self, request, bk_token):
        from components.bk.apis.bk_login.is_login import IsLogin

        check_result = IsLogin().invoke(kwargs={"bk_token": bk_token}, request_id=request.g.request_id)
        if not check_result["result"]:
            raise ValidationError("User authentication failed, please check if the bk_token is valid")
        self.sync_current_username(request, check_result.get("data", {}).get("username", ""), verified=True)

    def validate_access_token(self, request, app_code, access_token):
        if not app_code:
            raise ValidationError("APP Code [bk_app_code] cannot be empty")
        if not access_token:
            raise ValidationError("User TOKEN [bk_access_token] cannot be empty")

        user_auth_token = UserAuthToken.objects.filter(app_code=app_code, auth_token=access_token).first()
        if not user_auth_token:
            raise ValidationError("The specified user TOKEN [bk_access_token] does not exist")
        if user_auth_token.has_expired():
            raise ValidationError(
                "The specified user TOKEN [bk_access_token] has expired, please apply for authorization again"
            )  # noqa
        token_info = user_auth_token.get_info()
        self.sync_current_username(request, token_info["username"], verified=True)

    def sync_current_username(self, request, username, verified=False):
        request.g.current_user_username = username
        request.g.current_user_verified = verified


class UserAuthValidator(BaseUserAuthValidator):
    """
    validate user
    """

    def validate(self, request):
        kwargs = request.g.kwargs
        app_code = request.g.app_code

        if kwargs.get("bk_access_token"):
            self.validate_access_token(request, app_code, kwargs["bk_access_token"])
            return

        if kwargs.get("bk_token"):
            self.validate_bk_token(request, kwargs["bk_token"])
            return

        username = kwargs.get("bk_username") or kwargs.get("username")
        if username and FunctionControllerClient.is_skip_user_auth(app_code):
            self.sync_current_username(request, username, verified=False)
            return

        raise ValidationError(
            "User authentication failed, please provide a valid user identity, such as bk_token, bk_username"
        )  # noqa


class UserAuthWithBKTokenValidator(BaseUserAuthValidator):
    """
    validate user with bk-token
    """

    def validate(self, request):
        kwargs = request.g.kwargs

        bk_token = kwargs.get("bk_token") or request.COOKIES.get("bk_token")
        if bk_token:
            self.validate_bk_token(request, bk_token)
            return

        raise ValidationError("User authentication failed, please provide the parameter bk_token as the user identity")
