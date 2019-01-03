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

from common.responses import FailJsonResponse


class AccessMixin(object):
    """
    'Abstract' mixin that gives access mixins the same customizable
    functionality.
    """
    pass


class SuperuserRequiredMixin(AccessMixin):
    """
    Mixin allows you to require a user with `is_superuser` set to True.
    """
    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            return FailJsonResponse(_(u"非管理员, 没有权限进行操作, 请找管理员申请权限!"))
        return super(SuperuserRequiredMixin, self).dispatch(request, *args, **kwargs)


class SuperuserOrPutOwnerRequiredMixin(AccessMixin):
    """
    Mixin allows you to require a user with `is_superuser` or `Owner` set to True.
    Put: is_superuser or owner
    Post Delete Get: is_superuser
    """
    def dispatch(self, request, *args, **kwargs):
        user_id = kwargs.get('user_id')
        is_put_owner = request.method == "PUT" and user_id is not None and request.user.id == int(user_id)
        if not request.user.is_superuser and not is_put_owner:
            return FailJsonResponse(_(u"非管理员, 没有权限进行操作, 请找管理员申请权限!"))
        return super(SuperuserOrPutOwnerRequiredMixin, self).dispatch(request, *args, **kwargs)
