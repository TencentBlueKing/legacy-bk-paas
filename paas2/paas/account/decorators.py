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

from functools import wraps

from django.utils.decorators import available_attrs
from django.conf import settings
from django.utils.translation import ugettext as _

from app.models import App
from common.log import logger
from common.mymako import render_json


def login_exempt(view_func):
    """
    登录豁免,被此装饰器修饰的action可以不校验登录
    """

    def wrapped_view(*args, **kwargs):
        return view_func(*args, **kwargs)

    wrapped_view.login_exempt = True
    return wraps(view_func, assigned=available_attrs(view_func))(wrapped_view)


def developer_limit_exempt(view_func):
    """
    登录豁免,被此装饰器修饰的action可以不校验登录
    """

    def wrapped_view(*args, **kwargs):
        return view_func(*args, **kwargs)

    wrapped_view.developer_limit_exempt = True
    return wraps(view_func, assigned=available_attrs(view_func))(wrapped_view)


def verfy_request_header(view_func):
    """
    验证HTTP请求头
    """

    @wraps(view_func, assigned=available_attrs(view_func))
    def _wrapped_view(request, *args, **kwargs):
        x_app_token = request.META.get("HTTP_X_APP_TOKEN")
        x_app_code = request.META.get("HTTP_X_APP_ID")
        if not all([x_app_token, x_app_code]):
            return render_json(
                {
                    "result": False,
                    "code": "1100",
                    "message": _(u"请求头缺少参数:HTTP_X_APP_ID / HTTP_X_APP_TOKEN"),
                    "data": {},
                }
            )
        try:
            # ESB 的token 存放在settings中
            if x_app_code == "esb" and x_app_token == settings.ESB_TOKEN:
                return view_func(request, *args, **kwargs)

            app = App.objects.get(code=x_app_code)
            app_token = app.auth_token
            if not x_app_token == app_token:
                return render_json(
                    {
                        "result": False,
                        "code": "1101",
                        "message": _(u"参数不匹配:HTTP_X_APP_ID / HTTP_X_APP_TOKEN"),
                        "data": {},
                    }
                )
        except Exception as e:
            # 验证HTTP请求头异常
            logger.exception(u"Verification of HTTP request header is abnormal: %s" % e)
            return render_json({"result": False, "code": "1102", "message": _(u"参数不合法:HTTP_X_APP_ID"), "data": {}})

        return view_func(request, *args, **kwargs)

    return _wrapped_view
