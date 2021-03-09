# -*- coding: utf-8 -*-
from django.conf.urls import url

from . import views, api_views


urlpatterns = [
    url(r"^$", views.Index.as_view(), name="esb_api_docs"),
    url(r"^system/$", views.Index.as_view(), name="esb_api_docs"),
    url(r"^system/(?P<system_name>\w+)/$", views.ApiInfoBySystem.as_view(), name="api_info_by_system"),
    url(
        r"^system/(?P<system_name>\w+)/(?P<api_name>\w+)/$",
        views.ApiDocByApiName.as_view(),
        name="api_doc_by_api_name",
    ),
    url(r"^api/all_api/$", api_views.AllApi.as_view(), name="api.all_api"),
    url(r"^api/(?P<system_name>\w+)/apis/$", api_views.GetApisBySystem.as_view(), name="api.get_apis_by_system"),
    url(
        r"^api/(?P<system_name>\w+)/(?P<api_id>\w+)/docs/$",
        api_views.GetApiDocByApiId.as_view(),
        name="api.get_api_doc_by_api",
    ),
    url(r"^api/submit_the_advice/$", api_views.SubmitTheAdvice.as_view(), name="api.submit_the_advice"),
    url(r"^api/check_component_exist/$", api_views.CheckComponentExist.as_view(), name="api.check_component_exist"),
    url(r"^api/system_doc_category/$", api_views.GetSystemDocCategory.as_view(), name="api.get_system_doc_category"),
    url(r"^translate/test/$", views.TranslateTest.as_view(), name="translate_test"),
]
