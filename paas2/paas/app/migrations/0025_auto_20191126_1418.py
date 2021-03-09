# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0024_app__visiable_labels'),
    ]

    operations = [
        migrations.AlterField(
            model_name='secureinfo',
            name='vcs_password',
            field=models.CharField(max_length=100, null=True, verbose_name='\u7248\u672c\u5e93\u5bc6\u7801', blank=True),
        ),
    ]
