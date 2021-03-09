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
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('bkcore', '0010_auto_20171110_1004'),
    ]

    operations = [
        migrations.AlterField(
            model_name='appcomponentperm',
            name='last_accessed_time',
            field=models.DateTimeField(default=django.utils.timezone.now, verbose_name='APP\u6700\u540e\u8bbf\u95ee\u7ec4\u4ef6\u65f6\u95f4'),
        ),
        migrations.AlterField(
            model_name='wxmpaccesstoken',
            name='last_updated_time',
            field=models.DateTimeField(default=django.utils.timezone.now, verbose_name='\u6700\u540e\u8bbf\u95ee\u65f6\u95f4'),
        ),
    ]
