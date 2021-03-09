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
    修改配置平台bk_cc => bk_cmdb
    """
    App = apps.get_model("app", "App")

    # 修改配置平台bk_cc => bk_cmdb, 包括logo
    App.objects.filter(code='bk_cc').update(code="bk_cmdb", logo='applogo/bk_cmdb.png')


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0020_app_open_mode'),
    ]

    operations = [
        migrations.RunPython(load_data)
    ]