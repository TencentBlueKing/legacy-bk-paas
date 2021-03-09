# -*- coding: utf-8 -*-
from django.db import models

from common.constants import APPROVAL_RESULT_CHOICE
from app_esb_auth.manager import ESBAuthApplyRecordManager


class EsbAuthApplyReocrd(models.Model):
    """
    组件权限申请记录
    """

    operator = models.CharField(u"申请人", max_length=32)
    app_code = models.CharField(u"申请的应用", max_length=32)
    sys_name = models.CharField(u"组件系统名称", max_length=128)
    api_id = models.IntegerField(u"组件系统API ID")
    api_name = models.CharField(u"组件系统API名称", max_length=128)
    create_time = models.DateTimeField(u"创建时间", auto_now_add=True, blank=True, null=True)

    approver = models.CharField(u"审批人", max_length=32, blank=True, null=True)
    approval_result = models.CharField(u"审批结果", max_length=32, choices=APPROVAL_RESULT_CHOICE, default="applying")
    approval_time = models.DateTimeField(u"审批时间", null=True, blank=True)

    objects = ESBAuthApplyRecordManager()

    class Meta:
        verbose_name = u"app组件申请记录表"
        verbose_name_plural = u"app组件申请记录表"
        db_table = "paas_app_esb_auth_apply_record"

    def __unicode__(self):
        return "%s(%s)" % (self.operator, self.app_code)
