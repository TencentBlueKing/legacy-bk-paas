# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0007_auto_20161111_1348'),
    ]

    operations = [
        migrations.AddField(
            model_name='app',
            name='height',
            field=models.IntegerField(help_text='\u5e94\u7528\u9875\u9762\u9ad8\u5ea6\uff0c\u5fc5\u987b\u4e3a\u6574\u6570\uff0c\u5355\u4f4d\u4e3apx', null=True, verbose_name='app\u9875\u9762\u9ad8\u5ea6', blank=True),
        ),
        migrations.AddField(
            model_name='app',
            name='is_max',
            field=models.BooleanField(default=False, verbose_name='\u662f\u5426\u9ed8\u8ba4\u7a97\u53e3\u6700\u5927\u5316'),
        ),
        migrations.AddField(
            model_name='app',
            name='is_resize',
            field=models.BooleanField(default=True, help_text='\u9009\u9879\uff1atrue(\u53ef\u4ee5\u62c9\u4f38)\uff0cfalse(\u4e0d\u53ef\u4ee5\u62c9\u4f38)', verbose_name='\u662f\u5426\u80fd\u5bf9\u7a97\u53e3\u8fdb\u884c\u62c9\u4f38'),
        ),
        migrations.AddField(
            model_name='app',
            name='is_setbar',
            field=models.BooleanField(default=True, help_text='\u9009\u9879: true(\u6709)\uff0cfalse(\u65e0)', verbose_name='\u7a97\u53e3\u662f\u5426\u8be6\u60c5\u7b49\u6309\u94ae'),
        ),
        migrations.AddField(
            model_name='app',
            name='use_count',
            field=models.IntegerField(default=0, help_text='\u6dfb\u52a0\u4e86\u8be5\u5e94\u7528\u7684\u4eba\u6570\uff0cnote\uff1a\u7528\u6237\u5378\u8f7d\u5e94\u7528\u540e\uff0c\u8981\u76f8\u5e94\u7684\u51cf1', verbose_name='\u4f7f\u7528\u4eba\u6570'),
        ),
        migrations.AddField(
            model_name='app',
            name='width',
            field=models.IntegerField(help_text='\u5e94\u7528\u9875\u9762\u5bbd\u5ea6\uff0c\u5fc5\u987b\u4e3a\u6574\u6570\uff0c\u5355\u4f4d\u4e3apx', null=True, verbose_name='app\u9875\u9762\u5bbd\u5ea6', blank=True),
        ),
    ]
