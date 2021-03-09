# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('app', '0008_auto_20170221_1132'),
        ('analysis', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='AppLiveness',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('hits', models.IntegerField(default=0, help_text='\u5e94\u7528\u9875\u9762\u70b9\u51fb\u91cf', verbose_name='\u70b9\u51fb\u91cf')),
                ('add_date', models.DateField(help_text='\u8bb0\u5f55\u65e5\u671f', null=True, verbose_name='\u6dfb\u52a0\u65e5\u671f', blank=True)),
                ('access_host', models.CharField(max_length=128, null=True, verbose_name='\u8bbf\u95ee\u57df\u540d', blank=True)),
                ('source_ip', models.CharField(max_length=64, null=True, verbose_name='\u6765\u6e90IP', blank=True)),
                ('app', models.ForeignKey(verbose_name='\u5e94\u7528', to='app.App')),
                ('user', models.ForeignKey(verbose_name='\u7528\u6237', blank=True, to=settings.AUTH_USER_MODEL, null=True)),
            ],
            options={
                'db_table': 'console_analysis_appliveness',
                'verbose_name': 'app\u9875\u9762\u70b9\u51fb\u91cf\u6d3b\u8dc3\u5ea6\u7edf\u8ba1',
                'verbose_name_plural': 'app\u9875\u9762\u70b9\u51fb\u91cf\u6d3b\u8dc3\u5ea6\u7edf\u8ba1',
            },
        ),
        migrations.CreateModel(
            name='AppOnlineTimeRecord',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('app_code', models.CharField(max_length=32, verbose_name='\u5e94\u7528\u7f16\u7801', db_index=True)),
                ('record_type', models.IntegerField(default=0, verbose_name='\u7edf\u8ba1\u7c7b\u578b', choices=[(0, b'workbench'), (1, b'app')])),
                ('online_time', models.FloatField(default=0.0, help_text='\u5728\u7ebf\u65f6\u957f\uff0c\u4ee5\u79d2\u4e3a\u5355\u4f4d', verbose_name='\u5728\u7ebf\u65f6\u957f\uff08\u79d2\uff09')),
                ('add_date', models.DateField(help_text='\u8bb0\u5f55\u65e5\u671f', null=True, verbose_name='\u6dfb\u52a0\u65e5\u671f', blank=True)),
                ('access_host', models.CharField(max_length=128, null=True, verbose_name='\u8bbf\u95ee\u57df\u540d', blank=True)),
                ('source_ip', models.CharField(max_length=64, null=True, verbose_name='\u6765\u6e90IP', blank=True)),
                ('user', models.ForeignKey(verbose_name='\u7528\u6237', blank=True, to=settings.AUTH_USER_MODEL, null=True)),
            ],
            options={
                'db_table': 'console_analysis_apponlinetimerecord',
                'verbose_name': 'app\u5728\u7ebf\u65f6\u957f\u7edf\u8ba1',
                'verbose_name_plural': 'app\u5728\u7ebf\u65f6\u957f\u7edf\u8ba1',
            },
        ),
    ]
