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
        ('engine', '0006_auto_20170215_1527'),
    ]

    operations = [
        migrations.CreateModel(
            name='BkAppBindPort',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('mode', models.CharField(default=b'test', max_length=10, choices=[(b'test', b'\xe6\xb5\x8b\xe8\xaf\x95\xe7\x8e\xaf\xe5\xa2\x83'), (b'prod', b'\xe6\xad\xa3\xe5\xbc\x8f\xe7\x8e\xaf\xe5\xa2\x83')])),
                ('port', models.IntegerField(verbose_name='\u4f7f\u7528\u7684\u670d\u52a1\u5668\u7aef\u53e3\u53f7')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('bk_app', models.ForeignKey(to='engine.BkApp')),
            ],
            options={
                'ordering': ('created_at',),
                'db_table': 'engine_app_bind_port',
                'verbose_name': 'app bind port',
            },
        ),
        migrations.AlterUniqueTogether(
            name='bkappbindport',
            unique_together=set([('bk_app', 'mode', 'port')]),
        ),
    ]
