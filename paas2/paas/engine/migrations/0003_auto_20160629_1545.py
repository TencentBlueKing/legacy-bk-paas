# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('engine', '0002_auto_20160426_0959'),
    ]

    operations = [
        migrations.AddField(
            model_name='bkserver',
            name='app_port',
            field=models.CharField(default=b'8085', max_length=36, verbose_name='App\u7aef\u53e3'),
        ),
        migrations.AlterField(
            model_name='bkserver',
            name='ip_port',
            field=models.CharField(default=b'4245', max_length=36, verbose_name='Agent\u7aef\u53e3'),
        ),
    ]
