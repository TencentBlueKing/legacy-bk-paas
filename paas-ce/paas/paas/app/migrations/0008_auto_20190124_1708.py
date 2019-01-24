# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0007_auto_20161111_1348'),
    ]

    operations = [
        migrations.CreateModel(
            name='DesktopSettings',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('app_code', models.CharField(unique=True, max_length=30, verbose_name='\u5bf9\u5e94\u7684appcode')),
                ('is_display', models.BooleanField(default=True, verbose_name='\u662f\u5426\u5728\u684c\u9762\u5c55\u793a')),
            ],
            options={
                'db_table': 'paas_app_desktop_settings',
                'verbose_name': '\u5e94\u7528\u684c\u9762\u5c5e\u6027',
                'verbose_name_plural': '\u5e94\u7528\u684c\u9762\u5c5e\u6027',
            },
        ),
        migrations.AlterField(
            model_name='app',
            name='is_saas',
            field=models.BooleanField(default=False, help_text='SaaS\u670d\u52a1\uff0c\u5373\u901a\u8fc7\u76f4\u63a5\u4e0a\u4f20\u5305\u90e8\u7f72', verbose_name='\u662f\u5426\u4e3aSaaS\u670d\u52a1'),
        ),
        migrations.AlterField(
            model_name='secureinfo',
            name='vcs_type',
            field=models.SmallIntegerField(default=1, help_text='\u7248\u672c\u4ed3\u5e93\u7c7b\u578b', verbose_name='\u7248\u672c\u63a7\u5236\u7c7b\u578b', choices=[(0, 'Git'), (1, 'SVN')]),
        ),
    ]
