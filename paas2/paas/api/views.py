# -*- coding: utf-8 -*-
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse

from account.decorators import login_exempt
from api.decorators import esb_required
from api.utils import InnerFeedback
from app.models import App


@csrf_exempt
@login_exempt
@esb_required()
def get_app_info(request):
    """
    @api {GET} /paas/api/app_info/ get_app_info
    @apiName get_app_info
    @apiGroup BK_PAAS
    @apiVersion 1.0.0
    @apiDescription 获取应用信息[支持批量获取]
    @apiParam (GET参数) {String} target_app_code 应用ID，多个target_app_code以英文分号分隔，target_app_code为空则表示所有应用
    @apiParamExample {json} 接口参数示例:
        {
            "target_app_code": "test1;test2",
        }
    @apiSuccessExample {json} Success-Response
        HTTP/1.1 200 OK
        {
            "result": true,
            "code": '00',
            "message": "SUCCESS",
            "data": [
                {
                    'app_code': 'test1',
                    'app_name': '测试1',
                },
                {
                    'app_code': 'test2',
                    'app_name': '测试2'
                }
            ]
        }
    """
    feedback = InnerFeedback()

    app_code = request.GET.get("target_app_code")
    # app_state = request.GET.get('app_state')

    all_app = App.objects.filter(is_lapp=False)
    # 过滤查询的app_code
    if app_code:
        app_code_list = app_code.split(";")
        all_app = all_app.filter(code__in=app_code_list)

    # 根据应用状态筛选
    # if app_state == 'develop':
    #     all_app = all_app.filter(state__in=[AppStateEnum.DEVELOPMENT])
    # elif app_state == 'test':
    #     all_app = all_app.filter(state__gt=AppStateEnum.DEVELOPMENT, is_already_test=True)
    # elif app_state == 'online':
    #     all_app = all_app.filter(state__in=[AppStateEnum.TEST, AppStateEnum.ONLINE], is_already_online=True)
    # elif app_state == 'outline':
    #     all_app = all_app.filter(state__in=[AppStateEnum.OUTLINE])

    # 按照创建时间逆排序
    all_app = all_app.values("code", "name").order_by("-created_date")
    app_list = [{"app_code": i["code"], "app_name": i["name"]} for i in all_app]
    feedback["data"] = app_list
    return JsonResponse(feedback)
