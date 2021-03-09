# -*- coding: utf-8 -*-

from django.conf.urls import include, url

from account import views, profile_views

urlpatterns = [
    url(r"^logout/$", views.logout, name="logout"),
    url(r"^profile/$", profile_views.ProfileView.as_view(), name="profile"),
    url(
        r"^user/",
        include(
            [
                url(r"^info/$", profile_views.ModifyUserInfoView.as_view(), name="modify_user_info"),
                # url(r'^password/$', profile_views.PasswordChangeView.as_view(), name='change_password'),
            ]
        ),
    ),
]
