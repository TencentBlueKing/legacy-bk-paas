# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('saas', '0004_saasapp_created_time'),
    ]

    operations = [
        migrations.AddField(
            model_name='saasapp',
            name='online_version',
            field=models.ForeignKey(related_name='online_versions', blank=True, to='saas.SaaSAppVersion', null=True),
        ),
        migrations.AlterField(
            model_name='saasapp',
            name='current_version',
            field=models.ForeignKey(related_name='current_versions', blank=True, to='saas.SaaSAppVersion', null=True),
        ),
    ]
