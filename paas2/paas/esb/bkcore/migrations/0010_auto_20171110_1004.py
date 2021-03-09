# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bkcore', '0009_wxmpaccesstoken'),
    ]

    operations = [
        migrations.CreateModel(
            name='SystemDocCategory',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=32, verbose_name='\u5206\u7c7b\u540d\u79f0', db_index=True)),
                ('priority', models.IntegerField(default=1000, help_text='\u5c55\u793a\u65f6\uff0c\u6570\u5b57\u5c0f\u7684\u5c55\u793a\u5728\u524d\u9762', verbose_name='\u4f18\u5148\u7ea7')),
                ('created_time', models.DateTimeField(auto_now_add=True, verbose_name='\u521b\u5efa\u65f6\u95f4')),
            ],
            options={
                'ordering': ['priority', 'id'],
                'db_table': 'esb_system_doc_category',
                'verbose_name': '\u7cfb\u7edf\u6587\u6863\u5206\u7c7b',
                'verbose_name_plural': '\u7cfb\u7edf\u6587\u6863\u5206\u7c7b',
            },
        ),
        migrations.AddField(
            model_name='componentsystem',
            name='doc_category_id',
            field=models.IntegerField(null=True, verbose_name='\u6587\u6863\u5206\u7c7bID', blank=True),
        ),
    ]
