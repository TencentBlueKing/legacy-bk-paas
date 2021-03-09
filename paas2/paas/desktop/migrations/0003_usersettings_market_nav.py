# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('desktop', '0002_init_wallpaper'),
    ]

    operations = [
        migrations.AddField(
            model_name='usersettings',
            name='market_nav',
            field=models.IntegerField(default=1, verbose_name='\u5e94\u7528\u5e02\u573a\u5de6\u4fa7\u5bfc\u822a\u7c7b\u522b', choices=[(0, '\u5e94\u7528\u521b\u5efa\u8005'), (1, '\u5e94\u7528\u5206\u7c7b')]),
        ),
    ]
