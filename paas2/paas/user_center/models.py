# -*- coding: utf-8 -*-
from django.db import models

from common.constants import APPROVAL_RESULT_CHOICE, RoleCodeEnum
from user_center.manager import WxBkUserTmpRecordManager


class RoleApplyReocrd(models.Model):
    """
    用户角色权限申请记录
    """

    operator = models.CharField(u"申请人", max_length=32)
    create_time = models.DateTimeField(u"创建时间", auto_now_add=True, blank=True, null=True)
    apply_reason = models.TextField(u"申请原因", blank=True, null=True)
    apply_role = models.CharField(u"申请的角色", max_length=32, default=str(RoleCodeEnum.DEVELOPER))

    approver = models.CharField(u"审批人", max_length=32, blank=True, null=True)
    approval_result = models.CharField(u"审批结果", max_length=32, choices=APPROVAL_RESULT_CHOICE, default="applying")
    approval_time = models.DateTimeField(u"审批时间", null=True, blank=True)
    approval_reason = models.TextField(u"审批原因", blank=True, null=True)

    class Meta:
        verbose_name = u"用户角色权限表"
        verbose_name_plural = u"用户角色权限表"
        db_table = "console_user_role_apply_record"

    def __unicode__(self):
        return "%s(%s)" % (self.operator, self.apply_role)


class WxBkUserTmpRecord(models.Model):
    """
    微信与蓝鲸用户绑定过程临时表（后续可迁移到redis中，并设置过期时间）
    """

    username = models.CharField(u"用户名", max_length=32)
    bk_token = models.CharField(u"登录态token", max_length=255)
    wx_ticket = models.CharField(u"微信临时标识(state或二维码ticket)", max_length=127, unique=True, db_index=True)
    create_time = models.DateTimeField(u"创建时间", auto_now_add=True, blank=True, null=True)

    objects = WxBkUserTmpRecordManager()

    class Meta:
        verbose_name = u"微信与蓝鲸用户绑定过程临时表"
        verbose_name_plural = u"微信与蓝鲸用户绑定过程临时表"
        db_table = "console_wx_bkuser_tmp_record"

    def __unicode__(self):
        return self.username
