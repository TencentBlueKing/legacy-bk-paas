# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('apigw', '0002_auto_20190110_1203'),
    ]

    operations = [
        migrations.AddField(
            model_name='api',
            name='bind_app',
            field=models.CharField(default=b'', max_length=512, verbose_name='\u7ed1\u5b9a\u7684\u84dd\u9cb8\u5e94\u7528', blank=True),
        ),
    ]
