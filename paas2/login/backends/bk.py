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


from __future__ import unicode_literals

from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist


from common.exceptions import AuthenticationError
from components import usermgr_api
from common.usermgr import get_categories_str

# from bk_i18n.constants import DJANGO_LANG_TO_BK_LANG


def _split_username(username):
    """
    admin => ("admin", "")
    admin@123.com => ("admin", "123.com")
    admin@123.com@456.com => ("admin@123.com", "145.com")
    """
    if "@" not in username:
        return username, ""
    parts = username.split("@")
    length = len(parts)
    if length == 2:
        return parts[0], parts[1]
    return "@".join(parts[: length - 1]), parts[length - 1]


class BkUserBackend(ModelBackend):
    """
    蓝鲸用户管理提供的认证
    """

    def authenticate(self, username=None, password=None, language="", **kwargs):
        # NOTE: username here maybe: username/phone/email
        if not username or not password:
            return None

        domain_list = get_categories_str().split(";")

        s_username, s_domain = _split_username(username)
        if s_domain in domain_list:
            username, domain = s_username, s_domain
        else:
            domain = ""

        # 调用用户管理接口进行验证
        ok, code, message, userinfo = usermgr_api.authenticate(username, password, language=language, domain=domain)

        # 认证不通过
        if not ok:
            # 用户第一次登录，且需要修改初始密码
            redirect_to = userinfo.get("url") if code == 3210017 else None
            raise AuthenticationError(message=message, redirect_to=redirect_to)

        # here we got the userinfo, but the language is not update yet(async in signal)
        # so we need to use the current language
        # if DJANGO_LANG_TO_BK_LANG.get(language):
        #     userinfo["language"] = DJANGO_LANG_TO_BK_LANG.get(language)

        # set the username to real username
        username = userinfo.get("username", username)
        UserModel = get_user_model()
        try:
            user = UserModel.objects.get(username=username)
        except ObjectDoesNotExist:
            user = UserModel.objects.create_user(username=username)

        user.fill_with_userinfo(userinfo)
        return user
