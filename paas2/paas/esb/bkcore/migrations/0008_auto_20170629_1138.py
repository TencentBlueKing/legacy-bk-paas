# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bkcore', '0007_auto_20170619_1050'),
    ]

    operations = [
        migrations.AlterField(
            model_name='esbchannel',
            name='name',
            field=models.CharField(help_text='\u901a\u9053\u540d\u79f0\uff0c\u957f\u5ea6\u9650\u5236\u4e3a64\u5b57\u7b26\uff0c\u4f8b\u5982"\u67e5\u8be2\u670d\u52a1\u5668\u5217\u8868"', max_length=64, verbose_name='\u901a\u9053\u540d\u79f0'),
        ),
    ]
