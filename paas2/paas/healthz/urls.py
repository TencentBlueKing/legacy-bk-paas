# -*- coding: utf-8 -*-

from django.conf.urls import url

from healthz import views

urlpatterns = [url("^$", views.healthz)]
