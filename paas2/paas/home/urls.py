# -*- coding: utf-8 -*-


from django.conf.urls import url

from home import views


urlpatterns = [
    # 首页
    url(r"^$", views.IndexView.as_view(), name="platform"),
    # 更新user app list
    url(r"^user/app/$", views.UpdateUserAppView.as_view()),
]
