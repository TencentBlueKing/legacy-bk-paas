# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0003_auto_20180126_1702'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='usefullinks',
            options={'ordering': ['created_time'], 'verbose_name': '\u5e38\u7528\u94fe\u63a5', 'verbose_name_plural': '\u5e38\u7528\u94fe\u63a5'},
        ),
    ]
