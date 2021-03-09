# -*- coding: utf-8 -*-

from common.bk_iam import Permission
from common.mymako import render_mako_context
from django.conf import settings

# from common.log import logger


def redirect_403(request, username, action_id, app_code=None):
    """
    no resources
    {
        "system_id": "bk_paas",
        "actions": [
            {
                "id": "access_developer_center",
                "related_resource_types": []
            }
        ]
    }

    with resource
    {
        "system_id": "bk_paas",
        "actions": [
            {
            "id": "develop_app",
            "related_resource_types": [
                {
                "system_id": "bk_paas",
                "type": "job",
                "resources": [
                    [
                    {
                        "type": "app",
                        "id": "framework",
                        "name": "开发框架"
                    }
                    ]
                ]
                }
            ]
            }
        ]
    }
    """
    tpl = "error/403.html"
    # TODO: 测试ajax请求返回是否正确
    if request.is_ajax():
        tpl = "error/403_dialog.html"

    data = {}

    permission = Permission()
    if app_code:
        application = permission.make_app_application(app_code)
    else:
        application = permission.make_no_app_application(action_id)

    # 1. call iam api to get url
    bk_token = request.COOKIES.get(settings.BK_COOKIE_NAME, None)
    url = permission.generate_apply_url(bk_token, application)

    # 2. set url into data
    data["application"] = application.to_dict()
    data["apply_url"] = url

    return render_mako_context(request, tpl, data)


def redirect_app_not_exists(request, app_code):

    tpl = "error/not_exists.html"

    # saas / app 使用相同的log等, smart未部署时, 请求日志查询会报错
    if request.GET.get("is_saas") == "1":
        tpl = "error/saas_not_deployed.html"

    # TODO: 测试ajax请求返回是否正确
    if request.is_ajax():
        tpl = "error/not_exists_dialog.html"

    return render_mako_context(request, tpl, {"app_code": app_code})

    # ajax?
    # url = '%sapp/error/%s/%s/' % (settings.SITE_URL, error_id, app_code)
    # url = '%s/' % (settings.SITE_URL, error_id, app_code)
    # return HttpResponse(status=402, content=url)
