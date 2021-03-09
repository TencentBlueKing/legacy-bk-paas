# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('saas', '0003_saasuploadfile_md5'),
    ]

    operations = [
        migrations.AddField(
            model_name='saasapp',
            name='created_time',
            field=models.DateTimeField(auto_now_add=True, verbose_name='\u521b\u5efa\u65f6\u95f4', null=True),
        ),
    ]
