# -*- coding: utf-8 -*-
from django.conf import settings

from esb.utils import SmartHost


SYSTEM_NAME = "BSCP"

host = SmartHost(
    host_prod=getattr(settings, "BK_BSCP_API_ADDR", ""),
)
