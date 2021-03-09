# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0005_auto_20161017_1038'),
        ('saas', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='SaaSApp',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('code', models.CharField(help_text='\u6b64\u5904\u8bf7\u7528\u82f1\u6587\u5b57\u6bcd', unique=True, max_length=30, verbose_name='\u5e94\u7528\u7f16\u7801')),
                ('name', models.CharField(max_length=20, verbose_name='\u5e94\u7528\u540d\u79f0')),
                ('app', models.ForeignKey(blank=True, to='app.App', null=True)),
            ],
            options={
                'ordering': ('-code',),
                'db_table': 'paas_saas_app',
                'verbose_name': 'SaaS \u5e94\u7528',
                'verbose_name_plural': 'SaaS \u5e94\u7528',
            },
        ),
        migrations.CreateModel(
            name='SaaSAppVersion',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('version', models.CharField(max_length=20, verbose_name='\u7248\u672c')),
                ('settings', models.TextField(null=True, verbose_name='\u5305\u914d\u7f6e', blank=True)),
                ('saas_app', models.ForeignKey(to='saas.SaaSApp')),
                ('upload_file', models.ForeignKey(to='saas.SaaSUploadFile')),
            ],
            options={
                'db_table': 'paas_saas_app_version',
                'verbose_name': 'SaaS \u5e94\u7528\u7248\u672c',
                'verbose_name_plural': 'SaaS \u5e94\u7528\u7248\u672c',
            },
        ),
        migrations.AddField(
            model_name='saasapp',
            name='current_version',
            field=models.ForeignKey(blank=True, to='saas.SaaSAppVersion', null=True),
        ),
    ]
