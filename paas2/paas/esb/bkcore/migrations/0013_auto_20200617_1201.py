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
        ('bkcore', '0012_auto_20180622_1815'),
    ]

    operations = [
        migrations.AlterField(
            model_name='esbchannel',
            name='path',
            field=models.CharField(help_text='\u901a\u9053\u8bf7\u6c42\u8def\u5f84\uff0c\u4f8b\u5982"/host/get_host_list/"', max_length=255, verbose_name='\u901a\u9053\u8def\u5f84'),
        ),
        migrations.AlterUniqueTogether(
            name='esbchannel',
            unique_together=set([('path', 'method')]),
        ),
    ]
