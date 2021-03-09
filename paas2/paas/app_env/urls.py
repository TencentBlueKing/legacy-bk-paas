# -*- coding: utf-8 -*-


from django.conf.urls import url

from common.constants import SAAS_CODE_REGEX
from app_env import views

urlpatterns = [
    url(r"^(?P<app_code>" + SAAS_CODE_REGEX + ")/$", views.home),
    url(r"^(?P<app_code>" + SAAS_CODE_REGEX + ")/add/$", views.add_or_update_env_var),
    url(r"^(?P<app_code>" + SAAS_CODE_REGEX + ")/delete/$", views.delete_env_var),
]
