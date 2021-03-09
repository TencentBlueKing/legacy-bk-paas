# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import migrations


def initial_user_data(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(initial_user_data),
    ]
