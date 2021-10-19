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

from past.builtins import basestring
from builtins import object
from django.contrib.auth import models
from django.db import models as db_models
from django.utils import timezone

from components.usermgr_api import upsert_user
from bkauth.utils import is_bk_token_valid
from bkauth.manager import BkUserManager


class User(models.AbstractBaseUser, models.AnonymousUser):
    """Blueking User Model, It's abstract and will not create table in database"""

    username = db_models.CharField(primary_key=True, max_length=255)
    USERNAME_FIELD = "username"

    objects = BkUserManager()

    def __init__(self, *args, **kwargs):
        self.init_fields()

        # NOTE: 兼容老版本文档中:
        # user = UserModel(username, display_name="mockadmin", email="mockadmin@mock.com",)
        if len(args) == 1 and isinstance(args[0], basestring):
            args = (None, timezone.now(), args[0])

        super(User, self).__init__(*args)
        for k, v in list(kwargs.items()):
            setattr(self, k, v)

    def init_fields(self):
        self.time_zone = None
        self.language = None
        self.display_name = None
        self.telephone = None
        self.email = None
        self.wx_id = None
        self.position = None
        self.role = None
        self.extras = None
        self.status = None
        self.logo_url = None

        self.time_zone = None
        self.language = None

        self.bk_token = None
        self.is_superuser = False

        self.password = ""

    def fill_with_userinfo(self, userinfo):
        self.username = userinfo.get("username")
        self.display_name = userinfo.get("display_name")
        self.telephone = userinfo.get("telephone")
        self.email = userinfo.get("email")
        self.wx_id = userinfo.get("wx_id")
        self.position = userinfo.get("position")
        self.role = userinfo.get("role")
        self.extras = userinfo.get("extras")
        self.status = userinfo.get("status")
        self.logo_url = userinfo.get("logo_url")
        self.time_zone = userinfo.get("time_zone")
        self.language = userinfo.get("language")

        role = 1 if userinfo.get("role") == 1 else 0
        self.is_superuser = role == 1

    def sync_to_usermgr(self):
        """
        fields supported:
            username     string required, 用户名，长度：1~255

            display_name string optional, 显示名，长度：1~255
            telephone    string optional, 手机号，必须是手机号格式，11位数字
            email        string optional, 邮箱，必须是邮箱格式
            position     string optional, 职位
            role         int optional, 角色，默认0：0 普通用户, 1 超级管理员, 2 开发者, 3 职能化用户, 4 审计员
            language     string optional, 默认 zh-cn，可选 zh-cn、en
            time_zone    string optional, 默认 Asia/Shanghai

        """
        if not self.username:
            return False, "username should be setted"
        data = {}
        for key in ["display_name", "telephone", "email", "position", "role", "language", "time_zone"]:
            if getattr(self, key) is not None:
                data[key] = getattr(self, key)

        if not data:
            return False, "all the fields are None"

        ok, message, _data = upsert_user(self.username, **data)
        return ok, message

    @property
    def is_authenticated(self):
        if not self.bk_token:
            return False
        ok, _ = is_bk_token_valid(self.bk_token)
        return ok

    @property
    def is_anonymous(self):
        return not (self.is_authenticated)

    def save(self, *args, **kwargs):
        pass

    class Meta(object):
        app_label = "bkauth"
