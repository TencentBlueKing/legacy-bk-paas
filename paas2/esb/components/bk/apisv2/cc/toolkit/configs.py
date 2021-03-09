# -*- coding: utf-8 -*-
from django.conf import settings

from esb.utils import SmartHost


SYSTEM_NAME = "CC"

host = SmartHost(host_prod=getattr(settings, "HOST_CC_V3", ""))

DEFAULT_BK_SUPPLIER_ACCOUNT = "0"
