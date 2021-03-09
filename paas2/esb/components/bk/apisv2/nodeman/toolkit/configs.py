# -*- coding: utf-8 -*-
from django.conf import settings

from esb.utils import SmartHost


SYSTEM_NAME = "NODEMAN"

host = SmartHost(host_prod=getattr(settings, "NODEMAN_HOST", ""))
