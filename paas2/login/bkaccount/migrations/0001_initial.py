# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.utils.timezone
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('auth', '0006_require_contenttypes_0002'),
    ]

    operations = [
        migrations.CreateModel(
            name='BkToken',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('token', models.CharField(unique=True, max_length=255, verbose_name='\u767b\u5f55\u7968\u636e', db_index=True)),
                ('is_logout', models.BooleanField(default=False, verbose_name='\u7968\u636e\u662f\u5426\u5df2\u7ecf\u6267\u884c\u8fc7\u9000\u51fa\u767b\u5f55\u64cd\u4f5c')),
            ],
            options={
                'db_table': 'login_bktoken',
                'verbose_name': '\u767b\u5f55\u7968\u636e',
                'verbose_name_plural': '\u767b\u5f55\u7968\u636e',
            },
        ),
        migrations.CreateModel(
            name='Loignlog',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('login_time', models.DateTimeField(verbose_name='\u767b\u5f55\u65f6\u95f4')),
                ('login_browser', models.CharField(max_length=200, null=True, verbose_name='\u767b\u5f55\u6d4f\u89c8\u5668', blank=True)),
                ('login_ip', models.CharField(max_length=50, null=True, verbose_name='\u7528\u6237\u767b\u5f55ip', blank=True)),
                ('login_host', models.CharField(max_length=100, null=True, verbose_name='\u767b\u5f55HOST', blank=True)),
                ('app_id', models.CharField(max_length=30, null=True, verbose_name=b'APP_ID', blank=True)),
                ('user', models.ForeignKey(verbose_name='\u7528\u6237', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'login_bklog',
                'verbose_name': '\u7528\u6237\u767b\u5f55\u65e5\u5fd7',
                'verbose_name_plural': '\u7528\u6237\u767b\u5f55\u65e5\u5fd7',
            },
        ),
    ]
