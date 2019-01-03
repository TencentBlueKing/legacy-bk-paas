# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

from __future__ import unicode_literals

import json

from django.db import models

from app.models import App
from app.constants import STATE_CHOICES
from release.manager import ReleaseVersionManager, UserOperateRecordManager, ReleaseRecordManager
from release.constants import (OPERATE_ID_CHOICES, USER_OPERATE_TYPE_CHOICES)


class Record(models.Model):
    """
    记录应用提测、上线、下架操作信息
    """
    app_code = models.CharField("对应的appcode", max_length=30, db_index=True)
    operate_id = models.IntegerField("操作标识", choices=OPERATE_ID_CHOICES, help_text="0为提测操作，1为上线操作", db_index=True)
    operate_user = models.CharField("操作人", max_length=50, blank=True, null=True, help_text="进行上线或提测操作的人")

    app_old_state = models.SmallIntegerField("操作前app的状态", choices=STATE_CHOICES, help_text="操作前app的状态", default=1)
    # = 记录第一次生成的时间
    operate_time = models.DateTimeField("操作时间", auto_now_add=True, blank=True, null=True, db_index=True)
    is_success = models.BooleanField("操作是否成功", default=False, help_text="提测或上线操作是否成功", db_index=True)
    is_tips = models.BooleanField("显示新标志", default=False, help_text="是否在logo上添加更新提示")
    is_version = models.BooleanField("显示新特性", default=False, help_text="是否在新应用应用打开时显示该版本更新特性")
    version = models.CharField("版本号", max_length=50, blank=True, null=True, help_text="需要显示的版本号信息")
    message = models.TextField("操作返回信息", blank=True, null=True, help_text="执行提测或上线操作后脚本的返回信息")
    event_id = models.CharField(u'Event_id', max_length=36, blank=True, null=True, db_index=True)
    # 后台任务执行额外输出
    extra_data = models.TextField("额外执行结果数据", blank=True, null=True, help_text="json串存储")

    objects = ReleaseRecordManager()

    @property
    def operate_time_display(self):
        if not self.operate_time:
            return ''
        return self.operate_time.strftime('%Y-%m-%d %X')

    def get_extra_data(self):
        try:
            extra_data = json.loads(self.extra_data) if self.extra_data else {}
        except Exception:
            extra_data = {}
        return extra_data

    def __unicode__(self):
        return '%s' % (self.app_code)

    class Meta:
        db_table = 'paas_release_record'
        verbose_name = "应用部署操作信息"
        verbose_name_plural = "应用部署操作信息"


class Version(models.Model):
    """
    存储app版本信息
    """
    app = models.ForeignKey(App, verbose_name="应用")
    version = models.CharField("app版本号", max_length=30, help_text="格式：x.x.x，只允许包含数字")
    code_addr = models.CharField("拉取的代码地址", max_length=200, blank=True, null=True)
    publisher = models.CharField("版本发布者", max_length=30)
    pubdate = models.DateTimeField("发布时间", auto_now_add=True, blank=True, null=True, db_index=True)
    desc = models.TextField("版本描述", blank=True, null=True)

    objects = ReleaseVersionManager()

    @property
    def pubdate_display(self):
        if not self.pubdate:
            return ''
        return self.pubdate.strftime("%Y-%m-%d %H:%M:%S")

    def __unicode__(self):
        return '%s(%s)' % (self.app.name, self.version)

    class Meta:
        db_table = 'paas_release_version'
        verbose_name = "应用发布版本信息"
        verbose_name_plural = "应用发布版本信息"


class VersionDetail(models.Model):
    """
    存放应用每个版本对应的特征信息和bugs信息
    """
    features = models.TextField("更新特性", help_text="记录该版本特性信息", blank=True, null=True, default=None)
    bug = models.TextField("修复bug", help_text="记录修复的bug信息", blank=True, null=True, default=None)
    app_version = models.ForeignKey(Version)

    def __unicode__(self):
        return self.features

    class Meta:
        db_table = 'paas_release_versiondetail'
        verbose_name = "应用特征信息"
        verbose_name_plural = "应用特征信息"


class UserOperateRecord(models.Model):
    """
    用户操作流水日志
    """
    app_code = models.CharField("操作的app", max_length=30)
    username = models.CharField("操作人", max_length=50)
    before_data = models.TextField("操作前数据", blank=True, null=True)
    arfter_data = models.TextField("操作后数据", blank=True, null=True)
    operate_time = models.DateTimeField("操作时间", auto_now_add=True)
    operate_type = models.IntegerField("操作类型", default=0, choices=USER_OPERATE_TYPE_CHOICES)
    extra_data = models.TextField("其他说明", blank=True, null=True)

    objects = UserOperateRecordManager()

    def __unicode__(self):
        return '%s' % (self.app_code)

    class Meta:
        db_table = 'paas_release_useroperaterecord'
        verbose_name = "用户操作流水日志"
        verbose_name_plural = "用户操作流水日志"
