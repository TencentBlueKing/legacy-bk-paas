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
        ('app', '0029_auto_20201106_1139'),
    ]

    operations = [
        migrations.AddField(
            model_name='app',
            name='from_paasv3',
            field=models.BooleanField(default=False, verbose_name='\u662f\u5426 Paas3.0 \u4e0a\u521b\u5efa\u7684\u5e94\u7528'),
        ),
        migrations.AddField(
            model_name='app',
            name='migrated_to_paasv3',
            field=models.BooleanField(default=False, verbose_name='\u662f\u5426\u5df2\u7ecf\u8fc1\u79fb\u5230 Paas3.0'),
        ),
        migrations.AlterField(
            model_name='app',
            name='auth_token',
            field=models.CharField(max_length=255, null=True, verbose_name=b'Token', blank=True),
        ),
    ]
