# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0025_auto_20191126_1418'),
    ]

    operations = [
        migrations.AddField(
            model_name='secureinfo',
            name='vcs_checkout_target',
            field=models.CharField(max_length=100, null=True, verbose_name='\u7248\u672c\u5e93\u68c0\u51fa\u5206\u652f\u6216Tag', blank=True),
        ),
    ]
