# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

from __future__ import unicode_literals

from django.db import migrations, models
import datetime
import esb.bkcore.models


class Migration(migrations.Migration):

    dependencies = [
        ('bkcore', '0006_esbchannel_comp_conf'),
    ]

    operations = [
        migrations.CreateModel(
            name='AppComponentPerm',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('app_code', models.CharField(max_length=64, verbose_name='\u84dd\u9cb8\u5e94\u7528\u7f16\u7801')),
                ('component_id', models.IntegerField(verbose_name='\u7ec4\u4ef6ID')),
                ('expires', models.DateTimeField(default=esb.bkcore.models.init_app_comp_perm_expires, verbose_name='APP\u8bbf\u95ee\u7ec4\u4ef6\u8fc7\u671f\u65f6\u95f4')),
                ('created_time', models.DateTimeField(auto_now_add=True, verbose_name='\u521b\u5efa\u65f6\u95f4')),
                ('last_accessed_time', models.DateTimeField(default=datetime.datetime.now, verbose_name='APP\u6700\u540e\u8bbf\u95ee\u7ec4\u4ef6\u65f6\u95f4')),
            ],
            options={
                'db_table': 'esb_app_component_perm',
                'verbose_name': 'APP\u7ec4\u4ef6\u6743\u9650',
                'verbose_name_plural': 'APP\u7ec4\u4ef6\u6743\u9650',
            },
        ),
        migrations.CreateModel(
            name='ComponentAPIDoc',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('board', models.CharField(db_index=True, max_length=64, null=True, blank=True)),
                ('component_id', models.IntegerField(help_text='\u5bf9\u5e94 ESBChannel \u4e2d\u7684\u7ec4\u4ef6ID', unique=True, verbose_name='\u7ec4\u4ef6ID')),
                ('doc_md', models.TextField(null=True, verbose_name='\u7ec4\u4ef6\u6587\u6863\uff08MD\u683c\u5f0f\uff09', blank=True)),
                ('doc_html', models.TextField(null=True, verbose_name='\u7ec4\u4ef6\u6587\u6863\uff08HTML\u683c\u5f0f\uff09', blank=True)),
                ('doc_md_md5', models.CharField(default=b'', max_length=128, blank=True)),
                ('created_time', models.DateTimeField(auto_now_add=True, verbose_name='\u521b\u5efa\u65f6\u95f4')),
                ('updated_time', models.DateTimeField(auto_now=True, verbose_name='\u521b\u5efa\u65f6\u95f4')),
            ],
            options={
                'db_table': 'esb_api_doc',
                'verbose_name': '\u7ec4\u4ef6\u63a5\u53e3\u6587\u6863',
                'verbose_name_plural': '\u7ec4\u4ef6\u63a5\u53e3\u6587\u6863',
            },
        ),
        migrations.CreateModel(
            name='FeedbackForComponentDocs',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('board', models.CharField(db_index=True, max_length=64, null=True, blank=True)),
                ('operator', models.CharField(max_length=32, verbose_name='\u53cd\u9988\u8005')),
                ('component_id', models.IntegerField(help_text='\u5bf9\u5e94 ESBChannel \u4e2d\u7684\u7ec4\u4ef6ID', verbose_name='\u7ec4\u4ef6ID')),
                ('content', models.TextField(default=b'', null=True, verbose_name='\u53cd\u9988\u5185\u5bb9', blank=True)),
                ('created_time', models.DateTimeField(auto_now_add=True, verbose_name='\u521b\u5efa\u65f6\u95f4')),
            ],
            options={
                'db_table': 'esb_api_doc_feedback',
                'verbose_name': '\u63a5\u53e3\u53cd\u9988',
                'verbose_name_plural': '\u63a5\u53e3\u53cd\u9988',
            },
        ),
        migrations.AddField(
            model_name='esbchannel',
            name='component_name',
            field=models.CharField(default=b'', max_length=64, null=True, verbose_name='\u7ec4\u4ef6\u82f1\u6587\u540d', blank=True),
        ),
        migrations.AddField(
            model_name='esbchannel',
            name='is_hidden',
            field=models.BooleanField(default=False, help_text='\u662f\u5426\u663e\u793a\u6587\u6863\uff0c\u53ca\u662f\u5426\u5728\u6743\u9650\u7533\u8bf7\u4e2d\u5c55\u793a', verbose_name='\u7ec4\u4ef6\u662f\u5426\u9690\u85cf'),
        ),
        migrations.AddField(
            model_name='esbchannel',
            name='perm_level',
            field=models.IntegerField(default=0, verbose_name='\u6743\u9650\u7ea7\u522b', choices=[(0, '\u65e0\u9650\u5236'), (1, '\u666e\u901a\u6743\u9650'), (2, '\u654f\u611f\u6743\u9650'), (3, '\u7279\u6b8a\u6743\u9650')]),
        ),
        migrations.AddField(
            model_name='esbchannel',
            name='rate_limit_conf',
            field=models.TextField(help_text='\u9650\u5236\u8bbf\u95ee\u9891\u7387\uff0c\u5141\u8bb8\u591a\u79cd\u89c4\u5219\uff0c\u4f8b\u5982{"app_ratelimit": {"__default": {"token":1000, "minute": 1}, "gcloud": {"token":1000, "minute": 1}}}', null=True, verbose_name='\u8bf7\u6c42\u9891\u7387\u914d\u7f6e', blank=True),
        ),
        migrations.AddField(
            model_name='esbchannel',
            name='rate_limit_required',
            field=models.BooleanField(default=False, verbose_name='\u662f\u5426\u6821\u9a8c\u8bbf\u95ee\u9891\u7387'),
        ),
        migrations.AlterUniqueTogether(
            name='appcomponentperm',
            unique_together=set([('app_code', 'component_id')]),
        ),
    ]
