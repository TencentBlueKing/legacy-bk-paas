# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0018_modify_app_url_https'),
    ]

    operations = [
        migrations.AddField(
            model_name='app',
            name='is_display',
            field=models.BooleanField(default=True, help_text='\u9009\u9879: true(\u6709)\uff0cfalse(\u65e0)', verbose_name='\u662f\u5426\u5728\u684c\u9762\u5c55\u793a'),
        ),
        migrations.AlterField(
            model_name='app',
            name='is_platform',
            field=models.BooleanField(default=False, help_text='\u5e73\u53f0\u5e94\u7528\uff08\u914d\u7f6e\u5e73\u53f0\u3001\u4f5c\u4e1a\u5e73\u53f0\u7b49\uff09', verbose_name='\u662f\u5426\u4e3a\u5e73\u53f0\u7ea7\u5e94\u7528'),
        ),
        migrations.AlterField(
            model_name='app',
            name='is_saas',
            field=models.BooleanField(default=False, help_text='SaaS\u670d\u52a1\uff0c\u5373\u901a\u8fc7\u76f4\u63a5\u4e0a\u4f20\u5305\u90e8\u7f72', verbose_name='\u662f\u5426\u4e3aSaaS\u670d\u52a1'),
        ),
    ]
