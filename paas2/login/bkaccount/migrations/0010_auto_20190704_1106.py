# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bkaccount', '0009_add_role_data'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='loignlog',
            name='user',
        ),
        migrations.AddField(
            model_name='loignlog',
            name='username',
            field=models.CharField(max_length=128, null=True, verbose_name='\u7528\u6237\u540d', blank=True),
        ),
    ]
