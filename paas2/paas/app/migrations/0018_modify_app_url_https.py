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
from django.conf import settings


def load_data(apps, schema_editor):
    """
    添加 作业平台和配置平台的创建者
    """
    App = apps.get_model("app", "App")

    # 修改 作业平台和配置平台的链接为https
    if settings.HTTP_SCHEMA == "https":
        App.objects.filter(code='bk_cc').update(external_url='https://%s' % settings.HOST_CC)
        App.objects.filter(code='bk_job').update(external_url='https://%s' % settings.HOST_JOB)


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0017_auto_20170905_1459'),
    ]

    operations = [
        migrations.RunPython(load_data)
    ]
