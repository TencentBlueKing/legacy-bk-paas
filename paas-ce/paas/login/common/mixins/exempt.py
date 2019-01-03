# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

from __future__ import unicode_literals

from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

from bkaccount.decorators import login_exempt


class CsrfExemptMixin(object):
    """
    Mixin allows you to request without `csrftoken`.
    """
    @method_decorator(csrf_exempt)
    def dispatch(self, *args, **kwargs):
        return super(CsrfExemptMixin, self).dispatch(*args, **kwargs)


class LoginExemptMixin(object):
    """
    Mixin allows you to request without `login`.
    """
    @method_decorator(login_exempt)
    def dispatch(self, *args, **kwargs):
        return super(LoginExemptMixin, self).dispatch(*args, **kwargs)


class CsrfAndLoginExemptMixin(object):
    """
    Mixin allows you to request without `login` and `csrftoken`.
    """
    @method_decorator(csrf_exempt)
    @method_decorator(login_exempt)
    def dispatch(self, *args, **kwargs):
        return super(CsrfAndLoginExemptMixin, self).dispatch(*args, **kwargs)
