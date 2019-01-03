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
            name='SaaSUploadFile',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=100, verbose_name='\u6587\u4ef6\u540d')),
                ('size', models.IntegerField(default=0, null=True, verbose_name='\u6587\u4ef6\u5927\u5c0f', blank=True)),
                ('file', models.FileField(upload_to=b'saas_files', verbose_name='\u6587\u4ef6')),
                ('uploaded_at', models.DateTimeField(auto_now_add=True, verbose_name='\u4e0a\u4f20\u65f6\u95f4', db_index=True)),
            ],
            options={
                'ordering': ('-uploaded_at',),
                'db_table': 'paas_saas_upload_file',
                'verbose_name': 'SaaS\u4e0a\u4f20\u5b89\u88c5\u5305',
                'verbose_name_plural': 'SaaS\u4e0a\u4f20\u5b89\u88c5\u5305',
            },
        ),
    ]
