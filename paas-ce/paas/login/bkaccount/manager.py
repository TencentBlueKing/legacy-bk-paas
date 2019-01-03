# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
from __future__ import unicode_literals

from django.utils.translation import ugettext as _
from django.db import models
from django.db.models import Q
from django.db import IntegrityError
from django.contrib.auth.models import BaseUserManager
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.conf import settings
from django.utils import timezone

from common.log import logger
from bkaccount.constants import (RoleCodeEnum, ROLECODE_LIST, ApiErrorCodeEnum)


class BkUserManager(BaseUserManager):
    """
    BK user manager
    """

    def _create_user(self, username, password, is_superuser, **extra_fields):
        """
        Create and saves a User with the given username and password
        """
        if not username:
            raise ValueError("please fill in username")

        now = timezone.now()
        user = self.model(
            username=username,
            is_superuser=is_superuser,
            last_login=now,
            date_joined=now, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, username, password=None, **extra_fields):
        return self._create_user(username, password, False,
                                 **extra_fields)

    def create_superuser(self, username, password, **extra_fields):
        return self._create_user(username, password, True,
                                 **extra_fields)

    def _check_user_exist(self, username):
        """
        检查用户是否存在
        """
        try:
            user = self.get(username=username)
        except Exception:
            return False, None, _("用户名不存在")
        return True, user, ''

    def _get_user_info(self, user):
        return {
            'username': user.username,
            'chname': user.chname,
            'qq': '',
            'phone': user.phone,
            'email': user.email,
            'role': str(user.role_code),
            'wx_userid': user.wx_userid,
            'language': user.language,
            'time_zone': user.time_zone
        }

    def _get_user_info_v2(self, user):
        return {
            'bk_username': user.username,
            'chname': user.chname,
            'qq': '',
            'phone': user.phone,
            'email': user.email,
            'bk_role': user.role_code,
            'wx_userid': user.wx_userid,
            'language': user.language,
            'time_zone': user.time_zone
        }

    def get_user_info(self, username):
        """
        获取用户信息（结果，用户信息，错误信息）
        """
        is_exist, user, msg = self._check_user_exist(username)
        if not is_exist:
            return False, {}, msg
        return True, self._get_user_info(user), ''

    def get_user_info_v2(self, username):
        """
        获取用户信息（结果，用户信息，错误信息）
        """
        is_exist, user, msg = self._check_user_exist(username)
        if not is_exist:
            return False, {}, msg
        return True, self._get_user_info_v2(user), ''

    def get_all_user(self, role):
        """
        获取所有用户
        """
        users = self.all()
        if role.isdigit() and int(role) in ROLECODE_LIST:
            users = [user for user in users if user.role_code == int(role)]
        return [self._get_user_info(user) for user in users]

    def get_all_users_v2(self, role):
        """
        获取所有用户
        """
        users = self.all()
        if role.isdigit() and int(role) in ROLECODE_LIST:
            users = [user for user in users if user.role_code == int(role)]
        return [self._get_user_info_v2(user) for user in users]

    def get_batch_user_with_dict(self, username_list):
        """
        批量获取用户，并以username为key的字典返回
        """
        data = {}
        users = self.filter(username__in=username_list)
        for user in users:
            data[user.username] = self._get_user_info(user)
        return data

    def get_batch_users_with_dict_v2(self, username_list):
        """
        批量获取用户，并以username为key的字典返回
        """
        data = {}
        users = self.filter(username__in=username_list)
        for user in users:
            data[user.username] = self._get_user_info_v2(user)
        return data

    def modify_password_by_username(self, username, password):
        """
        修改用户密码(结果，错误类型，错误信息)
        """
        is_exist, user, msg = self._check_user_exist(username)
        if not is_exist:
            return False, ApiErrorCodeEnum.USER_NOT_EXISTS, msg
        try:
            # 更新密码
            user.set_password(password)
            user.save()
        except Exception as error:
            logger.exception('user paasword reset error: {}'.format(error))
            return False, ApiErrorCodeEnum.USER_INFO_UPDATE_FAIL, _("用户密码重置失败")
        return True, ApiErrorCodeEnum.SUCCESS, ''

    def modify_user_info(self, username, chname, phone, email):
        """
        修改用户信息(结果，错误类型，错误信息)
        """
        is_exist, user, msg = self._check_user_exist(username)
        if not is_exist:
            return False, ApiErrorCodeEnum.USER_NOT_EXISTS, msg
        try:
            user.chname = chname
            user.phone = phone
            user.email = email
            user.save()
        except Exception as error:
            logger.exception('user info modify failed, error: {}'.format(error))
            return False, ApiErrorCodeEnum.USER_INFO_UPDATE_FAIL, _("个人信息修改失败")
        return True, ApiErrorCodeEnum.SUCCESS, ''

    def _modify_or_create_user_role(self, user, role_code):
        """
        修改或者添加用户角色
        """
        from bkaccount.models import BkUserRole, BkRole
        # 先删除
        BkUserRole.objects.filter(user=user).delete()
        # 后添加
        bkrole = BkRole.objects.get(code=role_code)
        BkUserRole.objects.create(user=user, role=bkrole)
        return True

    def modify_user_role(self, username, role):
        """
        修改用户角色
        """
        is_exist, user, msg = self._check_user_exist(username)
        if not is_exist:
            return False, msg
        if role in ROLECODE_LIST:
            # 最后一个管理员不能修改角色
            if role != RoleCodeEnum.SUPERUSER and not self.exclude(id=user.id).filter(is_superuser=True).exists():
                return False, _("该用户是最后一个管理员，不可修改其角色")
            user.is_superuser = (role == RoleCodeEnum.SUPERUSER)
            user.save()
            self._modify_or_create_user_role(user, role)
        return True, ''

    def get_batch_user_with_paginator(self, page, page_size, search_username, search_data, search_role):
        """
        批量获取用户信息 并分页
        """
        # 根据查询条件过滤
        if search_username:
            all_query = self.filter(username=search_username)
        else:
            all_query = self.all().order_by('-id')

        if search_role:
            all_query = all_query.filter(role__code=int(search_role))
        if search_data:
            all_query = all_query.filter(
                Q(username__icontains=search_data) |
                Q(chname__icontains=search_data)
            )
        # 获取分页信息
        paginator = Paginator(all_query, page_size)
        try:
            records = paginator.page(page)
        except PageNotAnInteger:
            records = paginator.page(1)
        except EmptyPage:
            records = paginator.page(paginator.num_pages)
        return records

    def modify_or_create_user_by_userid(self, user_id, username, chname, phone, email, role):
        """
        修改或者创建用户
        """
        try:
            # 最后一个管理员不能去除管理员角色
            if user_id and role != RoleCodeEnum.SUPERUSER:
                if not self.exclude(id=user_id).filter(is_superuser=True).exists():
                    return False, user_id, _("用户是最后一个管理员，不可修改其角色")
            if user_id:
                user = self.get(id=user_id)
                user.chname = chname
                user.phone = phone
                user.email = email
                user.is_superuser = (role == RoleCodeEnum.SUPERUSER)
                user.save()
            else:
                user = self.create(
                    username=username,
                    chname=chname,
                    qq='',
                    phone=phone,
                    email=email,
                    is_superuser=(role == RoleCodeEnum.SUPERUSER)
                )
                # 新用户设置默认密码
                user.set_password(settings.PASSWORD)
                user.save()
                user_id = user.id
            # 添加或者修改用户角色
            if role in ROLECODE_LIST:
                self._modify_or_create_user_role(user, role)
        except IntegrityError:
            return False, user_id, _("用户已经存在")
        except Exception as error:
            logger.exception("user info save failed, error: {}".format(error))
            return False, user_id, _("保存用户信息出错")
        return True, user_id, ''

    def modify_or_create_user_by_username(self, username, chname, phone, email, role=None):
        """
        通过username,修改或者创建用户
        """
        user, _c = self.get_or_create(username=username)
        user.chname = chname
        user.qq = ''
        user.phone = phone
        user.email = email
        # 新增用户
        if _c:
            # 新用户设置默认密码
            user.set_password(settings.PASSWORD)
            # 新用户 role为None则为STAFF
            role = role if role is not None else RoleCodeEnum.STAFF
        # 非新增用户只有role非None才进行修改，新用户一定设置
        if role is not None:
            user.is_superuser = (role == RoleCodeEnum.SUPERUSER)
            self._modify_or_create_user_role(user, role)
        user.save()
        return True

    def delete_user(self, user_id):
        """
        删除用户
        """
        try:
            user = self.get(id=user_id)
            # admin用户不可删除
            if user.username == 'admin':
                return False, _("内置admin用户不可删除")
            # 最后一个管理员，则不可删除
            if user.is_superuser and not self.exclude(id=user_id).filter(is_superuser=True).exists():
                return False, _("最后一个管理员用户，不允许删除")
            # 删除用户
            self.filter(id=user_id).delete()
        except Exception as error:
            logger.exception("user delete failed, error: {}".format(error))
            return False, _("用户删除失败")
        return True, ''

    def modify_password_by_userid(self, user_id, password):
        """
        修改用户密码(结果，错误类型，错误信息)
        """
        try:
            user = self.get(id=user_id)
            # 更新密码
            user.set_password(password)
            user.save()
        except Exception as error:
            logger.exception('user reset password failed, error: {}'.format(error))
            return False, _("用户密码重置失败")
        return True, ''

    def bind_wx_user_info(self, user, wx_userid):
        """
        绑定微信信息
        """
        try:
            # 查看用户是否已绑定
            if user.wx_userid:
                return False, _("已经绑定了微信，请解绑后再重新绑定！")
            # 检测wx_userid是否已经被绑定
            from bkaccount.models import UserInfo
            if UserInfo.objects.filter(wx_userid=wx_userid).exists():
                return False, _("该微信号已经被绑定过了")
            user_info, _c = UserInfo.objects.get_or_create(user=user)
            user_info.wx_userid = wx_userid
            user_info.bind_time = timezone.now()
            user_info.save()
        except Exception as error:
            logger.exception(u"user wechat info bind failed, error: {}".format(error))
            return False, _("绑定用户微信信息失败")
        return True, ''

    def unbind_wx_user_info(self, user):
        """
        解绑用户微信信息
        """
        try:
            # 检查用户是否已经被绑定
            from bkaccount.models import UserInfo
            if not UserInfo.objects.filter(user=user).exists():
                return False, _("账号未绑定过微信号，无法解绑")
            UserInfo.objects.filter(user=user).update(wx_userid='')
        except Exception as error:
            logger.exception("user（%s）wechat info unbind failed, error: {}".format(error))
            return False, _("解绑用户微信信息失败")
        return True, ''

    def set_user_i18n_info(self, user, language=None, time_zone=None):
        """
        设置用户国际化信息
        """
        from bkaccount.models import UserInfo
        user_info, _c = UserInfo.objects.get_or_create(user=user)
        if language:
            user_info.language = language
        if time_zone:
            user_info.time_zone = time_zone
        user_info.save()


class LoginLogManager(models.Manager):
    """
    User login log manager
    """

    def record_login(self, _user, _login_browser, _login_ip, host, app_id):
        try:
            self.model(
                user=_user,
                login_browser=_login_browser,
                login_ip=_login_ip,
                login_host=host,
                login_time=timezone.now(),
                app_id=app_id,
            ).save()
            return (True, _("记录成功"))
        except Exception:
            return (False, _("用户登录记录失败"))
