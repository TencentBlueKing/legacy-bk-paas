# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

from __future__ import unicode_literals

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend

from common.constants import RoleCodeEnum
from common.log import logger
from components.login import get_user_info, verify_bk_login


class BkBackend(ModelBackend):
    """自定义认证方法
    """

    def authenticate(self, request):
        is_login, username = is_bk_token_valid(request)
        if not is_login:
            return None

        UserModel = get_user_model()
        try:
            return UserModel._default_manager.get_by_natural_key(username)
        except UserModel.DoesNotExist:
            return None


def is_bk_token_valid(request):
    """验证用户登录态."""
    bk_token = request.COOKIES.get(settings.BK_COOKIE_NAME, None)

    if not bk_token:
        return False, None

    ok, data = verify_bk_login(bk_token)
    if not ok:
        # bk_token 无效
        return False, None

    # 检查用户是否存在用户表中
    username = data.get('username', '')
    UserModel = get_user_model()
    try:
        user = UserModel._default_manager.get_by_natural_key(username)
    except UserModel.DoesNotExist:
        user = UserModel.objects.create_user(username)

    # update user info
    try:
        ok, data = get_user_info(bk_token)
        # 若获取用户信息失败，则用户可登录，但用户其他信息为空
        if ok:
            user.chname = data.get('chname', '')
            user.company = data.get('company', '')
            user.phone = data.get('phone', '')
            user.email = data.get('email', '')
            role = data.get('role', '')
            # 用户权限更新
            is_superuser = str(role) == str(RoleCodeEnum.SUPERUSER.value)
            user.is_superuser = is_superuser
            user.is_staff = is_superuser
            user.role = role
            user.save()
    except Exception as e:
        logger.exception("获取记录用户信息失败：%s", e)

    return True, user
