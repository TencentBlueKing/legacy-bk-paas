# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0005_auto_20161017_1038'),
    ]

    operations = [
        migrations.AddField(
            model_name='app',
            name='is_saas',
            field=models.BooleanField(default=False, help_text='SaaS\u670d\u52a1\uff0c\u5373\u901a\u8fc7\u76f4\u63a5\u4e0a\u4f20\u5305\u90e8\u7f72', verbose_name=b'\xe6\x98\xaf\xe5\x90\xa6\xe4\xb8\xbaSaaS\xe6\x9c\x8d\xe5\x8a\xa1'),
        ),
    ]
