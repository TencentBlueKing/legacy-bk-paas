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
            name='UsefulLinks',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=128, verbose_name='\u540d\u79f0')),
                ('link', models.CharField(max_length=128, verbose_name='\u94fe\u63a5')),
            ],
            options={
                'db_table': 'paas_usefullinks',
            },
        ),
        migrations.CreateModel(
            name='UserApps',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('username', models.CharField(unique=True, max_length=128, verbose_name='\u7528\u6237\u540d\u79f0')),
                ('apps', models.TextField(default=b'', help_text='\u683c\u5f0f\uff1ajson\u6570\u636e[code1,code2,code3]', null=True, verbose_name='\u5e94\u7528\u5217\u8868', blank=True)),
            ],
            options={
                'db_table': 'paas_userapps',
            },
        ),
    ]
