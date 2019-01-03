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


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='AppEnvVar',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('app_code', models.CharField(unique=True, max_length=30, verbose_name='\u5bf9\u5e94\u7684appcode')),
                ('mode', models.CharField(default=b'all', max_length=20, verbose_name='\u751f\u6548\u73af\u5883', choices=[(b'test', '\u6d4b\u8bd5\u73af\u5883'), (b'prod', '\u6b63\u5f0f\u73af\u5883'), ('all', '\u6240\u6709\u73af\u5883')])),
                ('name', models.CharField(max_length=50, verbose_name=b'\xe5\x8f\x98\xe9\x87\x8f\xe5\x90\x8d')),
                ('value', models.CharField(max_length=100, verbose_name='\u53d8\u91cf\u503c')),
                ('intro', models.TextField(null=True, verbose_name='\u53d8\u91cf\u4ecb\u7ecd', blank=True)),
            ],
            options={
                'db_table': 'paas_app_envvars',
                'verbose_name': '\u5e94\u7528\u73af\u5883\u53d8\u91cf',
                'verbose_name_plural': '\u5e94\u7528\u73af\u5883\u53d8\u91cf',
            },
        ),
        migrations.AlterUniqueTogether(
            name='appenvvar',
            unique_together=set([('app_code', 'mode', 'name')]),
        ),
    ]
