# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app_env', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='appenvvar',
            name='app_code',
            field=models.CharField(max_length=30, verbose_name='\u5bf9\u5e94\u7684appcode'),
        ),
    ]
