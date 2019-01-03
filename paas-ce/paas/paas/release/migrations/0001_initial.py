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


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Record',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('app_code', models.CharField(max_length=30, verbose_name='\u5bf9\u5e94\u7684appcode', db_index=True)),
                ('operate_id', models.IntegerField(help_text='0\u4e3a\u63d0\u6d4b\u64cd\u4f5c\uff0c1\u4e3a\u4e0a\u7ebf\u64cd\u4f5c', db_index=True, verbose_name='\u64cd\u4f5c\u6807\u8bc6', choices=[(0, '\u63d0\u6d4b'), (1, '\u4e0a\u7ebf'), (2, '\u4e0b\u67b6'), (3, '\u6b63\u5728\u63d0\u6d4b'), (4, '\u6b63\u5728\u4e0a\u7ebf'), (5, '\u6b63\u5728\u4e0b\u67b6'), (6, '\u57fa\u672c\u4fe1\u606f\u6ce8\u518c'), (7, '\u6570\u636e\u5e93\u521b\u5efa'), (8, 'SVN\u4ee3\u7801\u521d\u59cb\u5316'), (9, '\u6570\u636e\u5e93\u6388\u6743'), (10, '\u521d\u59cb\u5316APP\u4ee3\u7801'), (11, '\u5220\u9664APP')])),
                ('operate_user', models.CharField(help_text='\u8fdb\u884c\u4e0a\u7ebf\u6216\u63d0\u6d4b\u64cd\u4f5c\u7684\u4eba', max_length=50, null=True, verbose_name='\u64cd\u4f5c\u4eba', blank=True)),
                ('app_old_state', models.SmallIntegerField(default=1, help_text='\u64cd\u4f5c\u524dapp\u7684\u72b6\u6001', verbose_name='\u64cd\u4f5c\u524dapp\u7684\u72b6\u6001', choices=[(0, '\u5df2\u4e0b\u67b6'), (1, '\u5f00\u53d1\u4e2d'), (3, '\u6d4b\u8bd5\u4e2d'), (4, '\u5df2\u4e0a\u7ebf'), (8, '\u6b63\u5728\u63d0\u6d4b'), (9, '\u6b63\u5728\u4e0a\u7ebf'), (10, '\u6b63\u5728\u4e0b\u67b6')])),
                ('operate_time', models.DateTimeField(auto_now_add=True, null=True, verbose_name='\u64cd\u4f5c\u65f6\u95f4', db_index=True)),
                ('is_success', models.BooleanField(default=False, help_text='\u63d0\u6d4b\u6216\u4e0a\u7ebf\u64cd\u4f5c\u662f\u5426\u6210\u529f', db_index=True, verbose_name='\u64cd\u4f5c\u662f\u5426\u6210\u529f')),
                ('is_tips', models.BooleanField(default=False, help_text='\u662f\u5426\u5728logo\u4e0a\u6dfb\u52a0\u66f4\u65b0\u63d0\u793a', verbose_name='\u663e\u793a\u65b0\u6807\u5fd7')),
                ('is_version', models.BooleanField(default=False, help_text='\u662f\u5426\u5728\u65b0\u5e94\u7528\u5e94\u7528\u6253\u5f00\u65f6\u663e\u793a\u8be5\u7248\u672c\u66f4\u65b0\u7279\u6027', verbose_name='\u663e\u793a\u65b0\u7279\u6027')),
                ('version', models.CharField(help_text='\u9700\u8981\u663e\u793a\u7684\u7248\u672c\u53f7\u4fe1\u606f', max_length=50, null=True, verbose_name='\u7248\u672c\u53f7', blank=True)),
                ('message', models.TextField(help_text='\u6267\u884c\u63d0\u6d4b\u6216\u4e0a\u7ebf\u64cd\u4f5c\u540e\u811a\u672c\u7684\u8fd4\u56de\u4fe1\u606f', null=True, verbose_name='\u64cd\u4f5c\u8fd4\u56de\u4fe1\u606f', blank=True)),
                ('event_id', models.CharField(db_index=True, max_length=36, null=True, verbose_name='Event_id', blank=True)),
                ('extra_data', models.TextField(help_text='json\u4e32\u5b58\u50a8', null=True, verbose_name='\u989d\u5916\u6267\u884c\u7ed3\u679c\u6570\u636e', blank=True)),
            ],
            options={
                'db_table': 'paas_release_record',
                'verbose_name': '\u5e94\u7528\u90e8\u7f72\u64cd\u4f5c\u4fe1\u606f',
                'verbose_name_plural': '\u5e94\u7528\u90e8\u7f72\u64cd\u4f5c\u4fe1\u606f',
            },
        ),
        migrations.CreateModel(
            name='UserOperateRecord',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('app_code', models.CharField(max_length=30, verbose_name='\u64cd\u4f5c\u7684app')),
                ('username', models.CharField(max_length=50, verbose_name='\u64cd\u4f5c\u4eba')),
                ('before_data', models.TextField(null=True, verbose_name='\u64cd\u4f5c\u524d\u6570\u636e', blank=True)),
                ('arfter_data', models.TextField(null=True, verbose_name='\u64cd\u4f5c\u540e\u6570\u636e', blank=True)),
                ('operate_time', models.DateTimeField(auto_now_add=True, verbose_name='\u64cd\u4f5c\u65f6\u95f4')),
                ('operate_type', models.IntegerField(default=0, verbose_name='\u64cd\u4f5c\u7c7b\u578b', choices=[(1, 'APP\u521b\u5efa'), (2, '\u5220\u9664APP'), (3, 'APP\u63d0\u6d4b'), (4, 'APP\u4e0a\u7ebf'), (5, 'APP\u4e0b\u67b6')])),
                ('extra_data', models.TextField(null=True, verbose_name='\u5176\u4ed6\u8bf4\u660e', blank=True)),
            ],
            options={
                'db_table': 'paas_release_useroperaterecord',
                'verbose_name': '\u7528\u6237\u64cd\u4f5c\u6d41\u6c34\u65e5\u5fd7',
                'verbose_name_plural': '\u7528\u6237\u64cd\u4f5c\u6d41\u6c34\u65e5\u5fd7',
            },
        ),
        migrations.CreateModel(
            name='Version',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('version', models.CharField(help_text='\u683c\u5f0f\uff1ax.x.x\uff0c\u53ea\u5141\u8bb8\u5305\u542b\u6570\u5b57', max_length=30, verbose_name='app\u7248\u672c\u53f7')),
                ('code_addr', models.CharField(max_length=200, null=True, verbose_name='\u62c9\u53d6\u7684\u4ee3\u7801\u5730\u5740', blank=True)),
                ('publisher', models.CharField(max_length=30, verbose_name='\u7248\u672c\u53d1\u5e03\u8005')),
                ('pubdate', models.DateTimeField(auto_now_add=True, null=True, verbose_name='\u53d1\u5e03\u65f6\u95f4', db_index=True)),
                ('desc', models.TextField(null=True, verbose_name='\u7248\u672c\u63cf\u8ff0', blank=True)),
                ('app', models.ForeignKey(verbose_name='\u5e94\u7528', to='app.App')),
            ],
            options={
                'db_table': 'paas_release_version',
                'verbose_name': '\u5e94\u7528\u53d1\u5e03\u7248\u672c\u4fe1\u606f',
                'verbose_name_plural': '\u5e94\u7528\u53d1\u5e03\u7248\u672c\u4fe1\u606f',
            },
        ),
        migrations.CreateModel(
            name='VersionDetail',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('features', models.TextField(default=None, help_text='\u8bb0\u5f55\u8be5\u7248\u672c\u7279\u6027\u4fe1\u606f', null=True, verbose_name='\u66f4\u65b0\u7279\u6027', blank=True)),
                ('bug', models.TextField(default=None, help_text='\u8bb0\u5f55\u4fee\u590d\u7684bug\u4fe1\u606f', null=True, verbose_name='\u4fee\u590dbug', blank=True)),
                ('app_version', models.ForeignKey(to='release.Version')),
            ],
            options={
                'db_table': 'paas_release_versiondetail',
                'verbose_name': '\u5e94\u7528\u7279\u5f81\u4fe1\u606f',
                'verbose_name_plural': '\u5e94\u7528\u7279\u5f81\u4fe1\u606f',
            },
        ),
    ]
