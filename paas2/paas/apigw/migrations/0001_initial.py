# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='API',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('api_name', models.CharField(unique=True, max_length=64, verbose_name='API \u82f1\u6587\u540d')),
                ('api_name_slug', models.CharField(default=b'', unique=True, max_length=64, verbose_name='API \u7528\u4e8e domain \u7684\u540d\u79f0', blank=True)),
                ('description', models.TextField(default=b'', verbose_name='API\u63cf\u8ff0', blank=True)),
                ('app_code_white', models.TextField(default=b'', help_text='\u5141\u8bb8\u8bbf\u95ee\u7684\u84dd\u9cb8\u5e94\u7528\uff0c\u5148\u4fdd\u7559', verbose_name='APP Code\u767d\u540d\u5355', blank=True)),
                ('user_type', models.IntegerField(default=0, verbose_name='\u7528\u6237\u8eab\u4efd\u7c7b\u578b')),
                ('enable_hard_throttle', models.BooleanField(default=True, verbose_name=b'\xe6\x98\xaf\xe5\x90\xa6\xe5\xbc\x80\xe5\x90\xaf\xe5\xbc\xba\xe5\x88\xb6\xe6\xb5\x81\xe6\x8e\xa7')),
                ('throttle_strategy', models.TextField(default=b'', help_text='\u4ec5\u652f\u6301\u4e00\u79cd\u89c4\u5219\uff0c\u4f8b\u5982{"tokens": 100, "period": {"second": 1}}', verbose_name='\u6d41\u63a7\u7b56\u7565', blank=True)),
                ('extra_headers', models.TextField(default=b'', verbose_name='\u8bf7\u6c42\u5934\u4fe1\u606f', blank=True)),
                ('creator', models.CharField(max_length=100, verbose_name='\u521b\u5efa\u8005')),
                ('maintainers', models.TextField(default=b'', verbose_name='\u7ef4\u62a4\u8005', blank=True)),
                ('created_time', models.DateTimeField(auto_now_add=True, verbose_name='\u521b\u5efa\u65f6\u95f4')),
                ('updated_time', models.DateTimeField(auto_now=True, verbose_name='\u4fee\u6539\u65f6\u95f4')),
                ('private_key', models.TextField(default=b'', help_text='\u7f51\u5173\u4f7f\u7528\uff0c\u8bf7\u6ce8\u610f\u4fdd\u5bc6', verbose_name='API\u7f51\u5173\u79c1\u94a5', blank=True)),
                ('public_key', models.TextField(default=b'', help_text='\u5f00\u53d1\u8005\u4f7f\u7528\uff0c\u663e\u793a\u5230\u57fa\u672c\u4fe1\u606f', verbose_name='API\u7f51\u5173\u516c\u94a5', blank=True)),
                ('key_updated_time', models.DateTimeField(null=True, verbose_name='\u5bc6\u94a5\u4fee\u6539\u65f6\u95f4', blank=True)),
                ('api_type', models.IntegerField(default=10, verbose_name='API\u5206\u7c7b', choices=[(0, 'ESB'), (1, '\u5b98\u65b9\u4e91API'), (10, '\u4e91API')])),
                ('max_resource_count', models.IntegerField(default=30, verbose_name='\u6700\u5927\u5141\u8bb8\u7684\u8d44\u6e90\u6570\u91cf')),
                ('rate_limit_required', models.BooleanField(default=False, verbose_name='\u662f\u5426\u6821\u9a8c\u8bbf\u95ee\u9891\u7387')),
                ('rate_limit_conf', models.TextField(help_text='\u9650\u5236\u8bbf\u95ee\u9891\u7387\uff0c\u5141\u8bb8\u591a\u79cd\u89c4\u5219\uff0c\u4f8b\u5982{"app_ratelimit": {"__default": {"token":1000, "minute": 1}, "gcloud": {"token":1000, "minute": 1}}}', null=True, verbose_name='\u8bf7\u6c42\u9891\u7387\u914d\u7f6e', blank=True)),
            ],
            options={
                'db_table': 'apigw_api',
                'verbose_name': 'API\u4fe1\u606f',
                'verbose_name_plural': 'API\u4fe1\u606f',
            },
        ),
        migrations.CreateModel(
            name='Resource',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('api_id', models.IntegerField(verbose_name='API ID', db_index=True)),
                ('path', models.CharField(max_length=2048, verbose_name='\u6ce8\u518c\u8def\u5f84')),
                ('registed_http_method', models.CharField(max_length=64, verbose_name='\u6ce8\u518c\u7684\u8bf7\u6c42\u65b9\u6cd5')),
                ('resource_name', models.CharField(default=b'', help_text=b'\xe6\xb3\xa8\xe5\x86\x8c\xe7\x9a\x84\xe8\xb5\x84\xe6\xba\x90\xe5\x90\x8d\xe7\xa7\xb0\xef\xbc\x8c\xe5\x85\x81\xe8\xae\xb8\xe4\xb8\xba\xe7\xa9\xba', max_length=256, verbose_name='\u8d44\u6e90\u540d\u79f0', blank=True)),
                ('description', models.TextField(default=b'', verbose_name='\u8d44\u6e90\u63cf\u8ff0', blank=True)),
                ('dest_http_method', models.CharField(max_length=64, verbose_name='\u76ee\u7684\u8bf7\u6c42\u65b9\u6cd5')),
                ('dest_url', models.CharField(max_length=2048, verbose_name='\u76ee\u6807\u5730\u5740')),
                ('extra_headers', models.TextField(default=b'', verbose_name='\u8bf7\u6c42\u5934\u4fe1\u606f', blank=True)),
                ('verify_params', models.TextField(default=b'', verbose_name='\u6821\u9a8c\u53c2\u6570', blank=True)),
                ('timeout', models.IntegerField(null=True, verbose_name='\u8bf7\u6c42\u76ee\u6807\u5730\u5740\u8d85\u65f6\u65f6\u95f4', blank=True)),
                ('skip_auth_verification', models.BooleanField(default=False, verbose_name='\u8df3\u8fc7\u7528\u6237\u9a8c\u8bc1')),
                ('auth_verified_required', models.BooleanField(default=True, verbose_name='\u7528\u6237\u901a\u8fc7\u6821\u9a8c')),
                ('app_verified_required', models.BooleanField(default=True, verbose_name='APP\u901a\u8fc7\u6821\u9a8c')),
                ('resource_perm_required', models.BooleanField(default=False, verbose_name='\u662f\u5426\u9700\u8981\u7533\u8bf7\u8d44\u6e90\u8bbf\u95ee\u6743\u9650')),
                ('is_hide', models.BooleanField(default=False, help_text='\u5e2e\u52a9\u7528\u6237', verbose_name='\u662f\u5426\u9690\u85cf')),
                ('app_code_white', models.TextField(default=b'', help_text='\u84dd\u9cb8\u5e94\u7528\u767d\u540d\u5355', verbose_name='\u84dd\u9cb8\u5e94\u7528\u767d\u540d\u5355', blank=True)),
                ('app_verified_type', models.IntegerField(default=0, verbose_name='APP\u6821\u9a8c\u65b9\u5f0f')),
                ('rate_limit_required', models.BooleanField(default=False, verbose_name='\u662f\u5426\u6821\u9a8c\u8bbf\u95ee\u9891\u7387')),
                ('rate_limit_conf', models.TextField(default=b'', help_text='\u9650\u5236\u8bbf\u95ee\u9891\u7387\uff0c\u5141\u8bb8\u591a\u79cd\u89c4\u5219\uff0c\u4f8b\u5982[{"token":1000, "minute": 1}]', verbose_name='\u8bf7\u6c42\u9891\u7387\u914d\u7f6e', blank=True)),
                ('is_deleted', models.BooleanField(default=False, verbose_name='\u662f\u5426\u5220\u9664')),
                ('resource_classification_id', models.IntegerField(verbose_name='\u8d44\u6e90\u5206\u7c7b')),
                ('creator', models.CharField(max_length=100, verbose_name='\u521b\u5efa\u8005')),
                ('created_time', models.DateTimeField(auto_now_add=True, verbose_name='\u521b\u5efa\u65f6\u95f4')),
                ('updated_time', models.DateTimeField(auto_now=True, verbose_name='\u4fee\u6539\u65f6\u95f4')),
            ],
            options={
                'db_table': 'apigw_resource',
                'verbose_name': 'Resource\u63a5\u53e3\u4fe1\u606f',
                'verbose_name_plural': 'Resource\u63a5\u53e3\u4fe1\u606f',
            },
        ),
        migrations.CreateModel(
            name='Stage',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('api_id', models.IntegerField(verbose_name='API ID')),
                ('stage_name', models.CharField(max_length=64, verbose_name='\u90e8\u7f72\u73af\u5883')),
                ('description', models.TextField(default=b'', verbose_name='\u90e8\u7f72\u73af\u5883\u63cf\u8ff0', blank=True)),
                ('stage_variables', models.TextField(default=b'', help_text='\u73b0\u9636\u6bb5stage\u53c2\u6570\u7528\u4e8e\u5bf9\u5e94\u4e0d\u540c\u57df\u540d\uff0c\u5982{"domain": "bk.domain.com"}\uff0c\u4ee5json\u4e32\u5b58\u50a8', verbose_name='stage\u53c2\u6570', blank=True)),
            ],
            options={
                'db_table': 'apigw_stage',
                'verbose_name': 'Stage\u90e8\u7f72\u73af\u5883',
                'verbose_name_plural': 'Stage\u90e8\u7f72\u73af\u5883',
            },
        ),
        migrations.CreateModel(
            name='StageRelatedResouece',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('api_id', models.IntegerField(verbose_name='\u7f51\u5173 ID')),
                ('stage_id', models.IntegerField(verbose_name='\u7f51\u5173\u73af\u5883 ID')),
                ('resource_id', models.IntegerField(verbose_name='\u8d44\u6e90 ID')),
                ('created_time', models.DateTimeField(auto_now_add=True, verbose_name='\u521b\u5efa\u65f6\u95f4')),
                ('updated_time', models.DateTimeField(auto_now=True, verbose_name='\u4fee\u6539\u65f6\u95f4')),
                ('status', models.BooleanField(default=True, verbose_name='\u5f00\u653e\u72b6\u6001')),
                ('operator', models.CharField(default=b'', max_length=32, verbose_name='\u64cd\u4f5c\u8005', blank=True)),
            ],
            options={
                'db_table': 'apigw_stage_related_resource',
                'verbose_name': '\u7ba1\u7406Stage\u548cResource\u5173\u7cfb',
                'verbose_name_plural': '\u7ba1\u7406Stage\u548cResource\u5173\u7cfb',
            },
        ),
        migrations.AlterUniqueTogether(
            name='stagerelatedresouece',
            unique_together=set([('api_id', 'stage_id', 'resource_id')]),
        ),
        migrations.AlterUniqueTogether(
            name='stage',
            unique_together=set([('api_id', 'stage_name')]),
        ),
    ]
