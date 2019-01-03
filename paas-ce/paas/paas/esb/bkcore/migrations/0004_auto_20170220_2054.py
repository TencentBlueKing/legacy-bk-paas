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


class Migration(migrations.Migration):

    dependencies = [
        ('bkcore', '0003_load_intial_data'),
    ]

    operations = [
        migrations.AddField(
            model_name='componentsystem',
            name='execute_timeout',
            field=models.IntegerField(help_text='\u5355\u4f4d\u79d2\uff0c\u672a\u8bbe\u7f6e\u65f6\u8d85\u65f6\u65f6\u957f\u4e3a30\u79d2', null=True, verbose_name='\u6267\u884c\u7c7b\u8d85\u65f6\u65f6\u957f', blank=True),
        ),
        migrations.AddField(
            model_name='componentsystem',
            name='query_timeout',
            field=models.IntegerField(help_text='\u5355\u4f4d\u79d2\uff0c\u672a\u8bbe\u7f6e\u65f6\u8d85\u65f6\u65f6\u957f\u4e3a30\u79d2', null=True, verbose_name='\u67e5\u8be2\u7c7b\u8d85\u65f6\u65f6\u957f', blank=True),
        ),
        migrations.AddField(
            model_name='esbbuffetcomponent',
            name='timeout_time',
            field=models.IntegerField(help_text='\u5355\u4f4d\u79d2\uff0c\u672a\u8bbe\u7f6e\u65f6\u4ee5\u6240\u5c5e\u7ec4\u4ef6\u7cfb\u7edf\u8d85\u65f6\u65f6\u957f\u4e3a\u51c6', null=True, verbose_name='\u8d85\u65f6\u65f6\u957f', blank=True),
        ),
        migrations.AddField(
            model_name='esbbuffetcomponent',
            name='type',
            field=models.IntegerField(default=2, verbose_name='\u7ec4\u4ef6\u7c7b\u578b', choices=[(1, '\u6267\u884cAPI'), (2, '\u67e5\u8be2API')]),
        ),
        migrations.AddField(
            model_name='esbchannel',
            name='timeout_time',
            field=models.IntegerField(help_text='\u5355\u4f4d\u79d2\uff0c\u672a\u8bbe\u7f6e\u65f6\u4ee5\u6240\u5c5e\u7ec4\u4ef6\u7cfb\u7edf\u8d85\u65f6\u65f6\u957f\u4e3a\u51c6', null=True, verbose_name='\u8d85\u65f6\u65f6\u957f', blank=True),
        ),
        migrations.AddField(
            model_name='esbchannel',
            name='type',
            field=models.IntegerField(default=2, verbose_name='\u7ec4\u4ef6\u7c7b\u578b', choices=[(1, '\u6267\u884cAPI'), (2, '\u67e5\u8be2API')]),
        ),
        migrations.AlterField(
            model_name='componentsystem',
            name='interface_admin',
            field=models.CharField(default=b'', help_text='\u8bb0\u5f55\u7cfb\u7edf\u63a5\u53e3\u8d1f\u8d23\u4eba\uff0c\u4ee5\u4fbf\u8fdb\u884c\u6d88\u606f\u901a\u77e5\u6216\u76f4\u63a5\u8054\u7cfb\uff0c\u957f\u5ea6\u4e3a128\u5b57\u7b26\u4ee5\u5185', max_length=128, verbose_name='\u7cfb\u7edf\u63a5\u53e3\u8d1f\u8d23\u4eba', blank=True),
        ),
        migrations.AlterField(
            model_name='componentsystem',
            name='label',
            field=models.CharField(help_text='\u7cfb\u7edf\u7b80\u8981\u8bf4\u660e', max_length=128, verbose_name='\u7cfb\u7edf\u6807\u7b7e'),
        ),
        migrations.AlterField(
            model_name='esbchannel',
            name='component_codename',
            field=models.CharField(help_text='\u5bf9\u5e94\u7684\u7ec4\u4ef6\u4ee3\u53f7\uff0c\u8be5\u7ec4\u4ef6\u5fc5\u987b\u6ce8\u518c\u5230ESB\u5e73\u53f0\u4e2d\uff0c\u4f8b\u5982 "generic.host.get_host_list"', max_length=255, verbose_name='\u5bf9\u5e94\u7ec4\u4ef6\u4ee3\u53f7'),
        ),
        migrations.AlterField(
            model_name='esbchannel',
            name='name',
            field=models.CharField(help_text='\u901a\u9053\u540d\u79f0\uff0c\u957f\u5ea6\u9650\u5236\u4e3a64\u5b57\u7b26\uff0c\u4f8b\u5982"[HOST] \u67e5\u8be2\u670d\u52a1\u5668\u5217\u8868"', max_length=64, verbose_name='\u901a\u9053\u540d\u79f0'),
        ),
        migrations.AlterField(
            model_name='esbchannel',
            name='path',
            field=models.CharField(help_text='\u901a\u9053\u8bf7\u6c42\u8def\u5f84\uff0c\u4f8b\u5982"/host/get_host_list/"', unique=True, max_length=255, verbose_name='\u901a\u9053\u8def\u5f84'),
        ),
    ]
