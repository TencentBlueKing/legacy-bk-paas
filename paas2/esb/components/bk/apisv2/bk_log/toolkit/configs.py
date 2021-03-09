# -*- coding: utf-8 -*-
from django.conf import settings

from esb.utils import SmartHost


SYSTEM_NAME = "BK_LOG"

host = SmartHost(host_prod=getattr(settings, "BK_LOG_HOST", ""))
