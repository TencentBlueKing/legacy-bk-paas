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
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.core.mail import send_mail
from django.db import models
from django.utils import timezone
from django.utils.http import urlquote
from django.utils.translation import ugettext_lazy as _

from account.manager import BkUserManager
from common.constants import RoleCodeEnum


class BkUser(AbstractBaseUser, PermissionsMixin):
    """BK user

    username and password are required. Other fields are optional.
    """

    username = models.CharField("用户名", max_length=128, unique=True)
    chname = models.CharField("中文名", max_length=254, blank=True)
    company = models.CharField("公司", max_length=128, blank=True)
    qq = models.CharField("QQ号", max_length=32, blank=True)
    phone = models.CharField("手机号", max_length=64, blank=True)
    email = models.EmailField("邮箱", max_length=254, blank=True)

    is_staff = models.BooleanField("普通管理员", default=False, help_text="普通管理员可以登录到admin")
    date_joined = models.DateTimeField(_('date joined'), default=timezone.now)

    role = models.CharField("用户角色", max_length=32, default='0', help_text="用户角色表示字符串")

    objects = BkUserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')

    @property
    def has_developer_perm(self):
        return self.role in [str(RoleCodeEnum.SUPERUSER.value), str(RoleCodeEnum.DEVELOPER.value)]

    def check_password(self, raw_password):
        """支持数据库明文存储密码
        """
        if raw_password == self.password:
            return True

        def setter(raw_password):
            self.set_password(raw_password)
            self.save(update_fields=["password"])

        from django.contrib.auth.hashers import check_password
        return check_password(raw_password, self.password, setter)

    def get_absolute_url(self):
        return "/users/{email}/".format(email=urlquote(self.email))

    def get_full_name(self):
        """Return the `username chinese_name`
        """
        full_name = '{} {}'.format(self.username, self.chname)
        return full_name.strip()

    def get_short_name(self):
        """Return the chinese name for the user
        """
        return self.chname

    def email_user(self, subject, message, from_email=None):
        """Send an email to this User
        """
        send_mail(subject, message, from_email, [self.email])


class Loignlog(models.Model):
    """User login log
    """

    user = models.ForeignKey(settings.AUTH_USER_MODEL, verbose_name="用户")
    login_time = models.DateTimeField("登录时间")
    login_browser = models.CharField("登录浏览器", max_length=200, blank=True, null=True)
    login_ip = models.CharField("用户登录ip", max_length=50, blank=True, null=True)
    login_host = models.CharField("登录HOST", max_length=100, blank=True, null=True)
    app_id = models.CharField('APP_ID', max_length=30, blank=True, null=True)

    def __unicode__(self):
        return '{}({})'.format(self.user.chname, self.user.username)

    class Meta:
        verbose_name = "用户登录日志"
        verbose_name_plural = "用户登录日志"


class BkToken(models.Model):
    """登录票据
    """
    token = models.CharField("登录票据", max_length=255, unique=True, db_index=True)
    # 是否已经退出登录
    is_logout = models.BooleanField("票据是否已经执行过退出登录操作", default=False)

    def __uincode__(self):
        return self.token

    class Meta:
        verbose_name = "登录票据"
        verbose_name_plural = "登录票据"
