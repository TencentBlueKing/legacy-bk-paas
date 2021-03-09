# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0002_usersettings'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='usefullinks',
            options={'verbose_name': '\u5e38\u7528\u94fe\u63a5', 'verbose_name_plural': '\u5e38\u7528\u94fe\u63a5'},
        ),
        migrations.AlterModelOptions(
            name='userapps',
            options={'verbose_name': '\u7528\u6237\u6536\u85cf\u5e94\u7528', 'verbose_name_plural': '\u7528\u6237\u6536\u85cf\u5e94\u7528'},
        ),
        migrations.AlterModelOptions(
            name='usersettings',
            options={'verbose_name': '\u7528\u6237\u81ea\u5b9a\u4e49\u7684\u5e94\u7528\u5217\u8868', 'verbose_name_plural': '\u7528\u6237\u81ea\u5b9a\u4e49\u7684\u5e94\u7528\u5217\u8868'},
        ),
    ]
