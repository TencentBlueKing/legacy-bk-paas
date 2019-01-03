# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa


from __future__ import unicode_literals

from django.db import migrations, models
from bk_app.utils import init_saas_app_db_info
from bk_app.constants import SAAS_LIST


def init_saas_app_info(apps, schema_editor):
    for saas_info in SAAS_LIST:
        app_id = saas_info.get("app_id")
        config = saas_info.get("config")
        file = saas_info.get("file")
        init_saas_app_db_info(app_id, config, file)


class Migration(migrations.Migration):

    dependencies = [
        ('saas', '0006_auto_20161111_1827'),
    ]

    operations = [
        migrations.RunPython(init_saas_app_info),
    ]
