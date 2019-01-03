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
            name='Resource',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=128, verbose_name='\u540d\u79f0')),
                ('version', models.CharField(default=b'--', max_length=36, null=True, verbose_name='\u7248\u672c', blank=True)),
                ('size', models.CharField(default=b'--', max_length=36, null=True, verbose_name='\u6587\u4ef6\u5927\u5c0f', blank=True)),
                ('display', models.BooleanField(default=True, verbose_name='\u662f\u5426\u663e\u793a')),
                ('icon_url', models.CharField(help_text=b'\xe5\xa1\xab\xe5\x86\x99\xe5\xa4\x96\xe7\xbd\x91\xe5\x9c\xb0\xe5\x9d\x80', max_length=256, null=True, verbose_name='\u4e0b\u8f7d\u56fe\u6807', blank=True)),
                ('doc_url', models.CharField(help_text=b'\xe5\xa1\xab\xe5\x86\x99\xe5\xa4\x96\xe7\xbd\x91\xe5\x9c\xb0\xe5\x9d\x80', max_length=256, null=True, verbose_name='\u6587\u6863URL', blank=True)),
                ('download_url', models.CharField(help_text=b'\xe5\xa1\xab\xe5\x86\x99\xe5\xa4\x96\xe7\xbd\x91\xe5\x9c\xb0\xe5\x9d\x80', max_length=256, null=True, verbose_name='\u4e0b\u8f7dURL', blank=True)),
                ('create_time', models.DateTimeField(auto_now_add=True, verbose_name='\u521b\u5efa\u65f6\u95f4')),
            ],
            options={
                'db_table': 'paas_resources',
                'verbose_name': '\u8d44\u6e90\u94fe\u63a5',
                'verbose_name_plural': '\u8d44\u6e90\u94fe\u63a5',
            },
        ),
    ]
