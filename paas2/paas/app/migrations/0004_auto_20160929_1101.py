# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0003_app_deploy_token'),
    ]

    operations = [
        migrations.AddField(
            model_name='app',
            name='is_use_celery',
            field=models.BooleanField(default=False, help_text='\u9009\u9879: true(\u662f)\uff0cfalse(\u5426)', verbose_name='app\u662f\u5426\u4f7f\u7528celery'),
        ),
        migrations.AddField(
            model_name='app',
            name='is_use_celery_beat',
            field=models.BooleanField(default=False, help_text='\u9009\u9879: true(\u662f)\uff0cfalse(\u5426)', verbose_name='app\u662f\u5426\u4f7f\u7528\u5b9a\u65f6\u4efb\u52a1'),
        ),
    ]
