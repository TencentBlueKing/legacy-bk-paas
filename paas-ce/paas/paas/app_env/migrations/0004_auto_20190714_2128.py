# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app_env', '0003_auto_20170821_2127'),
    ]

    operations = [
        migrations.AlterField(
            model_name='appenvvar',
            name='name',
            field=models.CharField(max_length=50, verbose_name='\u53d8\u91cf\u540d'),
        ),
    ]
