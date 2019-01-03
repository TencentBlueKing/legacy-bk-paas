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
        ('engine', '0003_auto_20160629_1545'),
    ]

    operations = [
        migrations.AddField(
            model_name='bkserver',
            name='mac',
            field=models.CharField(default=b'', max_length=36, verbose_name='MAC\u5730\u5740'),
        ),
        migrations.AlterField(
            model_name='bkserver',
            name='category',
            field=models.CharField(default=b'tapp', max_length=36, verbose_name='\u5206\u7c7b', choices=[(b'tapp', b'\xe6\xb5\x8b\xe8\xaf\x95\xe6\x9c\x8d\xe5\x8a\xa1\xe5\x99\xa8'), (b'app', b'\xe6\xad\xa3\xe5\xbc\x8f\xe6\x9c\x8d\xe5\x8a\xa1\xe5\x99\xa8')]),
        ),
    ]
