# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0029_auto_20201106_1139'),
    ]

    operations = [
        migrations.AddField(
            model_name='app',
            name='from_paasv3',
            field=models.BooleanField(default=False, verbose_name='\u662f\u5426 Paas3.0 \u4e0a\u521b\u5efa\u7684\u5e94\u7528'),
        ),
        migrations.AddField(
            model_name='app',
            name='migrated_to_paasv3',
            field=models.BooleanField(default=False, verbose_name='\u662f\u5426\u5df2\u7ecf\u8fc1\u79fb\u5230 Paas3.0'),
        ),
        migrations.AlterField(
            model_name='app',
            name='auth_token',
            field=models.CharField(max_length=255, null=True, verbose_name=b'Token', blank=True),
        ),
    ]
