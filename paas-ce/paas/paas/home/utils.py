# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

from __future__ import unicode_literals

import json

from django.conf import settings

from app.models import App
from home.constants import SYS_APP_INFO, LinkTypeEnum
from home.models import UsefulLinks, UserSettings


def get_user_apps(username):
    """
    按顺序获取用户桌面上展示的应用列表
    """
    user_settings, created = UserSettings.objects.get_or_create(username=username)
    apps = user_settings.apps

    # 应用列表apps 存储格式：[code1,code2]
    app_code_list = json.loads(apps) if apps else []

    # 初始化应用列表值时，判断是否需要添加 cc、job链接
    if created:
        if settings.HOST_CC:
            app_code_list.append('bk_cc')
        if settings.HOST_JOB:
            app_code_list.append('bk_job')

    # 组装成前台展示的数据格式
    user_app_list = []

    for code in app_code_list:
        # cc,job 特殊处理逻辑
        if code in ['bk_cc', 'bk_job']:
            user_app_list.append(SYS_APP_INFO.get(code))
            continue

        # 处理第三方应用的数据
        is_user_link, user_link_obj = UsefulLinks.objects.is_userful_link(code)
        if is_user_link and user_link_obj.is_active:
            # 添加存在并已激活的应用数据
            user_app_list.append(user_link_obj.to_dict())
            continue

        # 处理应用的数据
        if App.objects.filter(code=code).exists():
            app_dict = App.objects.gen_user_app_info_for_dashboard(code)
            if app_dict:
                user_app_list.append(app_dict)

    # 判断是否有其他已经上线的应用
    new_online_app_info_list = App.objects.gen_user_new_online_app_info_list_for_dashboard(app_code_list)
    user_app_list.extend(new_online_app_info_list)

    # 初始化时，判断 SaaS 应用是否全部在其中
    all_saas_link = UsefulLinks.objects.filter(is_active=True, link_type=LinkTypeEnum.SAAS.value)
    for _saas in all_saas_link:
        if _saas.code not in app_code_list:
            user_app_list.append(_saas.to_dict())

    # 重新保存应用列表排序
    user_app_code_list = [_app.get('code') for _app in user_app_list]
    user_settings.apps = json.dumps(user_app_code_list)
    user_settings.save()

    return user_app_list
