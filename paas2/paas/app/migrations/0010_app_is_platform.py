# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0009_auto_20170223_1941'),
    ]

    operations = [
        migrations.AddField(
            model_name='app',
            name='is_platform',
            field=models.BooleanField(default=False, help_text='\u5e73\u53f0\u5e94\u7528\uff08\u914d\u7f6e\u5e73\u53f0\u3001\u4f5c\u4e1a\u5e73\u53f0\u7b49\uff09', verbose_name=b'\xe6\x98\xaf\xe5\x90\xa6\xe4\xb8\xba\xe5\xb9\xb3\xe5\x8f\xb0\xe7\xba\xa7\xe5\xba\x94\xe7\x94\xa8'),
        ),
    ]
