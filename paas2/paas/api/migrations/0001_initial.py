# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='ApiWhiteList',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('api_name', models.CharField(max_length=20, verbose_name='\u63a5\u53e3\u7c7b\u522b', choices=[(b'app_maker', '\u8f7b\u5e94\u7528\u76f8\u5173\u63a5\u53e3')])),
                ('app_code', models.CharField(max_length=20, verbose_name='\u53ef\u8c03\u7528\u63a5\u53e3\u7684\u5e94\u7528\u7f16\u7801')),
            ],
            options={
                'db_table': 'paas_apiwhitelist',
                'verbose_name': 'PaaS\u63d0\u4f9b\u7684\u63a5\u53e3\u767d\u540d\u5355',
                'verbose_name_plural': 'PaaS\u63d0\u4f9b\u7684\u63a5\u53e3\u767d\u540d\u5355',
            },
        ),
    ]
