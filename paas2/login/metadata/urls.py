# -*- coding: utf-8 -*-

from django.conf.urls import url

from metadata import views

urlpatterns = [url("^website/$", views.website_metadata)]
