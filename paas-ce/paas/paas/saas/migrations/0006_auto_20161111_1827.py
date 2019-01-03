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
import saas.models


class Migration(migrations.Migration):

    dependencies = [
        ('saas', '0005_auto_20161101_1025'),
    ]

    operations = [
        migrations.AddField(
            model_name='saasapp',
            name='logo',
            field=models.ImageField(null=True, upload_to=b'applogo', blank=True),
        ),
        migrations.AlterField(
            model_name='saasuploadfile',
            name='file',
            field=models.FileField(upload_to=b'saas_files', storage=saas.models.OverwriteStorage(), verbose_name='\u6587\u4ef6'),
        ),
    ]
