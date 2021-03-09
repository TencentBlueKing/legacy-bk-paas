# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('engine', '0007_auto_20170904_2045'),
    ]

    operations = [
        migrations.AddField(
            model_name='bkappevent',
            name='server_id',
            field=models.IntegerField(default=-1),
        ),
        migrations.AlterField(
            model_name='bkappbindport',
            name='mode',
            field=models.CharField(default=b'test', max_length=10, choices=[(b'test', '\u6d4b\u8bd5\u73af\u5883'), (b'prod', '\u6b63\u5f0f\u73af\u5883')]),
        ),
    ]
