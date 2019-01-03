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
        ('bkcore', '0004_auto_20170220_2054'),
    ]

    operations = [
        migrations.CreateModel(
            name='AppAccount',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('app_code', models.CharField(help_text='\u6b64\u5904\u8bf7\u7528\u82f1\u6587\u5b57\u6bcd', unique=True, max_length=30, verbose_name='\u5e94\u7528\u7f16\u7801')),
                ('app_token', models.CharField(max_length=128, verbose_name='\u5e94\u7528Token')),
                ('introduction', models.TextField(default=b'', verbose_name='\u5e94\u7528\u7b80\u4ecb', blank=True)),
                ('created_time', models.DateTimeField(auto_now_add=True, verbose_name='\u521b\u5efa\u65f6\u95f4')),
            ],
            options={
                'db_table': 'esb_app_account',
            },
        ),
    ]
