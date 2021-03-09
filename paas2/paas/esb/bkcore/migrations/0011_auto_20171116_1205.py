# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('bkcore', '0010_auto_20171110_1004'),
    ]

    operations = [
        migrations.AlterField(
            model_name='appcomponentperm',
            name='last_accessed_time',
            field=models.DateTimeField(default=django.utils.timezone.now, verbose_name='APP\u6700\u540e\u8bbf\u95ee\u7ec4\u4ef6\u65f6\u95f4'),
        ),
        migrations.AlterField(
            model_name='wxmpaccesstoken',
            name='last_updated_time',
            field=models.DateTimeField(default=django.utils.timezone.now, verbose_name='\u6700\u540e\u8bbf\u95ee\u65f6\u95f4'),
        ),
    ]
