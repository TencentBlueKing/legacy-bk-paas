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
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('app', '0008_auto_20170221_1132'),
    ]

    operations = [
        migrations.CreateModel(
            name='AppUseRecord',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('use_time', models.DateTimeField(auto_now_add=True, help_text='\u4f7f\u7528\u65f6\u95f4', null=True, verbose_name='\u6dfb\u52a0\u65f6\u95f4')),
                ('access_host', models.CharField(max_length=128, null=True, verbose_name='\u8bbf\u95ee\u57df\u540d', blank=True)),
                ('source_ip', models.CharField(max_length=64, null=True, verbose_name='\u6765\u6e90IP', blank=True)),
                ('app', models.ForeignKey(verbose_name='\u5e94\u7528', to='app.App')),
                ('user', models.ForeignKey(verbose_name='\u7528\u6237', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'console_analysis_appuserecord',
                'verbose_name': 'App\u8bbf\u95ee\u8bb0\u5f55\u6570\u636e',
                'verbose_name_plural': 'App\u8bbf\u95ee\u8bb0\u5f55\u6570\u636e',
            },
        ),
    ]
