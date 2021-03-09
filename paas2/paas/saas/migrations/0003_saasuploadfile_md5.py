# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('saas', '0002_auto_20161025_2016'),
    ]

    operations = [
        migrations.AddField(
            model_name='saasuploadfile',
            name='md5',
            field=models.CharField(default='', max_length=32, verbose_name='md5'),
            preserve_default=False,
        ),
    ]
