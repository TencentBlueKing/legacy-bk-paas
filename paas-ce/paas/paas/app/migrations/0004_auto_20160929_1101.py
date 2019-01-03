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
        ('app', '0003_app_deploy_token'),
    ]

    operations = [
        migrations.AddField(
            model_name='app',
            name='is_use_celery',
            field=models.BooleanField(default=False, help_text='\u9009\u9879: true(\u662f)\uff0cfalse(\u5426)', verbose_name='app\u662f\u5426\u4f7f\u7528celery'),
        ),
        migrations.AddField(
            model_name='app',
            name='is_use_celery_beat',
            field=models.BooleanField(default=False, help_text='\u9009\u9879: true(\u662f)\uff0cfalse(\u5426)', verbose_name='app\u662f\u5426\u4f7f\u7528\u5b9a\u65f6\u4efb\u52a1'),
        ),
    ]
