# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0026_app_iam_resource_owner'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='app',
            name='iam_resource_owner',
        ),
    ]
