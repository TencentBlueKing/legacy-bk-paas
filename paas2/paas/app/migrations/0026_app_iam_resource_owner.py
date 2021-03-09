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

def update_iam_resource_owner_to_creater(apps, schema_editor):
    """
    更新所有app.iam_resource_owner = app.creater
    """
    pass
    # App = apps.get_model("app", "App")
    # for app in App.objects.all():
    #     app.iam_resource_owner = app.creater
        # app.save()

class Migration(migrations.Migration):

    dependencies = [
        ('app', '0025_auto_20191126_1418'),
    ]

    operations = [
        migrations.AddField(
            model_name='app',
            name='iam_resource_owner',
            field=models.CharField(max_length=32, null=True, verbose_name='IAM\u8d44\u6e90\u6240\u6709\u8005', blank=True),
        ),
        migrations.RunPython(update_iam_resource_owner_to_creater)
    ]
