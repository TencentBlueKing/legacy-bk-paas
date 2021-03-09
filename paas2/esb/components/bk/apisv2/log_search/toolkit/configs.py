# -*- coding: utf-8 -*-
from django.conf import settings

from esb.utils import SmartHost


SYSTEM_NAME = "LOG_SEARCH"

host = SmartHost(host_prod=getattr(settings, "PAAS_HOST", ""))
