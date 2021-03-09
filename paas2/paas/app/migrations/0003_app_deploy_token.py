# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0002_auto_20160615_2036'),
    ]

    operations = [
        migrations.AddField(
            model_name='app',
            name='deploy_token',
            field=models.TextField(null=True, verbose_name=b'deploy_token', blank=True),
        ),
    ]
