# -*- coding: utf-8 -*-
from django.conf import settings

from esb.utils import SmartHost


SYSTEM_NAME = "USERMANAGE"

host = SmartHost(host_prod=getattr(settings, "USERMGR_HOST", ""))
