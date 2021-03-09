# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('saas', '0006_auto_20161111_1827'),
    ]

    operations = [
        migrations.AddField(
            model_name='saasapp',
            name='current_test_version',
            field=models.ForeignKey(related_name='current_test_version', blank=True, to='saas.SaaSAppVersion', null=True),
        ),
        migrations.AddField(
            model_name='saasapp',
            name='test_version',
            field=models.ForeignKey(related_name='test_versions', blank=True, to='saas.SaaSAppVersion', null=True),
        ),
        migrations.AddField(
            model_name='saasappversion',
            name='updated_at',
            field=models.DateTimeField(auto_now=True, verbose_name='\u66f4\u65b0\u65f6\u95f4', null=True),
        ),
    ]
