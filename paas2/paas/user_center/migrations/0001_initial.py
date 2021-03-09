# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='WxBkUserTmpRecord',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('username', models.CharField(max_length=32, verbose_name='\u7528\u6237\u540d')),
                ('bk_token', models.CharField(max_length=255, verbose_name='\u767b\u5f55\u6001token')),
                ('wx_ticket', models.CharField(unique=True, max_length=127, verbose_name='\u5fae\u4fe1\u4e34\u65f6\u6807\u8bc6(state\u6216\u4e8c\u7ef4\u7801ticket)', db_index=True)),
                ('create_time', models.DateTimeField(auto_now_add=True, verbose_name='\u521b\u5efa\u65f6\u95f4', null=True)),
            ],
            options={
                'db_table': 'console_wx_bkuser_tmp_record',
                'verbose_name': '\u5fae\u4fe1\u4e0e\u84dd\u9cb8\u7528\u6237\u7ed1\u5b9a\u8fc7\u7a0b\u4e34\u65f6\u8868',
                'verbose_name_plural': '\u5fae\u4fe1\u4e0e\u84dd\u9cb8\u7528\u6237\u7ed1\u5b9a\u8fc7\u7a0b\u4e34\u65f6\u8868',
            },
        ),
    ]
