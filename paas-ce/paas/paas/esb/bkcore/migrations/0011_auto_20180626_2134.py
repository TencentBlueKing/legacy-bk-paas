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
import django.utils.timezone
import esb.bkcore.models


class Migration(migrations.Migration):

    dependencies = [
        ('bkcore', '0010_auto_20180420_1657'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='appcomponentperm',
            options={'verbose_name': 'APP API\u6743\u9650', 'verbose_name_plural': 'APP API\u6743\u9650'},
        ),
        migrations.AlterModelOptions(
            name='componentapidoc',
            options={'verbose_name': 'API\u6587\u6863', 'verbose_name_plural': 'API\u6587\u6863'},
        ),
        migrations.AddField(
            model_name='esbchannel',
            name='extra_info',
            field=models.TextField(default=b'', help_text='\u5b58\u50a8\u7ec4\u4ef6\u989d\u5916\u4fe1\u606f\uff0c\u7528\u4e8e\u6587\u6863\u5c55\u793a\u7b49', verbose_name='\u989d\u5916\u4fe1\u606f', blank=True),
        ),
        migrations.AlterField(
            model_name='appcomponentperm',
            name='component_id',
            field=models.IntegerField(verbose_name='API ID'),
        ),
        migrations.AlterField(
            model_name='appcomponentperm',
            name='expires',
            field=models.DateTimeField(default=esb.bkcore.models.init_app_comp_perm_expires, verbose_name='APP\u8bbf\u95eeAPI\u8fc7\u671f\u65f6\u95f4'),
        ),
        migrations.AlterField(
            model_name='appcomponentperm',
            name='last_accessed_time',
            field=models.DateTimeField(default=django.utils.timezone.now, verbose_name='APP\u6700\u540e\u8bbf\u95ee\u65f6\u95f4'),
        ),
        migrations.AlterField(
            model_name='componentapidoc',
            name='doc_md_md5',
            field=models.CharField(default=b'', max_length=128, verbose_name=b'doc md5', blank=True),
        ),
        migrations.AlterField(
            model_name='esbbuffetcomponent',
            name='dest_http_method',
            field=models.CharField(max_length=8, verbose_name='HTTP\u8bf7\u6c42\u7c7b\u578b', choices=[(b'GET', b'GET'), (b'POST', b'POST')]),
        ),
        migrations.AlterField(
            model_name='esbbuffetcomponent',
            name='registed_http_method',
            field=models.CharField(max_length=8, verbose_name='\u6ce8\u518c\u5230\u7684\u8bf7\u6c42\u7c7b\u578b', choices=[(b'GET', b'GET'), (b'POST', b'POST')]),
        ),
        migrations.AlterField(
            model_name='esbbuffetcomponent',
            name='registed_path',
            field=models.CharField(max_length=255, verbose_name='\u6ce8\u518c\u5230\u7684API\u8def\u5f84'),
        ),
        migrations.AlterField(
            model_name='esbbuffetcomponent',
            name='system',
            field=models.ForeignKey(verbose_name='\u7cfb\u7edf', blank=True, to='bkcore.ComponentSystem', null=True),
        ),
        migrations.AlterField(
            model_name='esbbuffetcomponent',
            name='timeout_time',
            field=models.IntegerField(help_text='\u5355\u4f4d\u79d2\uff0c\u672a\u8bbe\u7f6e\u65f6\u4ee5\u6240\u5c5e\u7cfb\u7edf\u8d85\u65f6\u65f6\u957f\u4e3a\u51c6', null=True, verbose_name='\u8d85\u65f6\u65f6\u957f', blank=True),
        ),
        migrations.AlterField(
            model_name='esbbuffetcomponent',
            name='type',
            field=models.IntegerField(default=2, verbose_name='API\u7c7b\u578b', choices=[(1, '\u6267\u884cAPI'), (2, '\u67e5\u8be2API')]),
        ),
        migrations.AlterField(
            model_name='esbchannel',
            name='component_codename',
            field=models.CharField(help_text='\u5bf9\u5e94\u7684\u7ec4\u4ef6\u4ee3\u53f7\uff0c\u8be5\u7ec4\u4ef6\u5fc5\u987b\u6ce8\u518c\u5230API\u7f51\u5173\u4e2d\uff0c\u4f8b\u5982 "generic.host.get_host_list"', max_length=255, verbose_name='\u5bf9\u5e94\u7ec4\u4ef6\u4ee3\u53f7'),
        ),
        migrations.AlterField(
            model_name='esbchannel',
            name='component_system',
            field=models.ForeignKey(verbose_name='\u6240\u5c5e\u7cfb\u7edf', to='bkcore.ComponentSystem', null=True),
        ),
        migrations.AlterField(
            model_name='esbchannel',
            name='is_hidden',
            field=models.BooleanField(default=False, help_text='\u662f\u5426\u663e\u793a\u6587\u6863\uff0c\u53ca\u662f\u5426\u5728\u6743\u9650\u7533\u8bf7\u4e2d\u5c55\u793a', verbose_name='\u662f\u5426\u9690\u85cf'),
        ),
        migrations.AlterField(
            model_name='esbchannel',
            name='last_modified_time',
            field=models.DateTimeField(auto_now=True, verbose_name='\u6700\u540e\u66f4\u65b0\u65f6\u95f4'),
        ),
        migrations.AlterField(
            model_name='esbchannel',
            name='timeout_time',
            field=models.IntegerField(help_text='\u5355\u4f4d\u79d2\uff0c\u672a\u8bbe\u7f6e\u65f6\u4ee5\u6240\u5c5e\u7cfb\u7edf\u8d85\u65f6\u65f6\u957f\u4e3a\u51c6', null=True, verbose_name='\u8d85\u65f6\u65f6\u957f', blank=True),
        ),
        migrations.AlterField(
            model_name='esbchannel',
            name='type',
            field=models.IntegerField(default=2, verbose_name='API\u7c7b\u578b', choices=[(1, '\u6267\u884cAPI'), (2, '\u67e5\u8be2API')]),
        ),
        migrations.AlterField(
            model_name='wxmpaccesstoken',
            name='last_updated_time',
            field=models.DateTimeField(default=django.utils.timezone.now, verbose_name='\u6700\u540e\u8bbf\u95ee\u65f6\u95f4'),
        ),
    ]
