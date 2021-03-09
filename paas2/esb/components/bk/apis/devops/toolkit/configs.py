# -*- coding: utf-8 -*-
from django.conf import settings

from esb.utils import SmartHost


SYSTEM_NAME = "DEVOPS"


host = SmartHost(host_prod=getattr(settings, "DEVOPS_HOST", None))
