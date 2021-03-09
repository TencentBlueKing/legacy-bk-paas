# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('saas', '0007_auto_20170517_1140'),
    ]

    operations = [
        migrations.AlterField(
            model_name='saasuploadfile',
            name='file',
            field=models.FileField(upload_to=b'saas_files', verbose_name='\u6587\u4ef6'),
        ),
    ]
