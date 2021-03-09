# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bkaccount', '0002_initial_user_data'),
    ]

    operations = [
        migrations.AddField(
            model_name='bktoken',
            name='inactive_expire_time',
            field=models.IntegerField(default=0, verbose_name='\u65e0\u64cd\u4f5c\u5931\u6548\u65f6\u95f4\u6233'),
        ),
    ]
