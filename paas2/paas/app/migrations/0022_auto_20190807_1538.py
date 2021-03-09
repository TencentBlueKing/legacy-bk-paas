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
        ('app', '0021_change_bk_cc_to_bk_cmdb'),
    ]

    operations = [
        migrations.AddField(
            model_name='app',
            name='introduction_en',
            field=models.TextField(null=True, verbose_name='\u82f1\u6587\u5e94\u7528\u7b80\u4ecb', blank=True),
        ),
        migrations.AddField(
            model_name='app',
            name='name_en',
            field=models.CharField(max_length=30, null=True, verbose_name='\u82f1\u6587\u5e94\u7528\u540d\u79f0', blank=True),
        ),
        migrations.AlterField(
            model_name='app',
            name='open_mode',
            field=models.CharField(default=b'desktop', max_length=20, verbose_name='\u5e94\u7528\u6253\u5f00\u65b9\u5f0f', choices=[(b'desktop', '\u684c\u9762'), (b'new_tab', '\u65b0\u6807\u7b7e\u9875')]),
        ),
    ]
