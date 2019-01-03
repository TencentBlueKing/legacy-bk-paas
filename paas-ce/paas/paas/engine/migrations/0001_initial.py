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
import uuid


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='BkApp',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=20)),
                ('logo', models.CharField(max_length=100)),
                ('app_code', models.CharField(unique=True, max_length=100)),
                ('app_lang', models.CharField(max_length=100)),
                ('app_type', models.CharField(max_length=100)),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'ordering': ('created_at',),
                'db_table': 'engine_apps',
                'verbose_name': 'app info',
            },
        ),
        migrations.CreateModel(
            name='BkAppEnv',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('mode', models.CharField(max_length=200)),
                ('key', models.CharField(max_length=200)),
                ('value', models.CharField(max_length=200)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('bk_app', models.ForeignKey(to='engine.BkApp')),
            ],
            options={
                'ordering': ('created_at',),
                'db_table': 'engine_app_envs',
                'verbose_name': 'app env',
            },
        ),
        migrations.CreateModel(
            name='BkAppEvent',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, serialize=False, editable=False, primary_key=True)),
                ('event_type', models.CharField(max_length=200)),
                ('status', models.CharField(max_length=200)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('bk_app', models.ForeignKey(to='engine.BkApp')),
            ],
            options={
                'ordering': ('created_at',),
                'db_table': 'engine_app_events',
                'verbose_name': 'app event',
            },
        ),
        migrations.CreateModel(
            name='BkAppEventLog',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('log', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('bk_app_event', models.ForeignKey(to='engine.BkAppEvent')),
            ],
            options={
                'ordering': ('created_at',),
                'db_table': 'engine_app_event_logs',
                'verbose_name': 'app event log',
            },
        ),
        migrations.CreateModel(
            name='BkAppToken',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('key', models.UUIDField(default=uuid.uuid4, editable=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('bk_app', models.ForeignKey(to='engine.BkApp')),
            ],
            options={
                'ordering': ('created_at',),
                'db_table': 'engine_app_tokens',
                'verbose_name': 'app token',
            },
        ),
        migrations.CreateModel(
            name='BkCluster',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=20)),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'ordering': ('created_at',),
                'db_table': 'engine_clusters',
                'verbose_name': 'cluster info',
            },
        ),
        migrations.CreateModel(
            name='BkHostingShip',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('is_active', models.BooleanField(default=True)),
                ('is_master', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('bk_app', models.ForeignKey(to='engine.BkApp')),
            ],
            options={
                'ordering': ('created_at',),
                'db_table': 'engine_hosting_ships',
                'verbose_name': 'router map',
            },
        ),
        migrations.CreateModel(
            name='BkServer',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=20, verbose_name='\u540d\u79f0')),
                ('s_id', models.UUIDField(default=uuid.uuid4, verbose_name='\u670d\u52a1ID', editable=False)),
                ('token', models.UUIDField(default=uuid.uuid4, editable=False)),
                ('ip_address', models.CharField(max_length=36, verbose_name='IP\u5730\u5740')),
                ('ip_port', models.CharField(default=b'4245', max_length=36, verbose_name='\u7aef\u53e3')),
                ('category', models.CharField(default=b'tapp', max_length=36, verbose_name='\u5206\u7c7b', choices=[(b'tapp', b'App\xe6\xb5\x8b\xe8\xaf\x95\xe7\x8e\xaf\xe5\xa2\x83'), (b'app', b'App\xe6\xad\xa3\xe5\xbc\x8f\xe7\x8e\xaf\xe5\xa2\x83')])),
                ('info', models.CharField(max_length=200, verbose_name='\u5907\u6ce8')),
                ('is_active', models.BooleanField(default=True, verbose_name='\u542f\u7528')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('apps', models.ManyToManyField(to='engine.BkApp', through='engine.BkHostingShip', blank=True)),
            ],
            options={
                'ordering': ('created_at',),
                'db_table': 'engine_servers',
                'verbose_name': '\u670d\u52a1\u5668\u4fe1\u606f',
                'verbose_name_plural': '\u670d\u52a1\u5668\u4fe1\u606f',
            },
        ),
        migrations.AddField(
            model_name='bkhostingship',
            name='bk_server',
            field=models.ForeignKey(to='engine.BkServer'),
        ),
    ]
