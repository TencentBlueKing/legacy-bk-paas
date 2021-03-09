# -*- coding: utf-8 -*-

from django.conf import settings
from common.mymako import render_mako_context
from engine.models import BkServer


def services(request):
    """
    服务介绍
    """
    return render_mako_context(request, "guide/services.html", {})


def newbie(request):
    """
    新手指南
    """
    paas_host = "{}://{}".format(settings.HTTP_SCHEMA, settings.PAAS_DOMAIN)
    # 获取已激活的 AppServer 信息
    active_servers = BkServer.objects.filter(is_active=True)
    active_server_ips = active_servers.values_list("ip_address", flat=True)
    active_server_ips = ";".join(set(active_server_ips))
    return render_mako_context(
        request, "guide/newbie.html", {"paas_host": paas_host, "active_server_ips": active_server_ips}
    )
