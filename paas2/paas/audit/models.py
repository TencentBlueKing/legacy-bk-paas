#!/usr/bin/env python
# -*- coding: utf-8 -*-

import uuid

from django.db import models
from django.utils.translation import ugettext as _, ugettext_lazy as _l

from audit.constants import AuditEventOperationTypeEnum


class AuditEventLog(models.Model):
    OP_TYPE_CHOICES = (
        (AuditEventOperationTypeEnum.QUERY, _(u"查询")),
        (AuditEventOperationTypeEnum.CREATE, _(u"创建")),
        (AuditEventOperationTypeEnum.DELETE, _(u"删除")),
        (AuditEventOperationTypeEnum.MODIFY, _(u"修改")),
    )

    event_id = models.UUIDField(default=uuid.uuid4, editable=False)
    system = models.CharField(max_length=64, blank=False, null=False)
    username = models.CharField(max_length=64, blank=False, null=False)

    op_time = models.DateTimeField(auto_now_add=True)
    op_type = models.CharField(max_length=32, choices=OP_TYPE_CHOICES, blank=False, null=False)
    op_object_type = models.CharField(max_length=32, blank=False, null=False)
    op_object_id = models.CharField(max_length=64, blank=True, null=True)
    op_object_name = models.CharField(max_length=64, blank=True, null=True)

    data_before = models.TextField(null=True, blank=True)
    data_after = models.TextField(null=True, blank=True)

    comment = models.TextField(null=True, blank=True)

    class Meta:
        db_table = "audit_event_log"
        verbose_name = _l(u"操作审计日志")
        verbose_name_plural = _l(u"操作审计日志")
