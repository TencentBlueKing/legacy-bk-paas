# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0016_auto_20170629_1138'),
    ]

    operations = [
        migrations.AlterField(
            model_name='app',
            name='language',
            field=models.CharField(default=b'python', choices=[(b'python', b'Python'), (b'java', b'Java'), (b'php', b'PHP')], max_length=50, blank=True, null=True, verbose_name='\u8bed\u8a00'),
        ),
    ]
