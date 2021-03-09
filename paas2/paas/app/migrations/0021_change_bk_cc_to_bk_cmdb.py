# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations


def load_data(apps, schema_editor):
    """
    修改配置平台bk_cc => bk_cmdb
    """
    App = apps.get_model("app", "App")

    # 修改配置平台bk_cc => bk_cmdb, 包括logo
    App.objects.filter(code='bk_cc').update(code="bk_cmdb", logo='applogo/bk_cmdb.png')


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0020_app_open_mode'),
    ]

    operations = [
        migrations.RunPython(load_data)
    ]