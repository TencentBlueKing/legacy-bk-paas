# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0004_auto_20160929_1101'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='app',
            options={'verbose_name': '\u5e94\u7528\u57fa\u672c\u4fe1\u606f', 'verbose_name_plural': '\u5e94\u7528\u57fa\u672c\u4fe1\u606f'},
        ),
        migrations.AlterModelOptions(
            name='apptags',
            options={'ordering': ('-index',), 'verbose_name': '\u5e94\u7528\u5206\u7c7b\u4fe1\u606f', 'verbose_name_plural': '\u5e94\u7528\u5206\u7c7b\u4fe1\u606f'},
        ),
        migrations.AlterModelOptions(
            name='secureinfo',
            options={'verbose_name': '\u5e94\u7528\u5b89\u5168\u76f8\u5173\u4fe1\u606f', 'verbose_name_plural': '\u5e94\u7528\u5b89\u5168\u76f8\u5173\u4fe1\u606f'},
        ),
        migrations.AlterField(
            model_name='apptags',
            name='index',
            field=models.IntegerField(default=0, help_text='\u964d\u5e8f\u6392\u5e8f\uff0c\u5373 9 \u5728 0 \u4e4b\u524d', verbose_name='\u6392\u5e8f'),
        ),
    ]
