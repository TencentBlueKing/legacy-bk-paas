# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bkcore', '0012_auto_20180622_1815'),
    ]

    operations = [
        migrations.AlterField(
            model_name='esbchannel',
            name='path',
            field=models.CharField(help_text='\u901a\u9053\u8bf7\u6c42\u8def\u5f84\uff0c\u4f8b\u5982"/host/get_host_list/"', max_length=255, verbose_name='\u901a\u9053\u8def\u5f84'),
        ),
        migrations.AlterUniqueTogether(
            name='esbchannel',
            unique_together=set([('path', 'method')]),
        ),
    ]
