# -*- coding: utf-8 -*-

from common.constants import enum

AuditEventOperationTypeEnum = enum(
    QUERY="query",
    CREATE="create",
    DELETE="delete",
    MODIFY="modify",
)


AuditSystemEnum = enum(
    PAAS="open_paas/paas",
)

AuditOPObjectTypeEnum = enum(
    APP="app",
    SMART="smart",
)
