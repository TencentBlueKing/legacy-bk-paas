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
        ('app', '0018_modify_app_url_https'),
    ]

    operations = [
        migrations.AddField(
            model_name='app',
            name='is_display',
            field=models.BooleanField(default=True, help_text='\u9009\u9879: true(\u6709)\uff0cfalse(\u65e0)', verbose_name='\u662f\u5426\u5728\u684c\u9762\u5c55\u793a'),
        ),
        migrations.AlterField(
            model_name='app',
            name='is_platform',
            field=models.BooleanField(default=False, help_text='\u5e73\u53f0\u5e94\u7528\uff08\u914d\u7f6e\u5e73\u53f0\u3001\u4f5c\u4e1a\u5e73\u53f0\u7b49\uff09', verbose_name='\u662f\u5426\u4e3a\u5e73\u53f0\u7ea7\u5e94\u7528'),
        ),
        migrations.AlterField(
            model_name='app',
            name='is_saas',
            field=models.BooleanField(default=False, help_text='SaaS\u670d\u52a1\uff0c\u5373\u901a\u8fc7\u76f4\u63a5\u4e0a\u4f20\u5305\u90e8\u7f72', verbose_name='\u662f\u5426\u4e3aSaaS\u670d\u52a1'),
        ),
    ]
