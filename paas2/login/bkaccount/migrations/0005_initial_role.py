# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations


def load_data(apps, schema_editor):
    """
    初始化 用户角色
    """
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('bkaccount', '0004_auto_20170621_0929'),
    ]

    operations = [
        migrations.RunPython(load_data)
    ]
