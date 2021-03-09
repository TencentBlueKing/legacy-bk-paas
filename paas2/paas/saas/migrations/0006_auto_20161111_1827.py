# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import saas.models


class Migration(migrations.Migration):

    dependencies = [
        ('saas', '0005_auto_20161101_1025'),
    ]

    operations = [
        migrations.AddField(
            model_name='saasapp',
            name='logo',
            field=models.ImageField(null=True, upload_to=b'applogo', blank=True),
        ),
        migrations.AlterField(
            model_name='saasuploadfile',
            name='file',
            field=models.FileField(upload_to=b'saas_files', storage=saas.models.OverwriteStorage(), verbose_name='\u6587\u4ef6'),
        ),
    ]
