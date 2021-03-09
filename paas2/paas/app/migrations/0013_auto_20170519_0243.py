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
        ('app', '0012_init_default_or_third_app'),
    ]

    operations = [
        migrations.AddField(
            model_name='app',
            name='is_lapp',
            field=models.BooleanField(default=False, help_text='\u6807\u51c6\u8fd0\u7ef4\u521b\u5efa\u7684\u5e94\u7528', verbose_name='\u662f\u5426\u4e3a\u8f7b\u5e94\u7528'),
        ),
        migrations.AlterField(
            model_name='app',
            name='is_sysapp',
            field=models.BooleanField(default=False, help_text='\u4e3a\u4e86\u83b7\u53d6esb\u9274\u6743(esb\u52a0\u767d)\u800c\u751f\u6210securt_key\u7684\u7ed9\u5176\u4ed6\u7cfb\u7edf\u8c03\u7528esb\u4f7f\u7528 \u800c\u751f\u6210\u7684\u5e94\u7528', verbose_name='\u662f\u5426\u4e3a\u7cfb\u7edf\u95f4\u5e94\u7528'),
        ),
        migrations.AlterField(
            model_name='app',
            name='is_third',
            field=models.BooleanField(default=False, help_text='\u7b2c\u4e09\u65b9\u5e94\u7528\uff0c\u5373\u5916\u90e8\u5e94\u7528\uff0c\u4e0d\u8d70\u81ea\u52a8\u90e8\u7f72', verbose_name='\u662f\u5426\u4e3a\u7b2c\u4e09\u65b9\u5e94\u7528'),
        ),
    ]
