# -*- coding: utf-8 -*-
from django.conf import settings


def get_smart_paas_domain():
    """
    智能获取paas域名，80端口去除
    """
    host_port = settings.PAAS_DOMAIN.split(":")
    port = host_port[1] if len(host_port) >= 2 else ""
    paas_domain = host_port[0] if port in ["80"] else settings.PAAS_DOMAIN
    return paas_domain
