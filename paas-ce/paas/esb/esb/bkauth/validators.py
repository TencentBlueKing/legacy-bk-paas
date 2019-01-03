# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
from common.base_validators import BaseValidator, ValidationError
from esb.bkcore.models import UserAuthToken
from esb.utils.func_ctrl import FunctionControllerClient


class UserAuthValidator(BaseValidator):
    """
    validate user
    """

    def __init__(self, *args, **kwargs):
        super(UserAuthValidator, self).__init__(*args, **kwargs)

    def validate(self, request):
        kwargs = request.g.kwargs
        app_code = request.g.app_code

        access_token = kwargs.get('bk_access_token')
        if access_token:
            token_info = self.validate_access_token(app_code, access_token)
            self.sync_current_username(request, token_info['username'])
            return

        bk_token = kwargs.get('bk_token')
        if bk_token:
            from components.bk.apis.bk_login.is_login import IsLogin
            check_result = IsLogin().invoke(kwargs={'bk_token': bk_token}, request_id=request.g.request_id)
            if not check_result['result']:
                raise ValidationError('User authentication failed, please check if the bk_token is valid')
            self.sync_current_username(request, check_result.get('data', {}).get('username', ''))
            return

        username = kwargs.get('bk_username') or kwargs.get('username')
        if username and FunctionControllerClient.is_skip_user_auth(app_code):
            self.sync_current_username(request, username)
            return

        raise ValidationError('User authentication failed, please provide a valid user identity, such as bk_token, bk_username')  # noqa

    def sync_current_username(self, request, username):
        request.g.current_user_username = username

    def validate_bk_token(self):
        pass

    def validate_access_token(self, app_code, access_token):
        if not app_code:
            raise ValidationError('APP Code [bk_app_code] cannot be empty')
        if not access_token:
            raise ValidationError('User TOKEN [bk_access_token] cannot be empty')

        user_auth_token = UserAuthToken.objects.filter(app_code=app_code, auth_token=access_token).first()
        if not user_auth_token:
            raise ValidationError('The specified user TOKEN [bk_access_token] does not exist')
        if user_auth_token.has_expired():
            raise ValidationError('The specified user TOKEN [bk_access_token] has expired, please apply for authorization again')  # noqa
        return user_auth_token.get_info()
