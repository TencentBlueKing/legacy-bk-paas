# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

from __future__ import unicode_literals

from django.db import models

from resource.manager import ResourceManager


class Resource(models.Model):
    """资源下载
    """
    name = models.CharField(u'名称', max_length=128)
    version = models.CharField(u'版本', max_length=36, blank=True, null=True, default='--')
    size = models.CharField(u'文件大小', max_length=36, blank=True, null=True, default='--')
    display = models.BooleanField("是否显示", default=True)
    icon_url = models.CharField(u'下载图标', max_length=256, blank=True, null=True, help_text="填写外网地址")
    doc_url = models.CharField("文档URL", max_length=256, blank=True, null=True, help_text="填写外网地址")
    download_url = models.CharField(u'下载URL', max_length=256, blank=True, null=True, help_text="填写外网地址")
    create_time = models.DateTimeField(u'创建时间', auto_now_add=True)

    objects = ResourceManager()

    class Meta:
        db_table = 'paas_resources'
        verbose_name = "资源下载"
        verbose_name_plural = "资源下载"

    def __unicode__(self):
        return '<%s-%s>' % (self.name, self.id)

    def to_dict(self):
        icon_url = self.icon_url
        if not self.icon_url:
            icon_url = '{}.png'.format(self.name.replace(' ', '_'))

        download_url = self.download_url
        if not self.download_url:
            download_url = '{}'.format(self.name.replace(' ', '_'))

        return {
            "name": self.name,
            "version": self.version or '--',
            "size": self.size or '--',
            "icon_url": icon_url,
            "doc_url": self.doc_url,
            "download_url": download_url,
        }
