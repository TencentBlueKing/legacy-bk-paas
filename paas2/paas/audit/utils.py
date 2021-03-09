# -*- coding: utf-8 -*-

from audit.signals import _record_audit_log


def record_audit_log(
    system,
    username,
    op_type,
    op_object_type,
    op_object_id,
    op_object_name,
    data_before=None,
    data_after=None,
    comment=None,
):

    data = {
        "system": system,
        "username": username,
        "op_type": op_type,
        "op_object_type": op_object_type,
        "op_object_id": op_object_id,
        "op_object_name": op_object_name,
    }

    if data_before is not None:
        data["data_before"] = data_before
    if data_after is not None:
        data["data_after"] = data_after

    _record_audit_log.send(sender="open_paas", **data)
