# -*- coding: utf-8 -*-
from django.conf import settings

from esb.utils import SmartHost


SYSTEM_NAME = "CICDKIT"

host = SmartHost(host_prod=getattr(settings, "CICDKIT_HOST", ""))
