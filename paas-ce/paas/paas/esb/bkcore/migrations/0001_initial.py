# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

from __future__ import unicode_literals


from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='ComponentSystem',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=64, verbose_name='\u7cfb\u7edf\u540d\u79f0')),
                ('label', models.CharField(default=b'', max_length=128, verbose_name='\u7cfb\u7edf\u6807\u7b7e', blank=True)),
                ('component_admin', models.CharField(default=b'', max_length=128, verbose_name='\u7ec4\u4ef6\u5f00\u53d1\u8d1f\u8d23\u4eba', blank=True)),
                ('interface_admin', models.CharField(default=b'', max_length=128, verbose_name='\u7cfb\u7edf\u63a5\u53e3\u8d1f\u8d23\u4eba', blank=True)),
                ('system_link', models.CharField(default=b'', help_text='\u6807\u51c6\u7684HTTP\u94fe\u63a5\uff0c\u591a\u4e2a\u4ee5\u5206\u53f7\u5206\u9694', max_length=1024, verbose_name='\u7cfb\u7edf\u94fe\u63a5', blank=True)),
                ('belong_to', models.CharField(default=b'', max_length=128, verbose_name='\u7cfb\u7edf\u6240\u5c5e\u7ec4\u7ec7', blank=True)),
                ('remark', models.TextField(default=b'', verbose_name='\u5907\u6ce8', blank=True)),
            ],
            options={
                'db_table': 'esb_component_system',
            },
        ),
        migrations.CreateModel(
            name='ESBBuffetComponent',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=256, verbose_name='\u540d\u79f0')),
                ('dest_url', models.CharField(max_length=2048, verbose_name='\u76ee\u6807\u63a5\u53e3\u5730\u5740')),
                ('dest_http_method', models.CharField(max_length=8, verbose_name='HTTP\u8bf7\u6c42\u7c7b\u578b', choices=[(b'GET', b'GET'), (b'POST', b'POST'), (b'_ORIG', '[\u6240\u6709] \u900f\u4f20\u539f\u59cb\u8bf7\u6c42\u7c7b\u578b(\u4e0d\u5efa\u8bae\u4f7f\u7528)')])),
                ('favor_post_ctype', models.CharField(default=b'json', max_length=64, verbose_name='\u7f16\u7801POST\u53c2\u6570\u65b9\u5f0f', choices=[(b'json', b'json'), (b'form', b'form')])),
                ('extra_headers', models.CharField(default=b'', max_length=2048, verbose_name='\u989d\u5916\u8bf7\u6c42\u5934\u4fe1\u606f', blank=True)),
                ('extra_params', models.CharField(default=b'', max_length=2048, verbose_name='\u989d\u5916\u8bf7\u6c42\u53c2\u6570', blank=True)),
                ('registed_path', models.CharField(max_length=255, verbose_name='\u6ce8\u518c\u5230\u7684\u7ec4\u4ef6\u8def\u5f84')),
                ('registed_http_method', models.CharField(max_length=8, verbose_name='\u6ce8\u518c\u5230\u7684\u8bf7\u6c42\u7c7b\u578b', choices=[(b'GET', b'GET'), (b'POST', b'POST'), (b'_ORIG', '[\u6240\u6709] \u900f\u4f20\u539f\u59cb\u8bf7\u6c42\u7c7b\u578b(\u4e0d\u5efa\u8bae\u4f7f\u7528)')])),
                ('submitter', models.CharField(default=b'', max_length=256, null=True, blank=True)),
                ('approver', models.CharField(default=b'', max_length=256, null=True, blank=True)),
                ('approver_message', models.CharField(default=b'', max_length=1024, null=True, blank=True)),
                ('status', models.IntegerField(default=0, verbose_name='\u72b6\u6001')),
                ('mappings_input', models.CharField(default=b'', max_length=1024, blank=True, help_text='JSON\u683c\u5f0f\u6570\u636e', null=True, verbose_name='\u8f93\u5165Mappings')),
                ('mappings_output', models.CharField(default=b'', max_length=1024, blank=True, help_text='JSON\u683c\u5f0f\u6570\u636e', null=True, verbose_name='\u8f93\u51faMappings')),
                ('last_modified_time', models.DateTimeField(auto_now=True)),
                ('created_time', models.DateTimeField(auto_now_add=True)),
                ('system', models.ForeignKey(verbose_name='\u6240\u5c5e\u7cfb\u7edf', blank=True, to='bkcore.ComponentSystem', null=True)),
            ],
            options={
                'db_table': 'esb_buffet_component',
            },
        ),
        migrations.CreateModel(
            name='ESBBuffetMapping',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(unique=True, max_length=40, verbose_name='\u540d\u79f0')),
                ('type', models.IntegerField(null=True, verbose_name='\u7c7b\u578b', blank=True)),
                ('source_type', models.IntegerField(verbose_name='\u6e90\u7801\u7c7b\u578b')),
                ('source', models.TextField(default=b'', null=True, verbose_name='\u6e90\u7801', blank=True)),
                ('owner', models.CharField(default=b'', max_length=256, null=True, blank=True)),
                ('is_active', models.BooleanField(default=True)),
                ('last_modified_time', models.DateTimeField(auto_now=True)),
                ('created_time', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'db_table': 'esb_buffet_component_mapping',
            },
        ),
        migrations.CreateModel(
            name='ESBChannel',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(help_text='\u901a\u9053\u540d\u79f0\uff0c\u4f8b\u5982"[CC] \u67e5\u8be2\u4e1a\u52a1\u5217\u8868"', max_length=64, verbose_name='\u901a\u9053\u540d\u79f0')),
                ('path', models.CharField(help_text='\u901a\u9053\u8bf7\u6c42\u8def\u5f84\uff0c\u4f8b\u5982"/cc/get_app_list/"', unique=True, max_length=255, verbose_name='\u901a\u9053\u8def\u5f84')),
                ('method', models.CharField(default=b'', max_length=32, null=True, verbose_name='\u8bf7\u6c42\u7c7b\u578b', blank=True)),
                ('component_codename', models.CharField(help_text='\u5bf9\u5e94\u7684\u7ec4\u4ef6\u4ee3\u7801\uff0c\u8be5\u7ec4\u4ef6\u5fc5\u987b\u6ce8\u518c\u5230ESB\u5e73\u53f0\u4e2d\uff0c\u4f8b\u5982 "generic.cc.get_app_list"', max_length=255, verbose_name='\u5bf9\u5e94\u7ec4\u4ef6\u4ee3\u53f7')),
                ('is_active', models.BooleanField(default=True, verbose_name='\u662f\u5426\u5f00\u542f')),
                ('last_modified_time', models.DateTimeField(auto_now=True, verbose_name='\u6700\u540e\u66f4\u65b0')),
                ('created_time', models.DateTimeField(auto_now_add=True, verbose_name='\u521b\u5efa\u65f6\u95f4')),
                ('component_system', models.ForeignKey(verbose_name='\u6240\u5c5e\u7ec4\u4ef6\u7cfb\u7edf', to='bkcore.ComponentSystem', null=True)),
            ],
            options={
                'db_table': 'esb_channel',
            },
        ),
        migrations.CreateModel(
            name='FunctionController',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('func_code', models.CharField(unique=True, max_length=64, verbose_name='\u529f\u80fdcode')),
                ('func_name', models.CharField(max_length=64, verbose_name='\u529f\u80fd\u540d\u79f0')),
                ('switch_status', models.BooleanField(default=True, help_text='\u63a7\u5236\u529f\u80fd\u662f\u5426\u5bf9\u5916\u5f00\u653e\uff0c\u82e5\u9009\u62e9\uff0c\u5219\u8be5\u529f\u80fd\u5c06\u5bf9\u5916\u5f00\u653e', verbose_name='\u662f\u5426\u5f00\u542f\u8be5\u529f\u80fd')),
                ('wlist', models.TextField(default=b'', help_text='\u652f\u6301\u4e24\u79cd\u683c\u5f0f\u6570\u636e\uff0c\u4ee5\u9017\u53f7\u3001\u5206\u53f7\u5206\u9694\u7684\u5b57\u7b26\u4e32\uff0c\u53caJSON\u683c\u5f0f\u5b57\u7b26\u4e32', null=True, verbose_name='\u529f\u80fd\u6d4b\u8bd5\u767d\u540d\u5355', blank=True)),
                ('func_desc', models.TextField(default=b'', null=True, verbose_name='\u529f\u80fd\u63cf\u8ff0', blank=True)),
                ('created_time', models.DateTimeField(auto_now_add=True, verbose_name='\u521b\u5efa\u65f6\u95f4')),
            ],
            options={
                'db_table': 'esb_function_controller',
            },
        ),
        migrations.CreateModel(
            name='UserAuthToken',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('app_code', models.CharField(max_length=128, verbose_name='\u84dd\u9cb8\u5e94\u7528\u7f16\u7801')),
                ('username', models.CharField(max_length=64, verbose_name='\u7528\u6237\u540d')),
                ('auth_token', models.CharField(max_length=255, verbose_name='token\u5185\u5bb9')),
                ('expires', models.DateTimeField(verbose_name='token\u8fc7\u671f\u65f6\u95f4')),
                ('last_accessed_time', models.DateTimeField(auto_now_add=True, verbose_name='\u6700\u540e\u8bbf\u95ee\u65f6\u95f4')),
                ('created_time', models.DateTimeField(auto_now_add=True, verbose_name='\u521b\u5efa\u65f6\u95f4')),
            ],
            options={
                'db_table': 'esb_user_auth_token',
            },
        ),
    ]
