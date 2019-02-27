# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

from __future__ import unicode_literals

from django.db import migrations


def load_data(apps, schema_editor):
    Resource = apps.get_model("resource", "Resource")
    Resource(name="Python3 开发框架",
             version="1.0.3",
             size="1.1M",
             display=True,
             icon_url="/static/img/resource/framework_py3.png",
             download_url="/media/framework_py3.tar.gz",
             ).save()


class Migration(migrations.Migration):

    dependencies = [
        ('resource', '0004_insert_api_dev_template'),
    ]

    operations = [
        migrations.RunPython(load_data)
    ]

