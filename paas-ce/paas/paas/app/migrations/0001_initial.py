# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa


from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='App',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(unique=True, max_length=20, verbose_name='\u5e94\u7528\u540d\u79f0')),
                ('code', models.CharField(help_text='\u6b64\u5904\u8bf7\u7528\u82f1\u6587\u5b57\u6bcd', unique=True, max_length=30, verbose_name='\u5e94\u7528\u7f16\u7801')),
                ('introduction', models.TextField(verbose_name='\u5e94\u7528\u7b80\u4ecb')),
                ('creater', models.CharField(max_length=20, verbose_name='\u521b\u5efa\u8005')),
                ('created_date', models.DateTimeField(auto_now_add=True, null=True, verbose_name='\u521b\u5efa\u65f6\u95f4', db_index=True)),
                ('state', models.SmallIntegerField(default=1, help_text='app\u7684\u5f00\u53d1\u72b6\u6001', verbose_name='\u5e94\u7528\u5f00\u53d1\u72b6\u6001', choices=[(0, '\u5df2\u4e0b\u67b6'), (1, '\u5f00\u53d1\u4e2d'), (3, '\u6d4b\u8bd5\u4e2d'), (4, '\u5df2\u4e0a\u7ebf'), (8, '\u6b63\u5728\u63d0\u6d4b'), (9, '\u6b63\u5728\u4e0a\u7ebf'), (10, '\u6b63\u5728\u4e0b\u67b6')])),
                ('is_already_test', models.BooleanField(default=False, help_text='app\u5728\u6d4b\u8bd5\u73af\u5883\u4e0b\u67b6\u6216\u8005\u5f00\u53d1\u4e2d\u72b6\u6001\uff0c\u4fee\u6539\u8be5\u5b57\u6bb5\u4e3aFalse\u3002', verbose_name='\u662f\u5426\u5df2\u7ecf\u63d0\u6d4b')),
                ('is_already_online', models.BooleanField(default=False, help_text='app\u6b63\u5f0f\u73af\u5883\u672a\u4e0b\u67b6\uff0c\u8be5\u5b57\u6bb5\u4e3aTrue\u3002', verbose_name='\u662f\u5426\u5df2\u7ecf\u4e0a\u7ebf')),
                ('first_test_time', models.DateTimeField(help_text='\u8bb0\u5f55\u5e94\u7528\u9996\u6b21\u63d0\u6d4b\u65f6\u95f4', null=True, verbose_name='\u5e94\u7528\u9996\u6b21\u63d0\u6d4b\u65f6\u95f4', db_index=True, blank=True)),
                ('first_online_time', models.DateTimeField(help_text='\u8bb0\u5f55\u5e94\u7528\u9996\u6b21\u4e0a\u7ebf\u65f6\u95f4', null=True, verbose_name='\u5e94\u7528\u9996\u6b21\u4e0a\u7ebf\u65f6\u95f4', db_index=True, blank=True)),
                ('language', models.CharField(default=b'python', choices=[(b'python', b'Python'), (b'php', b'PHP')], max_length=50, blank=True, null=True, verbose_name='\u8bed\u8a00')),
                ('auth_token', models.CharField(max_length=36, null=True, verbose_name=b'Token', blank=True)),
                ('developer', models.ManyToManyField(related_name='developers', verbose_name='\u5f00\u53d1\u8005', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'paas_app',
            },
        ),
        migrations.CreateModel(
            name='SecureInfo',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('app_code', models.CharField(unique=True, max_length=30, verbose_name='\u5bf9\u5e94\u7684appcode')),
                ('vcs_type', models.SmallIntegerField(default=1, help_text='app\u7684\u5f00\u53d1\u72b6\u6001', verbose_name='\u7248\u672c\u63a7\u5236\u7c7b\u578b', choices=[(0, 'Git'), (1, 'SVN')])),
                ('vcs_url', models.CharField(max_length=1024, null=True, verbose_name='\u7248\u672c\u5e93URL', blank=True)),
                ('vcs_username', models.CharField(max_length=50, null=True, verbose_name='\u7248\u672c\u5e93\u7528\u6237\u540d', blank=True)),
                ('vcs_password', models.CharField(max_length=50, null=True, verbose_name='\u7248\u672c\u5e93\u5bc6\u7801', blank=True)),
                ('db_type', models.CharField(default=b'mysql', choices=[(b'mysql', b'MySQL'), (b'postgresql', b'PostgreSQL'), (b'oracle', b'Oracle'), (b'db2', b'DB2'), (b'sqlserver', b'SQL Server')], max_length=20, blank=True, null=True, verbose_name='\u6570\u636e\u5e93\u7c7b\u578b')),
                ('db_host', models.CharField(max_length=1024, null=True, verbose_name='\u6570\u636e\u5e93HOST', blank=True)),
                ('db_port', models.IntegerField(default=3306, null=True, verbose_name='\u6570\u636e\u5e93PORT', blank=True)),
                ('db_name', models.CharField(max_length=30, null=True, verbose_name='\u6570\u636e\u5e93\u540d\u79f0', blank=True)),
                ('db_username', models.CharField(max_length=50, null=True, verbose_name='\u6570\u636e\u5e93\u7528\u6237\u540d', blank=True)),
                ('db_password', models.CharField(max_length=50, null=True, verbose_name='\u6570\u636e\u5e93\u5bc6\u7801', blank=True)),
            ],
            options={
                'db_table': 'paas_app_secureinfo',
                'verbose_name': 'app\u5b89\u5168\u76f8\u5173\u4fe1\u606f',
                'verbose_name_plural': 'app\u5b89\u5168\u76f8\u5173\u4fe1\u606f',
            },
        ),
    ]
