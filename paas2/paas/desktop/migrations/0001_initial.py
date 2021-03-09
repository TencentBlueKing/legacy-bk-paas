# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS
Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License.
You may obtain a copy of the License at http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
specific language governing permissions and limitations under the License.
"""

from __future__ import unicode_literals

from django.db import migrations, models
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('app', '0008_auto_20170221_1132'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserApp',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('add_time', models.DateTimeField(auto_now_add=True, help_text='\u6dfb\u52a0\u65f6\u95f4', null=True, verbose_name='\u6dfb\u52a0\u65f6\u95f4')),
                ('desk_app_type', models.IntegerField(default=0, verbose_name='\u684c\u9762\u5e94\u7528\u7c7b\u578b', choices=[(0, '\u5e94\u7528'), (1, '\u6587\u4ef6\u5939')])),
                ('folder_name', models.CharField(help_text='\u5982\u679cdesk_app_type\u4e3a0,\u5219\u8be5\u5b57\u6bb5\u4e0d\u7528\u586b\u5199;\u53cd\u4e4b,\u5219\u5fc5\u586b', max_length=127, null=True, verbose_name='\u6587\u4ef6\u5939\u540d', blank=True)),
                ('app_position', models.CharField(default=b'desk1', max_length=20, verbose_name='\u7528\u6237APP\u6240\u5728\u4f4d\u7f6e', choices=[(b'dock', '\u5e94\u7528\u7801\u5934'), (b'desk1', '\u684c\u97621'), (b'desk2', '\u684c\u97622'), (b'desk3', '\u684c\u97623'), (b'desk4', '\u684c\u97624'), (b'desk5', '\u684c\u97625')])),
                ('app', models.ForeignKey(verbose_name='\u5e94\u7528', to='app.App', help_text='\u6587\u4ef6\u5939\u5219\u6b64\u5b57\u6bb5\u4e3a\u7a7a', null=True)),
                ('parent', models.ForeignKey(verbose_name='APP\u6240\u5728\u7684\u6587\u4ef6\u5939', blank=True, to='desktop.UserApp', null=True)),
                ('user', models.ForeignKey(verbose_name='\u7528\u6237', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['id'],
                'db_table': 'console_desktop_userapp',
                'verbose_name': '\u7528\u6237\u684c\u9762\u5e94\u7528',
                'verbose_name_plural': '\u7528\u6237\u684c\u9762\u5e94\u7528',
            },
        ),
        migrations.CreateModel(
            name='UserSettings',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('appxy', models.CharField(default=b'y', max_length=10, verbose_name='APP\u56fe\u6807\u6392\u5217\u65b9\u5f0f', choices=[(b'x', '\u6a2a\u6392\u5217'), (b'y', '\u7ad6\u6392\u5217')])),
                ('dockpos', models.CharField(default=b'left', max_length=20, verbose_name='\u5e94\u7528\u7801\u5934\u4f4d\u7f6e', choices=[(b'top', '\u4e0a\u8fb9'), (b'left', '\u5de6\u8fb9'), (b'right', '\u53f3\u8fb9')])),
                ('skin', models.CharField(default=b'mac', max_length=20, verbose_name='\u7a97\u53e3\u76ae\u80a4', choices=[(b'chrome', b'Chrome\xe7\x9a\xae\xe8\x82\xa4'), (b'default', '\u9ed8\u8ba4'), (b'ext', 'Ext\u76ae\u80a4'), (b'mac', 'Mac\u76ae\u80a4'), (b'qq', 'QQ\u76ae\u80a4')])),
                ('wallpaper_id', models.IntegerField(default=1, verbose_name='\u58c1\u7eb8ID')),
                ('wallpaper_type', models.CharField(default=b'tianchong', max_length=20, verbose_name='\u58c1\u7eb8\u663e\u793a\u65b9\u5f0f', choices=[(b'tianchong', '\u586b\u5145'), (b'shiying', '\u9002\u5e94'), (b'pingpu', '\u5e73\u94fa'), (b'lashen', '\u62c9\u4f38'), (b'juzhong', '\u5c45\u4e2d')])),
                ('dock', models.TextField(default=b'', help_text='\u7528\u201c,\u201d\u76f8\u8fde', null=True, verbose_name='[\u5e94\u7528\u7801\u5934]\u5e94\u7528id', blank=True)),
                ('desk1', models.TextField(default=b'', help_text='\u7528\u201c,\u201d\u76f8\u8fde', null=True, verbose_name='[\u684c\u97621]\u5e94\u7528id', blank=True)),
                ('desk2', models.TextField(default=b'', help_text='\u7528\u201c,\u201d\u76f8\u8fde', null=True, verbose_name='[\u684c\u97622]\u5e94\u7528id', blank=True)),
                ('desk3', models.TextField(default=b'', help_text='\u7528\u201c,\u201d\u76f8\u8fde', null=True, verbose_name='[\u684c\u97623]\u5e94\u7528id', blank=True)),
                ('desk4', models.TextField(default=b'', help_text='\u7528\u201c,\u201d\u76f8\u8fde', null=True, verbose_name='[\u684c\u97624]\u5e94\u7528id', blank=True)),
                ('desk5', models.TextField(default=b'', help_text='\u7528\u201c,\u201d\u76f8\u8fde', null=True, verbose_name='[\u684c\u97625]\u5e94\u7528id', blank=True)),
                ('user', models.ForeignKey(verbose_name='\u7528\u6237', to=settings.AUTH_USER_MODEL, unique=True)),
            ],
            options={
                'db_table': 'console_desktop_usersettings',
                'verbose_name': '\u7528\u6237\u684c\u9762\u8bbe\u7f6e',
                'verbose_name_plural': '\u7528\u6237\u684c\u9762\u8bbe\u7f6e',
            },
        ),
        migrations.CreateModel(
            name='Wallpaper',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=40, null=True, verbose_name='\u58c1\u7eb8\u540d\u79f0', blank=True)),
                ('number', models.IntegerField(default=0, help_text='\u975e0\u503c\uff0c\u5219\u5fc5\u987b\u4fdd\u8bc1\u552f\u4e00', verbose_name='\u58c1\u7eb8\u7f16\u53f7')),
                ('width', models.IntegerField(null=True, verbose_name='\u58c1\u7eb8\u5bbd\u5ea6', blank=True)),
                ('height', models.IntegerField(null=True, verbose_name='\u58c1\u7eb8\u9ad8\u5ea6', blank=True)),
                ('is_default', models.BooleanField(default=False, verbose_name='\u662f\u5426\u4e3a\u9ed8\u8ba4\u58c1\u7eb8')),
            ],
            options={
                'db_table': 'console_desktop_wallpaper',
                'verbose_name': '\u58c1\u7eb8\u7ba1\u7406',
                'verbose_name_plural': '\u58c1\u7eb8\u7ba1\u7406',
            },
        ),
        migrations.AlterUniqueTogether(
            name='userapp',
            unique_together=set([('user', 'app')]),
        ),
    ]
