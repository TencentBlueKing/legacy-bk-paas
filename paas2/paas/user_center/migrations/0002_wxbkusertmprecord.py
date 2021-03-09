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
        ('user_center', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='RoleApplyReocrd',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('operator', models.CharField(max_length=32, verbose_name='\u7533\u8bf7\u4eba')),
                ('create_time', models.DateTimeField(auto_now_add=True, verbose_name='\u521b\u5efa\u65f6\u95f4', null=True)),
                ('apply_reason', models.TextField(null=True, verbose_name='\u7533\u8bf7\u539f\u56e0', blank=True)),
                ('apply_role', models.CharField(default=b'2', max_length=32, verbose_name='\u7533\u8bf7\u7684\u89d2\u8272')),
                ('approver', models.CharField(max_length=32, null=True, verbose_name='\u5ba1\u6279\u4eba', blank=True)),
                ('approval_result', models.CharField(default=b'applying', max_length=32, verbose_name='\u5ba1\u6279\u7ed3\u679c', choices=[(b'applying', '\u7533\u8bf7\u4e2d'), (b'pass', '\u5ba1\u6279\u901a\u8fc7'), (b'reject', '\u9a73\u56de')])),
                ('approval_time', models.DateTimeField(null=True, verbose_name='\u5ba1\u6279\u65f6\u95f4', blank=True)),
                ('approval_reason', models.TextField(null=True, verbose_name='\u5ba1\u6279\u539f\u56e0', blank=True)),
            ],
            options={
                'db_table': 'console_user_role_apply_record',
                'verbose_name': '\u7528\u6237\u89d2\u8272\u6743\u9650\u8868',
                'verbose_name_plural': '\u7528\u6237\u89d2\u8272\u6743\u9650\u8868',
            },
        ),
    ]
