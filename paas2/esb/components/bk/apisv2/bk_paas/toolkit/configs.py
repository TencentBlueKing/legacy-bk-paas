# -*- coding: utf-8 -*-
from django.conf import settings

from esb.utils import SmartHost


SYSTEM_NAME = "BK_PAAS"

headers = {
    "X-APP-CODE": "esb",
    "X-APP-TOKEN": settings.ESB_TOKEN,
}

host = SmartHost(host_prod=getattr(settings, "PAAS_HOST", ""))
