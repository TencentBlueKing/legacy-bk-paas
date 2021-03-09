# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('engine', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bkserver',
            name='is_active',
            field=models.BooleanField(default=False, verbose_name='\u542f\u7528'),
        ),
    ]
