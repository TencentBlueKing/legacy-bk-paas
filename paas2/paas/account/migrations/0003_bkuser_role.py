# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0002_initial_user_data'),
    ]

    operations = [
        migrations.AddField(
            model_name='bkuser',
            name='role',
            field=models.CharField(default=b'0', help_text='\u7528\u6237\u89d2\u8272\u8868\u793a\u5b57\u7b26\u4e32', max_length=32, verbose_name='\u7528\u6237\u89d2\u8272'),
        ),
    ]
