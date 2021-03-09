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

from django.db import migrations


def load_data(apps, schema_editor):
    """
    insert en of bk_cmdb/bk_job
    """
    App = apps.get_model("app", "App")
    cmdb_intro = ("BlueKing Configuration System is an application-oriented CMDB. In the "
"ITIL, the CMDB is the cornerstone for building other processes. In "
"BlueKing, the Configuration System plays a crucial role and provides "
"applications with data configuration services for different operation "
"scenarios.")
    job_intro = ("The Job System is a script automation operating platform tailored for "
"operation and maintenance, and provides one-click and automatic operation"
" for various complex operation and maintenance scenarios, including batch"
" script execution, file distribution, file pull and scheduled tasks. Each"
" step in executing the script process, can be conducted automatically or "
"manually.")

    App.objects.filter(code='bk_cmdb').update(name_en="CMDB", introduction_en=cmdb_intro)
    App.objects.filter(code='bk_job').update(name_en="JOB", introduction_en=job_intro)


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0022_auto_20190807_1538'),
    ]

    operations = [
        migrations.RunPython(load_data)
    ]
