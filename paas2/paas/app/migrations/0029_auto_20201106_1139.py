# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0028_merge'),
    ]

    operations = [
        migrations.AlterField(
            model_name='app',
            name='_visiable_labels',
            field=models.CharField(db_column=b'visiable_labels', default=b'', max_length=1024, blank=True, null=True, verbose_name='\u53ef\u89c1\u8303\u56f4\u6807\u7b7e'),
        ),
    ]
