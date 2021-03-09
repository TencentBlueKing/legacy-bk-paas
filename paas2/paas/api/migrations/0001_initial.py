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

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='ApiWhiteList',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('api_name', models.CharField(max_length=20, verbose_name='\u63a5\u53e3\u7c7b\u522b', choices=[(b'app_maker', '\u8f7b\u5e94\u7528\u76f8\u5173\u63a5\u53e3')])),
                ('app_code', models.CharField(max_length=20, verbose_name='\u53ef\u8c03\u7528\u63a5\u53e3\u7684\u5e94\u7528\u7f16\u7801')),
            ],
            options={
                'db_table': 'paas_apiwhitelist',
                'verbose_name': 'PaaS\u63d0\u4f9b\u7684\u63a5\u53e3\u767d\u540d\u5355',
                'verbose_name_plural': 'PaaS\u63d0\u4f9b\u7684\u63a5\u53e3\u767d\u540d\u5355',
            },
        ),
    ]
