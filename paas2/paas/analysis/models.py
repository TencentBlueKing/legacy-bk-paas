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

from builtins import object
from django.db import models
from django.conf import settings
from django.utils.translation import ugettext_lazy as _l

from app.models import App
from analysis.manager import AppUseRecordManager


class AppUseRecord(models.Model):
    """
    用户使用app的记录
    """

    user = models.ForeignKey(settings.AUTH_USER_MODEL, verbose_name=_l(u"用户"))
    app = models.ForeignKey(App, verbose_name=_l(u"应用"))
    use_time = models.DateTimeField(_l(u"添加时间"), auto_now_add=True, blank=True, null=True, help_text=_l(u"使用时间"))
    access_host = models.CharField(_l(u"访问域名"), max_length=128, blank=True, null=True)
    source_ip = models.CharField(_l(u"来源IP"), max_length=64, blank=True, null=True)

    objects = AppUseRecordManager()

    def __unicode__(self):
        return "%s(%s)" % (self.user, self.app)

    class Meta(object):
        db_table = "console_analysis_appuserecord"
        verbose_name = _l(u"App访问记录数据")
        verbose_name_plural = _l(u"App访问记录数据")


class AppLiveness(models.Model):
    """
    app页面点击量、活跃度统计
    """

    app = models.ForeignKey(App, verbose_name=_l(u"应用"))
    user = models.ForeignKey(settings.AUTH_USER_MODEL, verbose_name=_l(u"用户"), blank=True, null=True)
    hits = models.IntegerField(_l(u"点击量"), default=0, help_text=_l(u"应用页面点击量"))
    add_date = models.DateTimeField(_l(u"添加日期"), auto_now_add=True, blank=True, null=True, help_text=_l(u"记录日期"))
    access_host = models.CharField(_l(u"访问域名"), max_length=128, blank=True, null=True)
    source_ip = models.CharField(_l(u"来源IP"), max_length=64, blank=True, null=True)

    def __unicode__(self):
        return "%s(%s)" % (self.user, self.app)

    class Meta(object):
        db_table = "console_analysis_appliveness"
        verbose_name = _l(u"app页面点击量活跃度统计")
        verbose_name_plural = _l(u"app页面点击量活跃度统计")


class AppOnlineTimeRecord(models.Model):
    """
    应用在线时长统计
    """

    ONLINE_TIME_TYPE = [(0, "workbench"), (1, "app")]
    app_code = models.CharField(_l(u"应用编码"), max_length=32, db_index=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, verbose_name=_l(u"用户"), blank=True, null=True)
    record_type = models.IntegerField(_l(u"统计类型"), choices=ONLINE_TIME_TYPE, default=0)
    online_time = models.FloatField(_l(u"在线时长（秒）"), default=0.0, help_text=_l(u"在线时长，以秒为单位"))
    add_date = models.DateTimeField(_l(u"添加日期"), auto_now_add=True, blank=True, null=True, help_text=_l(u"记录日期"))
    access_host = models.CharField(_l(u"访问域名"), max_length=128, blank=True, null=True)
    source_ip = models.CharField(_l(u"来源IP"), max_length=64, blank=True, null=True)

    def __unicode__(self):
        return "%s(%s)" % (self.user, self.app_code)

    class Meta(object):
        db_table = "console_analysis_apponlinetimerecord"
        verbose_name = _l(u"app在线时长统计")
        verbose_name_plural = _l(u"app在线时长统计")
