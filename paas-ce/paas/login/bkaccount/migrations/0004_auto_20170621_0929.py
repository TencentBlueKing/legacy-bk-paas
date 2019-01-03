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
import django.utils.timezone
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('bkaccount', '0003_bktoken_inactive_expire_time'),
    ]

    operations = [
        migrations.CreateModel(
            name='BkRole',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('code', models.IntegerField(unique=True, verbose_name='\u89d2\u8272\u7f16\u53f7', choices=[(0, '\u666e\u901a\u7528\u6237'), (1, '\u8d85\u7ea7\u7ba1\u7406\u5458'), (2, '\u5f00\u53d1\u8005'), (3, '\u804c\u80fd\u5316\u7528\u6237')])),
            ],
            options={
                'db_table': 'login_bkrole',
                'verbose_name': '\u7528\u6237\u89d2\u8272',
                'verbose_name_plural': '\u7528\u6237\u89d2\u8272',
            },
        ),
        migrations.CreateModel(
            name='BkUserRole',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('create_time', models.DateTimeField(default=django.utils.timezone.now, verbose_name='create_time')),
                ('role', models.ForeignKey(to='bkaccount.BkRole')),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'login_bkuser_role',
                'verbose_name': '\u7528\u6237\u89d2\u8272\u5173\u7cfb\u8868',
                'verbose_name_plural': '\u7528\u6237\u89d2\u8272\u5173\u7cfb\u8868',
            },
        ),
        migrations.AddField(
            model_name='bkuser',
            name='role',
            field=models.ManyToManyField(to='bkaccount.BkRole', verbose_name='\u89d2\u8272', through='bkaccount.BkUserRole'),
        ),
    ]
