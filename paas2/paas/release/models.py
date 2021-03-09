# -*- coding: utf-8 -*-
"""
Copyright © 2012-2017 Tencent BlueKing. All Rights Reserved. 蓝鲸智云 版权所有
"""
import json

from django.db import models
from django.utils import timezone
from django.utils.translation import ugettext as _, ugettext_lazy as _l

from common.constants import ENV_DISPLAY_DICT
from app.models import App
from app.constants import STATE_CHOICES
from release.constants import OPERATE_ID_CHOICES, USER_OPERATE_TYPE_CHOICES, OperateIDEnum
from release.manager import RecordManager, VersionManager, UserOperateRecordManager


class Record(models.Model):
    """
    记录应用提测、上线、下架操作信息
    """

    app_code = models.CharField(_l(u"对应的appcode"), max_length=30, db_index=True)
    operate_id = models.IntegerField(
        _l(u"操作标识"), choices=OPERATE_ID_CHOICES, help_text=_l(u"0为提测操作，1为上线操作"), db_index=True
    )
    operate_user = models.CharField(_l(u"操作人"), max_length=50, blank=True, null=True, help_text=_l(u"进行上线或提测操作的人"))

    app_old_state = models.SmallIntegerField(
        _l(u"操作前app的状态"), choices=STATE_CHOICES, help_text=_l(u"操作前app的状态"), default=1
    )
    # = 记录第一次生成的时间
    operate_time = models.DateTimeField(_l(u"操作时间"), auto_now_add=True, blank=True, null=True, db_index=True)
    is_success = models.BooleanField(_l(u"操作是否成功"), default=False, help_text=_l(u"提测或上线操作是否成功"), db_index=True)
    is_tips = models.BooleanField(_l(u"显示新标志"), default=False, help_text=_l(u"是否在logo上添加更新提示"))
    is_version = models.BooleanField(_l(u"显示新特性"), default=False, help_text=_l(u"是否在新应用应用打开时显示该版本更新特性"))
    version = models.CharField(_l(u"版本号"), max_length=50, blank=True, null=True, help_text=_l(u"需要显示的版本号信息"))
    message = models.TextField(_l(u"操作返回信息"), blank=True, null=True, help_text=_l(u"执行提测或上线操作后脚本的返回信息"))
    event_id = models.CharField(u"Event_id", max_length=36, blank=True, null=True, db_index=True)
    # 后台任务执行额外输出
    extra_data = models.TextField(_l(u"额外执行结果数据"), blank=True, null=True, help_text=_l(u"json串存储"))

    objects = RecordManager()

    @property
    def is_done(self):
        return self.operate_id in (OperateIDEnum.TO_TEST, OperateIDEnum.TO_ONLINE, OperateIDEnum.TO_OUTLINE)

    @property
    def operate_type_display(self):
        return _(dict(OPERATE_ID_CHOICES).get(self.operate_id))

    @property
    def operate_time_display(self):
        if not self.operate_time:
            return ""
        t = timezone.localtime(self.operate_time)
        return t.strftime("%Y-%m-%d %X")
        # return self.operate_time.strftime('%Y-%m-%d %X')

    @property
    def message_display(self):
        return self.message.replace("\n", "<br/>") if self.message else _(u"没有返回信息！")

    def get_extra_data(self):
        try:
            extra_data = json.loads(self.extra_data) if self.extra_data else {}
        except Exception:
            extra_data = {}
        return extra_data

    @property
    def task_detail(self):
        extra_data = self.get_extra_data()
        if not extra_data:
            task_detail = ""
        else:
            task_detail = extra_data.get("task_detail", "")
        return task_detail

    @property
    def extra_msg(self):
        extra_data = self.get_extra_data()
        if not extra_data:
            extra_msg = "--"
        else:
            if self.operate_id in [OperateIDEnum.IN_OUTLINE, OperateIDEnum.TO_OUTLINE]:
                _extra_data_mode = extra_data.get("mode", "all")
                _env = ENV_DISPLAY_DICT.get(_extra_data_mode, u"--")
                extra_msg = _(u"选择下架环境：%s") % _env
            else:
                extra_msg = "--"
        return extra_msg

    def update_fields(
        self, event_id=None, operate_id=None, message=None, is_tips=None, is_success=None, extra_data=None
    ):
        if event_id is not None:
            self.event_id = event_id

        if extra_data is not None:
            self.extra_data = extra_data

        if operate_id is not None:
            self.operate_id = operate_id
        if message is not None:
            self.message = message

        if is_tips is not None:
            self.is_tips = is_tips
        if is_success is not None:
            self.is_success = is_success

        self.save()

    def __unicode__(self):
        return "%s" % (self.app_code)

    class Meta:
        db_table = "paas_release_record"
        verbose_name = _l(u"应用部署操作信息")
        verbose_name_plural = _l(u"应用部署操作信息")


class Version(models.Model):
    """
    存储app版本信息
    """

    app = models.ForeignKey(App, verbose_name=_l(u"应用"))
    version = models.CharField(_l(u"app版本号"), max_length=30, help_text=_l(u"格式：x.x.x，只允许包含数字"))
    code_addr = models.CharField(_l(u"拉取的代码地址"), max_length=200, blank=True, null=True)
    publisher = models.CharField(_l(u"版本发布者"), max_length=30)
    pubdate = models.DateTimeField(_l(u"发布时间"), auto_now_add=True, blank=True, null=True, db_index=True)
    desc = models.TextField(_l(u"版本描述"), blank=True, null=True)

    objects = VersionManager()

    @property
    def pubdate_display(self):
        if not self.pubdate:
            return ""
        t = timezone.localtime(self.operate_time)
        return t.strftime("%Y-%m-%d %X")
        # return self.pubdate.strftime("%Y-%m-%d %H:%M:%S")

    def __unicode__(self):
        return "%s(%s)" % (self.app.name, self.version)

    class Meta:
        db_table = "paas_release_version"
        verbose_name = _l(u"应用发布版本信息")
        verbose_name_plural = _l(u"应用发布版本信息")


class VersionDetail(models.Model):
    """
    存放应用每个版本对应的特征信息和bugs信息
    """

    features = models.TextField(u"更新特性", help_text=u"记录该版本特性信息", blank=True, null=True, default=None)
    bug = models.TextField(u"修复bug", help_text=u"记录修复的bug信息", blank=True, null=True, default=None)
    app_version = models.ForeignKey(Version)

    def __unicode__(self):
        return self.features

    class Meta:
        db_table = "paas_release_versiondetail"
        verbose_name = u"应用特征信息"
        verbose_name_plural = u"应用特征信息"


class UserOperateRecord(models.Model):
    """
    用户操作流水日志
    """

    app_code = models.CharField(_l(u"操作的app"), max_length=30)
    username = models.CharField(_l(u"操作人"), max_length=50)
    before_data = models.TextField(_l(u"操作前数据"), blank=True, null=True)
    arfter_data = models.TextField(_l(u"操作后数据"), blank=True, null=True)
    operate_time = models.DateTimeField(_l(u"操作时间"), auto_now_add=True)
    operate_type = models.IntegerField(_l(u"操作类型"), default=0, choices=USER_OPERATE_TYPE_CHOICES)
    extra_data = models.TextField(_l(u"其他说明"), blank=True, null=True)

    objects = UserOperateRecordManager()

    def __unicode__(self):
        return "%s" % (self.app_code)

    class Meta:
        db_table = "paas_release_useroperaterecord"
        verbose_name = _l(u"用户操作流水日志")
        verbose_name_plural = _l(u"用户操作流水日志")
