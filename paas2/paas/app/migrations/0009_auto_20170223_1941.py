# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0008_auto_20170221_1132'),
    ]

    operations = [
        migrations.AddField(
            model_name='app',
            name='external_url',
            field=models.CharField(help_text='\u5f53\u4e14\u4ec5\u5f53\u5e94\u7528\u7c7b\u578b\u4e3a\u7b2c\u4e09\u65b9\u5e94\u7528\u65f6\u5fc5\u586b', max_length=255, null=True, verbose_name='\u7b2c\u4e09\u65b9\u5e94\u7528URL', blank=True),
        ),
        migrations.AddField(
            model_name='app',
            name='is_default',
            field=models.BooleanField(default=False, help_text='\u9ed8\u8ba4\u5e94\u7528\u5c06\u5728\u7528\u6237\u9996\u6b21\u8fdb\u5165\u5de5\u4f5c\u53f0\u65f6\u81ea\u52a8\u5230\u7528\u6237\u684c\u9762', verbose_name='\u662f\u5426\u4e3a\u9ed8\u8ba4\u5e94\u7528'),
        ),
        migrations.AddField(
            model_name='app',
            name='is_sysapp',
            field=models.BooleanField(default=False, help_text='\u4e3a\u4e86\u83b7\u53d6esb\u9274\u6743(esb\u52a0\u767d)\u800c\u751f\u6210securt_key\u7684\u7ed9\u5176\u4ed6\u7cfb\u7edf\u8c03\u7528esb\u4f7f\u7528 \u800c\u751f\u6210\u7684\u5e94\u7528', verbose_name=b'\xe6\x98\xaf\xe5\x90\xa6\xe4\xb8\xba\xe7\xb3\xbb\xe7\xbb\x9f\xe9\x97\xb4\xe5\xba\x94\xe7\x94\xa8'),
        ),
        migrations.AddField(
            model_name='app',
            name='is_third',
            field=models.BooleanField(default=False, help_text='\u7b2c\u4e09\u65b9\u5e94\u7528\uff0c\u5373\u5916\u90e8\u5e94\u7528\uff0c\u4e0d\u8d70\u81ea\u52a8\u90e8\u7f72', verbose_name=b'\xe6\x98\xaf\xe5\x90\xa6\xe4\xb8\xba\xe7\xac\xac\xe4\xb8\x89\xe6\x96\xb9\xe5\xba\x94\xe7\x94\xa8'),
        ),
        migrations.AlterField(
            model_name='app',
            name='creater',
            field=models.CharField(max_length=20, null=True, verbose_name='\u521b\u5efa\u8005', blank=True),
        ),
        migrations.AlterField(
            model_name='app',
            name='developer',
            field=models.ManyToManyField(related_name='developers', null=True, verbose_name='\u5f00\u53d1\u8005', to=settings.AUTH_USER_MODEL, blank=True),
        ),
    ]
