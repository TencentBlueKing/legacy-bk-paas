# -*- coding: utf-8 -*-
from django.conf import settings

from esb.utils import SmartHost


SYSTEM_NAME = "MONITOR_V3"

host = SmartHost(host_prod=getattr(settings, "MONITOR_V3_HOST", ""))
