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

from django.conf import settings
from django.http import HttpResponseForbidden

from common.mymako import render_mako_tostring_context
from common.responses import FailJsonResponse, OKJsonResponse
from common.views.mako import MakoTemplateView
from common.mixins.base import DeveloperExemptMixin
from components import usermgr


class ProfileView(DeveloperExemptMixin, MakoTemplateView):
    """个人信息页面"""

    template_name = "account/profile.html"

    def get_context_data(self, **kwargs):
        context = super(ProfileView, self).get_context_data(**kwargs)
        request = self.request

        user = request.user
        user_manage_url = "{}://{}/o/bk_user_manage".format(settings.HTTP_SCHEMA, request.get_host())
        reset_password_url = "%s/change_password" % user_manage_url

        context.update(
            {
                "username": user.username,
                "chname": user.chname or "--",
                "phone": user.phone or "--",
                "email": user.email or "--",
                "is_superuser": user.is_superuser,
                "user_manage_url": user_manage_url,
                "reset_password_url": reset_password_url,
            }
        )
        return context


class ModifyUserInfoView(DeveloperExemptMixin, MakoTemplateView):
    """修改用户基本信息"""

    template_name = "account/profile_modify.html"

    def post(self, request):
        # bk_token = request.COOKIES.get(settings.BK_COOKIE_NAME, None)
        username = request.user.username
        data = {
            "chname": request.POST.get("chname").strip(),
            "phone": request.POST.get("phone").strip(),
            "email": request.POST.get("email").strip(),
        }

        ok, message = usermgr.update_user_info(username, **data)
        if not ok:
            return FailJsonResponse(message or "个人信息修改失败")
        return OKJsonResponse("success")


def csrf_failure(request, reason=""):
    return HttpResponseForbidden(render_mako_tostring_context(request, "csrf_failure.html"), content_type="text/html")
