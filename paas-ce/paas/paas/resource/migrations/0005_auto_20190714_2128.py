# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('resource', '0004_insert_api_dev_template'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='resource',
            options={'verbose_name': '\u8d44\u6e90\u4e0b\u8f7d', 'verbose_name_plural': '\u8d44\u6e90\u4e0b\u8f7d'},
        ),
        migrations.AlterField(
            model_name='resource',
            name='doc_url',
            field=models.CharField(help_text='\u586b\u5199\u5916\u7f51\u5730\u5740', max_length=256, null=True, verbose_name='\u6587\u6863URL', blank=True),
        ),
        migrations.AlterField(
            model_name='resource',
            name='download_url',
            field=models.CharField(help_text='\u586b\u5199\u5916\u7f51\u5730\u5740', max_length=256, null=True, verbose_name='\u4e0b\u8f7dURL', blank=True),
        ),
        migrations.AlterField(
            model_name='resource',
            name='icon_url',
            field=models.CharField(help_text='\u586b\u5199\u5916\u7f51\u5730\u5740', max_length=256, null=True, verbose_name='\u4e0b\u8f7d\u56fe\u6807', blank=True),
        ),
    ]
