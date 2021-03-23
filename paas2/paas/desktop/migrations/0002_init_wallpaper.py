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

from builtins import range
from django.db import migrations


def load_data(apps, schema_editor):
    """
    初始化壁纸
    """
    Wallpaper = apps.get_model("desktop", "Wallpaper")
    wid_list = [i+1 for i in range(30)]
    wallpaper_list = [Wallpaper(name=u"壁纸%s" % i, number=i, width=1920, height=1080) for i in wid_list]
    if wallpaper_list:
        Wallpaper.objects.bulk_create(wallpaper_list)
    # 设置默认壁纸
    Wallpaper.objects.filter(number=1).update(is_default=True)


class Migration(migrations.Migration):

    dependencies = [
        ('desktop', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(load_data)
    ]
