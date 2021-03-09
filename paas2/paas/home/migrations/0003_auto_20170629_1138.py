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
        ('home', '0002_usersettings'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='usefullinks',
            options={'verbose_name': '\u5e38\u7528\u94fe\u63a5', 'verbose_name_plural': '\u5e38\u7528\u94fe\u63a5'},
        ),
        migrations.AlterModelOptions(
            name='userapps',
            options={'verbose_name': '\u7528\u6237\u6536\u85cf\u5e94\u7528', 'verbose_name_plural': '\u7528\u6237\u6536\u85cf\u5e94\u7528'},
        ),
        migrations.AlterModelOptions(
            name='usersettings',
            options={'verbose_name': '\u7528\u6237\u81ea\u5b9a\u4e49\u7684\u5e94\u7528\u5217\u8868', 'verbose_name_plural': '\u7528\u6237\u81ea\u5b9a\u4e49\u7684\u5e94\u7528\u5217\u8868'},
        ),
    ]
