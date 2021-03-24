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

from builtins import object
from django.contrib.auth.forms import UserCreationForm, UserChangeForm

from account.models import BkUser


class BkUserCreationForm(UserCreationForm):
    """
    A form that creates a user, with no privileges, from the given email andpassword
    """

    def __init__(self, *args, **kargs):
        super(BkUserCreationForm, self).__init__(*args, **kargs)

    class Meta(object):
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

    class Meta(object):
        model = BkUser
        fields = ("username", "password")
