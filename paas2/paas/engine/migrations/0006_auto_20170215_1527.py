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
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('engine', '0005_auto_20160929_1109'),
    ]

    operations = [
        migrations.CreateModel(
            name='BkEvent',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, serialize=False, editable=False, primary_key=True)),
                ('event_type', models.CharField(max_length=200)),
                ('message', models.TextField(default=b'')),
                ('status', models.CharField(max_length=200)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'ordering': ('created_at',),
                'db_table': 'engine_events',
                'verbose_name': 'father event',
            },
        ),
        migrations.AddField(
            model_name='bkappevent',
            name='bk_event_id',
            field=models.CharField(default=b'-1', max_length=128),
        ),
        migrations.AddField(
            model_name='bkappevent',
            name='is_master',
            field=models.BooleanField(default=True),
        ),
    ]
