# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa


from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0005_auto_20161017_1038'),
    ]

    operations = [
        migrations.AddField(
            model_name='app',
            name='is_saas',
            field=models.BooleanField(default=False, help_text='SaaS\u670d\u52a1\uff0c\u5373\u901a\u8fc7\u76f4\u63a5\u4e0a\u4f20\u5305\u90e8\u7f72', verbose_name=b'\xe6\x98\xaf\xe5\x90\xa6\xe4\xb8\xbaSaaS\xe6\x9c\x8d\xe5\x8a\xa1'),
        ),
    ]
