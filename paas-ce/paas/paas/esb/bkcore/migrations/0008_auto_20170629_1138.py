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


class Migration(migrations.Migration):

    dependencies = [
        ('bkcore', '0007_auto_20170619_1050'),
    ]

    operations = [
        migrations.AlterField(
            model_name='esbchannel',
            name='name',
            field=models.CharField(help_text='\u901a\u9053\u540d\u79f0\uff0c\u957f\u5ea6\u9650\u5236\u4e3a64\u5b57\u7b26\uff0c\u4f8b\u5982"\u67e5\u8be2\u670d\u52a1\u5668\u5217\u8868"', max_length=64, verbose_name='\u901a\u9053\u540d\u79f0'),
        ),
    ]
