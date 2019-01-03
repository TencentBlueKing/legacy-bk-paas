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
        ('app', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='AppTags',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(unique=True, max_length=20, verbose_name='\u5206\u7c7b\u540d\u79f0')),
                ('code', models.CharField(unique=True, max_length=30, verbose_name='\u5206\u7c7b\u82f1\u6587ID')),
                ('index', models.IntegerField(default=0, verbose_name='\u6392\u5e8f')),
            ],
            options={
                'db_table': 'paas_apptags',
            },
        ),
        migrations.AddField(
            model_name='app',
            name='tags',
            field=models.ForeignKey(blank=True, to='app.AppTags', help_text='\u5e94\u7528\u5206\u7c7b', null=True),
        ),
    ]
