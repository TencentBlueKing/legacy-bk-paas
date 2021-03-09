# -*- coding: utf-8 -*-

from common.log import logger
from common.bk_iam import Permission

from django.dispatch import Signal
from django.dispatch import receiver


_app_creator_permission = Signal(providing_args=["app_code", "app_name", "username"])


@receiver(_app_creator_permission)
def apply_app_creator_permission(sender, **kwargs):
    try:
        kwargs.pop("signal")
        Permission().apply_app_developer_permission(**kwargs)
    except Exception:
        logger.exception("apply_app_creator_permission fali")
        logger.error("args=%s", kwargs)
