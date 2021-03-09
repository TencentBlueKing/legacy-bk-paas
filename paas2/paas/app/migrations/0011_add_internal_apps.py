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

from django.db import migrations


def load_data(apps, schema_editor):
    """
    默认内部应用, 为了获取esb鉴权(esb加白)而生成securt_key的给其他系统调用esb使用 而生成的应用
    - bk_paas_log_alert

    is_saas = True
    但是, 不会出现在 我的应用/内置应用列表中
    """
    App = apps.get_model("app", "App")

    App(
        name="bk_paas_log_alert",
        code="bk_paas_log_alert",
        introduction=u"[内部系统-日志告警], 需使用esb的cmsi等接口, 请勿修改其属性等信息",
        creater="internal_default",
        auth_token="defcef66-f80b-11e6-b449-784f4358a163",
        is_saas=False,
        is_sysapp=True
    ).save()


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0010_app_is_platform'),
    ]

    operations = [
        migrations.RunPython(load_data)
    ]
