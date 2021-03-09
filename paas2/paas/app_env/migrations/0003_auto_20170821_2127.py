# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app_env', '0002_auto_20170821_1814'),
    ]

    operations = [
        migrations.AlterField(
            model_name='appenvvar',
            name='mode',
            field=models.CharField(default=b'all', max_length=20, verbose_name='\u751f\u6548\u73af\u5883', choices=[('all', '\u6240\u6709\u73af\u5883'), (b'test', '\u6d4b\u8bd5\u73af\u5883'), (b'prod', '\u6b63\u5f0f\u73af\u5883')]),
        ),
        migrations.AlterField(
            model_name='appenvvar',
            name='value',
            field=models.CharField(max_length=1024, verbose_name='\u53d8\u91cf\u503c'),
        ),
    ]
