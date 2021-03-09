# -*- coding: utf-8 -*-

from django.conf.urls import url

from common.constants import APP_CODE_REGEX
from release import views

urlpatterns = [
    # 下架
    url(r"^(?P<app_code>" + APP_CODE_REGEX + ")/$", views.unrelease_page),
]
