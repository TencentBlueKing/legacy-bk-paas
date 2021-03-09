# -*- coding: utf-8 -*-

from common.log import logger
from audit.models import AuditEventLog

from django.dispatch import Signal
from django.dispatch import receiver


_record_audit_log = Signal(
    providing_args=[
        "system",
        "username",
        "op_type",
        "op_object_type",
        "op_object_id",
        "op_object_name",
        "data_before",
        "data_after",
        "comment",
    ]
)


@receiver(_record_audit_log)
def audit_log(sender, **kwargs):
    try:
        kwargs.pop("signal")
        AuditEventLog.objects.create(**kwargs)
    except Exception:
        logger.exception("log audit event log fail")
        logger.error("args=%s", kwargs)
