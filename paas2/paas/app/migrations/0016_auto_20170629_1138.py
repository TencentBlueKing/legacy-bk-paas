# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0015_init_app_tags'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='apptags',
            options={'ordering': ('index',), 'verbose_name': '\u5e94\u7528\u5206\u7c7b\u4fe1\u606f', 'verbose_name_plural': '\u5e94\u7528\u5206\u7c7b\u4fe1\u606f'},
        ),
    ]
