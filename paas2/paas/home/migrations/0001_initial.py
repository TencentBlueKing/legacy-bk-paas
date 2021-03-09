# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='UsefulLinks',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=128, verbose_name='\u540d\u79f0')),
                ('link', models.CharField(max_length=128, verbose_name='\u94fe\u63a5')),
            ],
            options={
                'db_table': 'paas_usefullinks',
            },
        ),
        migrations.CreateModel(
            name='UserApps',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('username', models.CharField(unique=True, max_length=128, verbose_name='\u7528\u6237\u540d\u79f0')),
                ('apps', models.TextField(default=b'', help_text='\u683c\u5f0f\uff1ajson\u6570\u636e[code1,code2,code3]', null=True, verbose_name='\u5e94\u7528\u5217\u8868', blank=True)),
            ],
            options={
                'db_table': 'paas_userapps',
            },
        ),
    ]
