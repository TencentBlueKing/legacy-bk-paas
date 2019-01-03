# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
from __future__ import unicode_literals

from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

from common.log import logger
from .utils import get_access_token, get_scope_data


class OauthBackend(ModelBackend):
    """
    自定义认证方法
    """
    def authenticate(self, code=None):
        # Google登录验证
        try:
            # 调用接口验证登录票据CODE，并获取access_token
            access_token = get_access_token(code)
            if not access_token:
                return None
            # 通过access_token 获取用户信息
            userinfo = get_scope_data(access_token)
            if not userinfo:
                return None
            # 验证通过
            username = userinfo.get('username')
            # 获取User类
            user_model = get_user_model()
            # 获取或生成User对象，并根据需要设置用户信息和角色
            try:
                user = user_model.objects.get(username=username)
            except user_model.DoesNotExist:
                # 创建User对象
                user = user_model.objects.create_user(username)
                # 获取用户信息，只在第一次创建时设置，已经存在不更新
                chname = userinfo.get('chname', '')
                phone = userinfo.get('phone', '')
                email = userinfo.get('email', '')
                user.chname = chname
                user.phone = phone
                user.email = email
                user.save()
                # note: 可根据需要设置用户角色, user_model.objects.modify_user_role(...)
            # note: 可根据需要每次都更新用户信息等，或每次都更新用户角色等
            return user
        except Exception:
            logger.exception("Google login backend validation error!")
        return None
