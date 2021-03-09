# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations


def load_data(apps, schema_editor):
    """
    初始化已存在的用户的角色
    """
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('bkaccount', '0005_initial_role'),
    ]

    operations = [
        migrations.RunPython(load_data)
    ]
