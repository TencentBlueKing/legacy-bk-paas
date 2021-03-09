# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('analysis', '0002_appliveness_apponlinetimerecord'),
    ]

    operations = [
        migrations.AlterField(
            model_name='appliveness',
            name='add_date',
            field=models.DateTimeField(auto_now_add=True, help_text='\u8bb0\u5f55\u65e5\u671f', null=True, verbose_name='\u6dfb\u52a0\u65e5\u671f'),
        ),
        migrations.AlterField(
            model_name='apponlinetimerecord',
            name='add_date',
            field=models.DateTimeField(auto_now_add=True, help_text='\u8bb0\u5f55\u65e5\u671f', null=True, verbose_name='\u6dfb\u52a0\u65e5\u671f'),
        ),
    ]
