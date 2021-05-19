# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0030_auto_20210223_1132'),
    ]

    operations = [
        migrations.AlterField(
            model_name='app',
            name='logo',
            field=models.ImageField(max_length=500, null=True, upload_to=b'applogo', blank=True),
        ),
    ]
