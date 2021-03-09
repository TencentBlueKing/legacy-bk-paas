# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import home.models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0003_auto_20170629_1138'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='usefullinks',
            options={'ordering': ['created_time'], 'verbose_name': '\u5e38\u7528\u94fe\u63a5', 'verbose_name_plural': '\u5e38\u7528\u94fe\u63a5'},
        ),
        migrations.AddField(
            model_name='usefullinks',
            name='created_time',
            field=models.DateTimeField(auto_now_add=True, verbose_name=b'\xe5\x88\x9b\xe5\xbb\xba\xe6\x97\xb6\xe9\x97\xb4', null=True),
        ),
        migrations.AddField(
            model_name='usefullinks',
            name='introduction',
            field=models.TextField(default=b'', null=True, verbose_name=b'\xe5\xba\x94\xe7\x94\xa8\xe7\xae\x80\xe4\xbb\x8b', blank=True),
        ),
        migrations.AddField(
            model_name='usefullinks',
            name='is_active',
            field=models.BooleanField(default=True, verbose_name=b'\xe6\x98\xaf\xe5\x90\xa6\xe6\xbf\x80\xe6\xb4\xbb'),
        ),
        migrations.AddField(
            model_name='usefullinks',
            name='link_type',
            field=models.SmallIntegerField(default=0, verbose_name=b'\xe7\xb1\xbb\xe5\x9e\x8b', choices=[(0, '\u666e\u901a\u94fe\u63a5'), (1, 'SaaS\u94fe\u63a5'), (2, '\u8f7b\u5e94\u7528')]),
        ),
        migrations.AddField(
            model_name='usefullinks',
            name='logo',
            field=models.ImageField(null=True, upload_to=home.models.dynamic_upload_to, blank=True),
        ),
    ]
