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

from app.models import App
from common.log import logger


class SaaSAppManager(models.Manager):

    def update_logo(self, app_code, logo):
        self.filter(code=app_code).update(logo=logo)

    def query_saas_list(self, keyword, hide_offline, start, end):
        app_all_list = self.all().order_by('-created_time')

        # 获取应用
        if keyword:
            app_all_list = app_all_list.filter(
                Q(name__icontains=keyword) | Q(code__icontains=keyword)
            )
        # 过滤已经下架的应用
        if hide_offline == 0:
            app_all_list = app_all_list.exclude(app__state=0)

        total = app_all_list.count()
        app_list = app_all_list[start:end]

        return total, app_list

    def exists(self, app_code):
        """判断app_code是否已存在
        """
        return self.filter(code=app_code).exists()

    def update_online_version(self, app_code):
        logger.info("更新SaaSApp的online_version: %s", app_code)
        try:
            app = App.objects.get(code=app_code)
            saas_app = self.get(app=app)
            saas_app.online_version = saas_app.current_version
            saas_app.save()
        except Exception:
            logger.exception("更新SaaSApp的online_version失败. app_code=%s", app_code)
            return False

        return True

    def update_current_version(self, app, saas_app_version):
        saas_app = self.get(app=app)
        saas_app.current_version = saas_app_version
        saas_app.save()


class SaaSUploadFileManager(models.Manager):
    pass


class SaaSAppVersionManager(models.Manager):
    def delete_all_versions(self, saas_app):
        versions = self.filter(saas_app=saas_app).all()
        for version in versions:
            upload_file = version.upload_file
            upload_file.file.delete()
            upload_file.delete()

            version.delete()
