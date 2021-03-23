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

#!/usr/bin/env python
# -*- coding: utf-8 -*-

from builtins import str
import uuid
from django.db import migrations


def load_data(apps, schema_editor):
    tpapp = apps.get_model("app", "App")

    apps = tpapp.objects.filter(is_third=True, auth_token__isnull=True).all()
    for app in apps:
        app.auth_token = str(uuid.uuid4())
        app.save()


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.RunPython(load_data)
    ]
