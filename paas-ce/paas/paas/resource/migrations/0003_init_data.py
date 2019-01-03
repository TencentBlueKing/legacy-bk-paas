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

    Resource(name="Python",
             version="2.7.11",
             size="17.7MB",
             display=True,
             icon_url="/static/img/resource/python.png",
             doc_url="http://bbs.bk.tencent.com/forum.php?mod=viewthread&tid=163&extra=page%3D1",
             download_url="http://paas-10032816.cos.myqcloud.com/python-2.7.11.msi",
             ).save()

    Resource(name="Python资源包",
             version="1.0",
             size="19.8MB",
             display=True,
             icon_url="/static/img/resource/python-sdk.png",
             download_url="http://paas-10032816.cos.myqcloud.com/python-sdk-1.0.zip",
             ).save()

    Resource(name="Eclipse（含PyDev）",
             version="4.5.2",
             size="476MB",
             display=True,
             icon_url="/static/img/resource/eclipse-4.5.png",
             download_url="http://paas-10032816.cos.myqcloud.com/eclipse-4.5.2.zip",
             ).save()

    Resource(name="PyCharm",
             version="2016.3",
             size="170+M",
             display=True,
             icon_url="/static/img/resource/pycharm.jpeg",
             download_url="https://www.jetbrains.com/pycharm/download/",
             ).save()

    Resource(name="MySQL",
             version="5.6.28.0",
             size="263MB",
             display=True,
             icon_url="/static/img/resource/mysql.png",
             download_url="http://paas-10032816.cos.myqcloud.com/mysql-installer-community-5.6.28.0.msi",
             ).save()

    Resource(name="Rabbitmq",
             version="3.6.2",
             size="95.9MB",
             display=True,
             icon_url="/static/img/resource/rabbitmq.png",
             download_url="http://paas-10032816.cos.myqcloud.com/rabbitmq-server-3.6.2.zip",
             ).save()


class Migration(migrations.Migration):

    dependencies = [
        ('resource', '0002_data_insert_framework'),
    ]

    operations = [
        migrations.RunPython(load_data)
    ]
