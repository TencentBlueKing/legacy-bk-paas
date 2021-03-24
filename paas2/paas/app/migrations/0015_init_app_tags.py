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
from __future__ import print_function

from django.db import migrations


def load_data(apps, schema_editor):
    """
    如果有分类，删除分类，然后添加分类，并设置APP的分类
    """
    try:
        App = apps.get_model("app", "App")
        AppTags = apps.get_model("app", "AppTags")
        # 删除所有分类
        AppTags.objects.all().delete()
        # 添加批量新的分类
        APP_TAGS_CHOICES = [
            (u"运维工具", 'OpsTools'),
            (u"监控告警", 'MonitorAlarm'),
            (u"配置管理", 'ConfManage'),
            (u"开发工具", 'DevTools'),
            (u"企业IT", 'EnterpriseIT'),
            (u"办公应用", 'OfficeApp'),
            (u"其它", 'Other'),
        ]
        app_tags_list = [AppTags(name=j[0], code=j[1], index=i + 1) for i, j in enumerate(APP_TAGS_CHOICES)]
        AppTags.objects.bulk_create(app_tags_list)

        # 所有已存在的应用 设置为其他分类
        other_tag = AppTags.objects.get(code='Other')
        App.objects.filter().update(tags=other_tag)

        # 设置内置应用的类别（cc,job）
        opstools_tag = AppTags.objects.get(code='OpsTools')
        App.objects.filter(code='bk_job').update(tags=opstools_tag)
        confmanage_tag = AppTags.objects.get(code='ConfManage')
        App.objects.filter(code='bk_cc').update(tags=confmanage_tag)
    except Exception as error:
        print(error)


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0014_init_cc_job_creator'),
    ]

    operations = [
        migrations.RunPython(load_data)
    ]
