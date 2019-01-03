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
        ('app_env', '0002_auto_20170821_1814'),
    ]

    operations = [
        migrations.AlterField(
            model_name='appenvvar',
            name='mode',
            field=models.CharField(default=b'all', max_length=20, verbose_name='\u751f\u6548\u73af\u5883', choices=[('all', '\u6240\u6709\u73af\u5883'), (b'test', '\u6d4b\u8bd5\u73af\u5883'), (b'prod', '\u6b63\u5f0f\u73af\u5883')]),
        ),
        migrations.AlterField(
            model_name='appenvvar',
            name='value',
            field=models.CharField(max_length=1024, verbose_name='\u53d8\u91cf\u503c'),
        ),
    ]
