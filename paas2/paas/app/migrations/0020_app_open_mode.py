# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0019_auto_20190123_2018'),
    ]

    operations = [
        migrations.AddField(
            model_name='app',
            name='open_mode',
            field=models.CharField(default=b'desktop', max_length=20, verbose_name='\u5e94\u7528\u6253\u5f00\u65b9\u5f0f', choices=[(b'desktop', b'\xe6\xa1\x8c\xe9\x9d\xa2'), (b'new_tab', b'\xe6\x96\xb0\xe6\xa0\x87\xe7\xad\xbe')]),
        ),
    ]
