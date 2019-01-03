# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

from __future__ import unicode_literals

from django.db.models import Q
from django.db import models

from app.constants import AppStateEnum


class AppManager(models.Manager):

    def to_state(self, app_code, state, **kwargs):
        self.filter(code=app_code).update(state=state, **kwargs)

    def query_app_list(self, is_superuser, username, keyword, hide_offline, start, end):
        # 超级管理员可以查看所有的应用
        app_all_list = self.filter(is_saas=False)
        if is_superuser:
            app_all_list = app_all_list.order_by('-created_date')
        else:
            app_all_list = app_all_list.filter(Q(developer__username=username) | Q(creater=username))\
                                       .order_by('-created_date').distinct()
        has_app = app_all_list.count() > 0
        if keyword:
            app_all_list = app_all_list.filter(
                Q(name__icontains=keyword) | Q(code__icontains=keyword) | Q(creater__icontains=keyword)
            )

        if hide_offline == 0:
            app_all_list = app_all_list.exclude(state=AppStateEnum.OFFLINE.value)
            # app_all_list = app_all_list.exclude(state__gt=1, is_already_test=False, is_already_online=False)

        total = app_all_list.count()
        app_list = app_all_list[start:end]

        return has_app, total, app_list

    def gen_user_app_info_for_dashboard(self, code):
        app = self.get(code=code)
        if app.is_already_online and app.state not in [AppStateEnum.OFFLINE.value, AppStateEnum.DEVELOPMENT.value]:
            # 添加上线，同时不处于下线和开发中的应用数据
            return app.gen_dashboard_dict(is_online=True)
        return None

    def gen_user_new_online_app_info_list_for_dashboard(self, app_code_list):
        new_online_app_info_list = []
        new_online_apps = self.exclude(code__in=app_code_list)\
                              .filter(is_already_online=True)\
                              .exclude(state__in=[AppStateEnum.OFFLINE.value, AppStateEnum.DEVELOPMENT.value])
        for _app in new_online_apps:
            app_dict = _app.gen_dashboard_dict(is_online=True)
            new_online_app_info_list.append(app_dict)

        return new_online_app_info_list

    def trigger_celery(self, is_use_celery, is_use_celery_beat):
        self.is_use_celery = is_use_celery
        self.is_use_celery_beat = is_use_celery_beat
        self.save()


class SecureInfoManager(models.Manager):

    def get_vcs_info(self, app_code):
        """vcs 版本管理信息
        """
        info = self.filter(app_code=app_code)
        if not info:
            return {}

        info = info[0]
        return {"VCS_TYPE": info.vcs_type_text,
                "VCS_PATH": info.vcs_url,
                "VCS_USERNAME": info.vcs_username,
                "VCS_PASSWORD": info.vcs_password,
                }

    def get_db_info(self, app_code):
        info = self.filter(app_code=app_code)
        if not info:
            return {}

        info = info[0]
        return {
            "DB_TYPE": info.db_type,
            "DB_HOST": info.db_host,
            "DB_PORT": info.db_port,
            "DB_NAME": info.db_name,
            "DB_USERNAME": info.db_username,
            "DB_PASSWORD": info.db_password,
        }

    def exists(self, app_code):
        info = self.filter(app_code=app_code)
        if not info:
            return False
        return True
