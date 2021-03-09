# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bkcore', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='componentsystem',
            options={'ordering': ['name']},
        ),
        migrations.AlterField(
            model_name='userauthtoken',
            name='app_code',
            field=models.CharField(max_length=128, verbose_name='\u84dd\u9cb8\u667a\u4e91\u5e94\u7528\u7f16\u7801'),
        ),
    ]
