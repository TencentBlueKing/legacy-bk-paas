# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('bkcore', '0008_auto_20170629_1138'),
    ]

    operations = [
        migrations.CreateModel(
            name='WxmpAccessToken',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('wx_app_id', models.CharField(max_length=128, verbose_name='\u5fae\u4fe1APPID')),
                ('access_token', models.CharField(max_length=1024, verbose_name='\u51ed\u8bc1')),
                ('expires', models.DateTimeField(verbose_name='\u51ed\u8bc1\u8fc7\u671f\u65f6\u95f4')),
                ('last_updated_time', models.DateTimeField(default=datetime.datetime.now, verbose_name='\u6700\u540e\u8bbf\u95ee\u65f6\u95f4')),
            ],
            options={
                'db_table': 'esb_wxmp_access_token',
                'verbose_name': '\u5fae\u4fe1\u516c\u4f17\u53f7AccessToken',
                'verbose_name_plural': '\u5fae\u4fe1\u516c\u4f17\u53f7AccessToken',
            },
        ),
    ]
