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
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('bkcore', '0008_auto_20170629_1138'),
    ]

    operations = [
        migrations.CreateModel(
            name='WxmpAccessToken',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('wx_app_id', models.CharField(max_length=128, verbose_name='\u5fae\u4fe1APPID')),
                ('access_token', models.CharField(max_length=1024, verbose_name='\u51ed\u8bc1')),
                ('expires', models.DateTimeField(verbose_name='\u51ed\u8bc1\u8fc7\u671f\u65f6\u95f4')),
                ('last_updated_time', models.DateTimeField(default=datetime.datetime.now, verbose_name='\u6700\u540e\u8bbf\u95ee\u65f6\u95f4')),
            ],
            options={
                'db_table': 'esb_wxmp_access_token',
                'verbose_name': '\u5fae\u4fe1\u516c\u4f17\u53f7AccessToken',
                'verbose_name_plural': '\u5fae\u4fe1\u516c\u4f17\u53f7AccessToken',
            },
        ),
    ]
