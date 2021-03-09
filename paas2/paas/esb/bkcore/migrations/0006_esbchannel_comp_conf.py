# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bkcore', '0005_appaccount'),
    ]

    operations = [
        migrations.AddField(
            model_name='esbchannel',
            name='comp_conf',
            field=models.TextField(default=b'', null=True, verbose_name='\u7ec4\u4ef6\u914d\u7f6e', blank=True),
        ),
    ]
