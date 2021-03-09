# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='AppTags',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(unique=True, max_length=20, verbose_name='\u5206\u7c7b\u540d\u79f0')),
                ('code', models.CharField(unique=True, max_length=30, verbose_name='\u5206\u7c7b\u82f1\u6587ID')),
                ('index', models.IntegerField(default=0, verbose_name='\u6392\u5e8f')),
            ],
            options={
                'db_table': 'paas_apptags',
            },
        ),
        migrations.AddField(
            model_name='app',
            name='tags',
            field=models.ForeignKey(blank=True, to='app.AppTags', help_text='\u5e94\u7528\u5206\u7c7b', null=True),
        ),
    ]
