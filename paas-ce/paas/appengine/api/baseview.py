# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
import json

from django.views.generic import View
from django.http import HttpResponseForbidden

from api import models


class BaseView(View):

    def dispatch(self, request, *args, **kwargs):
        if request.method == "POST":
            if "application/json" in self.request.META["CONTENT_TYPE"]:
                if request.body:
                    request.json_data = json.loads(request.body)
                else:
                    request.json_data = {}
        return super(BaseView, self).dispatch(request, *args, **kwargs)


class AppView(BaseView):

    def dispatch(self, request, *args, **kwargs):
        x_app_token = self.request.META.get("HTTP_X_APP_TOKEN")
        x_app_code = self.request.META.get("HTTP_X_APP_CODE")
        path_info = self.request.META.get("PATH_INFO")

        if path_info == "/v1/apps/" and request.method == "POST":
            return super(AppView, self).dispatch(request, *args, **kwargs)

        if not x_app_token:
            return HttpResponseForbidden("app_token missing")

        if not x_app_code:
            return HttpResponseForbidden("app_code missing")

        try:
            bk_app = models.BkAppToken.objects.get(key=x_app_token).bk_app
            if x_app_code != bk_app.app_code:
                return HttpResponseForbidden("app_token with app_code not match")
        except Exception, e:
            return HttpResponseForbidden("invalid app_token: %s" % e)

        return super(AppView, self).dispatch(request, *args, **kwargs)


class AgentView(BaseView):
    def dispatch(self, request, *args, **kwargs):
        x_server_id = self.request.META.get('HTTP_X_ID')
        x_token = self.request.META.get('HTTP_X_TOKEN')
        if not x_token:
            return HttpResponseForbidden("server token missing")

        if not x_server_id:
            return HttpResponseForbidden("server id missing")

        try:
            models.BkServer.objects.get(token=x_token, s_id=x_server_id)
        except models.BkServer.DoesNotExist:
            return HttpResponseForbidden("server token and server id not match")

        return super(AgentView, self).dispatch(request, *args, **kwargs)
