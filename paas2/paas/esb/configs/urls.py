# -*- coding: utf-8 -*-
from django.conf import settings
from django.conf.urls import include, url


urlpatterns = [
    url(r"^manager/", include("esb.apps.manager.urls")),
    url(r"^guide/", include("esb.apps.guide.urls")),
    url(r"^api_docs/", include("esb.apps.api_docs.urls")),
]


if settings.EDITION == "ee":
    urlpatterns += [
        url(r"^status/", include("esb.apps.status.urls")),
    ]
