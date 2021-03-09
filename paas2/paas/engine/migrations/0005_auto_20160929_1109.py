# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('engine', '0004_auto_20160912_1741'),
    ]

    operations = [
        migrations.CreateModel(
            name='ThirdServer',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('category', models.CharField(default=b'rabbitmq', max_length=36, verbose_name='\u5206\u7c7b', choices=[(b'rabbitmq', 'RabbitMQ\u670d\u52a1')])),
                ('server_info', models.TextField(verbose_name='\u670d\u52a1\u5668\u4fe1\u606f')),
                ('info', models.CharField(max_length=200, verbose_name='\u5907\u6ce8')),
                ('is_active', models.BooleanField(default=False, verbose_name='\u542f\u7528')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'ordering': ('created_at',),
                'db_table': 'engine_third_servers',
                'verbose_name': '\u7b2c\u4e09\u65b9\u670d\u52a1\u5668\u4fe1\u606f',
                'verbose_name_plural': '\u7b2c\u4e09\u65b9\u670d\u52a1\u5668\u4fe1\u606f',
            },
        ),
        migrations.AlterField(
            model_name='bkserver',
            name='category',
            field=models.CharField(default=b'tapp', max_length=36, verbose_name='\u5206\u7c7b', choices=[(b'tapp', '\u6d4b\u8bd5\u670d\u52a1\u5668'), (b'app', '\u6b63\u5f0f\u670d\u52a1\u5668')]),
        ),
    ]
