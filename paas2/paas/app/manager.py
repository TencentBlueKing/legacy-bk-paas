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


from django.db import models
from django.db.models import Q
from django.conf import settings

from app.constants import AppStateEnum


class SecureInfoManager(models.Manager):
    def get_app_deploy_vars(self, app_code):
        """
        deploy_vars: 目前只有 vcs 版本管理信息
        """
        info = self.filter(app_code=app_code)
        if not info:
            return {}

        info = info[0]
        return {
            "VCS_TYPE": info.vcs_type_text,
            "VCS_PATH": info.vcs_url,
            "VCS_USERNAME": info.vcs_username,
            "VCS_PASSWORD": info.vcs_password,
            "VCS_CHECKOUT_TARGET": info.vcs_checkout_target,
        }

    def get_app_env(self, app_code, is_with_db_info=False):
        from app.models import App

        app = App.objects.get(code=app_code)
        info = self.filter(app_code=app_code)
        if not info:
            return {}

        # add host to env
        bk_paas_host = "%s://%s" % (settings.HTTP_SCHEMA, settings.PAAS_DOMAIN)
        bk_paas_inner_host = "%s://%s" % ("http", settings.PAAS_INNER_DOMAIN)
        bk_cc_host = "%s://%s" % (settings.HTTP_SCHEMA, settings.HOST_CC)
        bk_job_host = "%s://%s" % (settings.HTTP_SCHEMA, settings.HOST_JOB)

        info = info[0]
        envs = {
            "APP_ID": info.app_code,
            "APP_TOKEN": app.auth_token,
            "BK_PAAS_HOST": bk_paas_host,
            "BK_PAAS_INNER_HOST": bk_paas_inner_host,
            "BK_CC_HOST": bk_cc_host,
            "BK_JOB_HOST": bk_job_host,
        }
        # update envs in settings_*.py
        envs.update(settings.APP_DEPLOY_ENVS)

        if is_with_db_info:
            envs.update(
                {
                    "DB_TYPE": info.db_type,
                    "DB_HOST": info.db_host,
                    "DB_PORT": info.db_port,
                    "DB_NAME": info.db_name,
                    "DB_USERNAME": info.db_username,
                    "DB_PASSWORD": info.db_password,
                }
            )

        # 值转成字符串
        for key, value in envs.iteritems():
            envs[key] = str(value)

        return envs


class AppManager(models.Manager):
    """
    应用数据库操作
    """

    def get_queryset(self):
        """
        重写 查询
        """
        # PaaS3.0 上创建的应用和已经迁移到 PaaS3.0 的应用不在 PaaS2.0 上展示
        return super(AppManager, self).get_queryset().filter(
            is_sysapp=False, from_paasv3=False, migrated_to_paasv3=False)

    def query_app_list(self, user_app_list, keyword, hide_outline, is_saas, is_lapp, is_third, page, page_size):
        start = (page - 1) * page_size
        end = page * page_size

        # 超级管理员可以查看所有的应用
        app_all_list = (
            self.filter(is_saas=is_saas, is_lapp=is_lapp, is_third=is_third, code__in=user_app_list)
            .order_by("-created_date")
            .distinct()
        )

        if keyword:
            app_all_list = app_all_list.filter(
                Q(name__icontains=keyword) | Q(code__icontains=keyword) | Q(creater__icontains=keyword)
            )

        if hide_outline == 0:
            app_all_list = app_all_list.exclude(state=0)

        total = app_all_list.count()
        app_list = app_all_list[start:end]

        return total, app_list

    def gen_user_app_info_for_dashboard(self, code):
        app = self.get(code=code)
        if app.is_already_online and app.state not in [AppStateEnum.OUTLINE, AppStateEnum.DEVELOPMENT]:
            # 添加上线，同时不处于下线和开发中的应用数据
            return app.gen_dashboard_dict(is_online=True)
        return None

    def gen_user_new_online_app_info_list_for_dashboard(self, app_code_list):
        new_online_app_info_list = []
        new_online_apps = (
            self.exclude(code__in=app_code_list)
            .filter(is_already_online=True)
            .exclude(state__in=[AppStateEnum.OUTLINE, AppStateEnum.DEVELOPMENT])
        )
        for _app in new_online_apps:
            app_dict = _app.gen_dashboard_dict(is_online=True)
            new_online_app_info_list.append(app_dict)

        return new_online_app_info_list


class AppTagManager(models.Manager):
    def get_all_tags(self):
        """
        获取所有分类
        """
        alltags = self.all()
        tags = [(tag.code, tag.name_display) for tag in alltags if tag]
        return tags

    def get_target_tag_or_default(self, tag_name):
        if self.filter(name=tag_name).exists():
            return self.get(name=tag_name)

        try:
            return self.get(name=u"其它")
        except Exception:
            return None

    def get_tag_by_code(self, tag_code, is_default=True):
        """
        通过code获取分类对象
        is_default 表示不存在返回默认分类
        """
        if self.filter(code=tag_code).exists():
            return self.get(code=tag_code)
        if is_default:
            try:
                return self.get(code="Other")
            except Exception:
                return None
        return None
