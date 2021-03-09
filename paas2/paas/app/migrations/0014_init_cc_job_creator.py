# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations


def load_data(apps, schema_editor):
    """
    添加 作业平台和配置平台的创建者
    """
    App = apps.get_model("app", "App")

    # 添加 作业平台和配置平台的创建者
    App.objects.filter(code__in=['bk_cc', 'bk_job']).update(creater=u"蓝鲸智云")


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0013_auto_20170519_0243'),
    ]

    operations = [
        migrations.RunPython(load_data)
    ]
