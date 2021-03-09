# -*- coding: utf-8 -*-
from django.conf import settings

from esb.utils import SmartHost


SYSTEM_NAME = "BK_LOGIN"

headers = {
    "X-APP-CODE": "esb",
    "X-APP-TOKEN": settings.ESB_TOKEN,
}

host = SmartHost(
    host_prod=settings.HOST_BK_LOGIN,
)
