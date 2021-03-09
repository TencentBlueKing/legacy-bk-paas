# -*- coding: utf-8 -*-
from django.conf.urls import patterns, url


urlpatterns = patterns(
    "",
    url(r"^compapi/(.*?)$", "esb.routers.api_router_view"),
    url(r"^self-service-api/(.*?)$", "esb.routers.buffet_component_view"),
)


# 处理404和500请求
handler404 = "esb.views.handler_404_view"
handler500 = "esb.views.handler_500_view"
