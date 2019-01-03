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
from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm

from bkaccount.models import BkUser
from bkaccount.constants import (USERNAME_CHECK_PATTERN, CHNAME_CHECK_PATTERN,
                                 PHONE_CHECK_PATTERN, PASSWORD_CHECK_PATTERN)


class BkUserCreationForm(UserCreationForm):
    """
    A form that creates a user, with no privileges, from the given email andpassword
    """

    def __init__(self, *args, **kargs):
        super(BkUserCreationForm, self).__init__(*args, **kargs)

    class Meta:
        model = BkUser
        fields = ("username",)


class BkUserChangeForm(UserChangeForm):
    """
    A form for updating users

    Includes all the fields onthe user,
    but replaces the password field with admin'spassword hash display field.
    """

    def __init__(self, *args, **kargs):
        super(BkUserChangeForm, self).__init__(*args, **kargs)

    class Meta:
        model = BkUser
        fields = ('username', 'password')


class UserQueryForm(forms.Form):
    search_data = forms.CharField(required=False)
    search_role = forms.CharField(required=False)
    page = forms.IntegerField(required=False)
    page_size = forms.IntegerField(required=False)

    def clean_search_data(self):
        search_data = self.cleaned_data["search_data"]
        return search_data.replace('&nbsp;', '').strip()

    def clean_page(self):
        page = self.cleaned_data["page"]
        return 1 if page is None else page

    def clean_page_size(self):
        page_size = self.cleaned_data["page_size"]
        return 10 if page_size is None else page_size


class BaseUserInfoForm(forms.Form):
    chname = forms.CharField(max_length=16)
    phone = forms.CharField(max_length=11)
    email = forms.EmailField(max_length=254)

    def clean_chname(self):
        chname = self.cleaned_data["chname"]
        chname = chname.strip()
        if not CHNAME_CHECK_PATTERN.match(chname):
            self.add_error('chname', _("中文名错误，只能包含数字、字母、中文汉字、下划线，长度在1-16个字符"))
        return chname

    def clean_phone(self):
        phone = self.cleaned_data["phone"]
        phone = phone.strip()
        if not PHONE_CHECK_PATTERN.match(phone):
            self.add_error('phone', _("手机号错误，仅支持11位数字的号码"))
        return phone


class UserInfoForm(BaseUserInfoForm):
    username = forms.CharField(max_length=20, min_length=4, error_messages={
        "required": _("用户名不能为空"),
        "max_length": _("用户名长度不能超过20个字符"),
        "min_length": _("用户名长度不能少于4个字符")
    })
    role = forms.IntegerField(required=False)

    def clean_username(self):
        username = self.cleaned_data["username"]
        username = username.strip()
        if not USERNAME_CHECK_PATTERN.match(username):
            self.add_error('username', _("用户名错误，只能包含数字、字母、下划线和点，长度在4-20个字符，且必须以字母或数字开头"))
        return username


class SetPasswordForm(forms.Form):
    new_password1 = forms.CharField(max_length=20, min_length=8, error_messages={
        "required": _("新密码不能为空"),
        "max_length": _("密码长度不能超过20个字符"),
        "min_length": _("密码长度不能少于8个字符")
    })
    new_password2 = forms.CharField()

    def clean_new_password2(self):
        password1 = self.cleaned_data['new_password1']
        password1 = password1.strip()
        password2 = self.cleaned_data['new_password2']
        password2 = password2.strip()
        if not all([password1, password2]):
            self.add_error('new password', _("新密码不能为空"))
        if password1 != password2:
            self.add_error('new password', _("两次输入的新密码不一致"))
        if not PASSWORD_CHECK_PATTERN.match(password1):
            self.add_error("new password", _("密码只支持数字、字母或!@#$%^*()_-+=，长度在8-20个字符，且必须保证包含大小写字母和数字"))
        return password1


class PasswordForm(forms.Form):
    new_password = forms.CharField(max_length=20, min_length=8, error_messages={
        "required": _("新密码不能为空"),
        "max_length": _("密码长度不能超过20个字符"),
        "min_length": _("密码长度不能少于8个字符")
    })

    def clean_new_password(self):
        new_password = self.cleaned_data['new_password']
        new_password = new_password.strip()
        if not PASSWORD_CHECK_PATTERN.match(new_password):
            self.add_error("new password", _("密码只支持数字、字母或!@#$%^*()_-+=，长度在8-20个字符，且必须保证包含大小写字母和数字"))
        return new_password


class WeixinInfoForm(forms.Form):
    wx_userid = forms.CharField(error_messages={"required": _("wx_userid 不能为空")})


class ImportUserForm(forms.Form):
    file_name = forms.CharField(error_messages={"required": _("文件必须上传")})

    def clean_file_name(self):
        try:
            file_name = self.cleaned_data['file_name']
            file_type = file_name.split(".")[-1]
        except Exception:
            self.add_error("file_name", _("批量导入用户，解析文件名出错"))
        if file_type not in ['xls', 'xlsx']:
            self.add_error("file_name", _("文件格式错误，只支持：.xls 和 .xlsx 文件"))
        return file_name
