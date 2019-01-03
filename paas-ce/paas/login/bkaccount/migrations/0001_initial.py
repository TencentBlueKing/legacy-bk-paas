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
import django.utils.timezone
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('auth', '0006_require_contenttypes_0002'),
    ]

    operations = [
        migrations.CreateModel(
            name='BkUser',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(null=True, verbose_name='last login', blank=True)),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(unique=True, max_length=128, verbose_name='\u7528\u6237\u540d')),
                ('chname', models.CharField(max_length=254, verbose_name='\u4e2d\u6587\u540d', blank=True)),
                ('qq', models.CharField(max_length=32, verbose_name='QQ\u53f7', blank=True)),
                ('phone', models.CharField(max_length=64, verbose_name='\u624b\u673a\u53f7', blank=True)),
                ('email', models.EmailField(max_length=254, verbose_name='\u90ae\u7bb1', blank=True)),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('groups', models.ManyToManyField(related_query_name='user', related_name='user_set', to='auth.Group', blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(related_query_name='user', related_name='user_set', to='auth.Permission', blank=True, help_text='Specific permissions for this user.', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
            },
        ),
        migrations.CreateModel(
            name='BkToken',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('token', models.CharField(unique=True, max_length=255, verbose_name='\u767b\u5f55\u7968\u636e', db_index=True)),
                ('is_logout', models.BooleanField(default=False, verbose_name='\u7968\u636e\u662f\u5426\u5df2\u7ecf\u6267\u884c\u8fc7\u9000\u51fa\u767b\u5f55\u64cd\u4f5c')),
            ],
            options={
                'db_table': 'login_bktoken',
                'verbose_name': '\u767b\u5f55\u7968\u636e',
                'verbose_name_plural': '\u767b\u5f55\u7968\u636e',
            },
        ),
        migrations.CreateModel(
            name='Loignlog',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('login_time', models.DateTimeField(verbose_name='\u767b\u5f55\u65f6\u95f4')),
                ('login_browser', models.CharField(max_length=200, null=True, verbose_name='\u767b\u5f55\u6d4f\u89c8\u5668', blank=True)),
                ('login_ip', models.CharField(max_length=50, null=True, verbose_name='\u7528\u6237\u767b\u5f55ip', blank=True)),
                ('login_host', models.CharField(max_length=100, null=True, verbose_name='\u767b\u5f55HOST', blank=True)),
                ('app_id', models.CharField(max_length=30, null=True, verbose_name=b'APP_ID', blank=True)),
                ('user', models.ForeignKey(verbose_name='\u7528\u6237', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'login_bklog',
                'verbose_name': '\u7528\u6237\u767b\u5f55\u65e5\u5fd7',
                'verbose_name_plural': '\u7528\u6237\u767b\u5f55\u65e5\u5fd7',
            },
        ),
    ]
