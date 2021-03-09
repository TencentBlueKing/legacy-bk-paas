# -*- coding: utf-8 -*-
from django.db import transaction
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.utils import timezone
from django.utils.translation import ugettext as _

from account.decorators import login_exempt
from common.log import logger
from app.models import App, AppTags
from app.constants import AppStateEnum
from app.validators import validate_app_name
from api.utils import InnerFeedBackClassV2, get_post_data
from api.decorators import esb_required_v2
from api.constants import ApiErrorCodeEnumV2
from app_maker.validators import validate_app_url, validate_app_permission
from app_maker.utils import generate_app_maker_code, generate_file_by_base64, save_developers


@csrf_exempt
@login_exempt
@require_POST
@esb_required_v2()
def create_app(request):
    feedback = InnerFeedBackClassV2()
    # 获取参数
    request_data = get_post_data(request)
    parent_code = request_data.get("bk_app_code")
    app_name = request_data.get("bk_light_app_name", "")
    app_url = request_data.get("app_url", "")
    creater = request_data.get("creator", "")
    developers = request_data.get("developer", "")
    logo = request_data.get("logo", "")
    width = request_data.get("width")
    height = request_data.get("height")
    app_tag = request_data.get("app_tag")
    introduction = request_data.get("introduction")

    # 参数合法性校验
    is_name_valid, name_msg = validate_app_name(app_name, "")
    if not is_name_valid:
        feedback["message"] = name_msg
        feedback["code"] = ApiErrorCodeEnumV2.PARAM_NOT_VALID
        return JsonResponse(feedback.get_json())

    is_app_url_valid, app_url_msg = validate_app_url(app_url)
    if not is_app_url_valid:
        feedback["message"] = app_url_msg
        feedback["code"] = ApiErrorCodeEnumV2.PARAM_NOT_VALID
        return JsonResponse(feedback.get_json())

    app_tag = AppTags.objects.get_tag_by_code(app_tag)

    # 生成 轻应用 APP_ID
    is_app_maker_code_valid, app_maker_code, app_maker_code_msg = generate_app_maker_code(parent_code)
    if not is_app_maker_code_valid:
        feedback["message"] = app_maker_code_msg
        feedback["code"] = ApiErrorCodeEnumV2.PARAM_NOT_VALID
        return JsonResponse(feedback.get_json())

    parent_app = App.objects.filter(code=parent_code)
    if not parent_app:
        feedback["message"] = _(u"应用 ID 不合法")
        feedback["code"] = ApiErrorCodeEnumV2.PARAM_NOT_VALID
        return JsonResponse(feedback.get_json())
    parent_app = parent_app[0]
    # 保存应用信息到数据库
    try:
        with transaction.atomic():
            app = App.objects.create(
                name=app_name,
                code=app_maker_code,
                creater=creater,
                tags=app_tag,
                is_third=True,
                is_lapp=True,
                external_url=app_url,
                logo=logo,
                state=AppStateEnum.ONLINE,
                is_already_test=True,
                first_test_time=timezone.now(),
                is_already_online=True,
                first_online_time=timezone.now(),
                # 可修改参数 TODO
                width=width or parent_app.width,
                height=height or parent_app.height,
                introduction=introduction or parent_app.introduction,
                # 完全继承
                is_max=parent_app.is_max,
                is_setbar=parent_app.is_setbar,
                is_resize=parent_app.is_resize,
            )
            # 保存开发负责人信息
            is_all_ok, error_msg = save_developers(app, developers)
            if not is_all_ok:
                logger.exception(error_msg)
        feedback["data"] = {"bk_light_app_code": app.code}
    except Exception as e:
        # 创建应用时，保存应用基本信息出错:%s
        logger.exception(u"save app base info fail: %s" % e)
        feedback["message"] = _(u"app maker创建失败,请联系平台开发者")
        feedback["code"] = ApiErrorCodeEnumV2.CREATE_APP_ERROR
    return JsonResponse(feedback.get_json())


@csrf_exempt
@login_exempt
@require_POST
@esb_required_v2()
def edit_app(request):
    feedback = InnerFeedBackClassV2()
    # 获取参数
    request_data = get_post_data(request)
    app_maker_code = request_data.get("bk_light_app_code", "")
    app_name = request_data.get("bk_light_app_name", "")
    app_url = request_data.get("app_url", "")
    developers = request_data.get("developer", "")
    operator = request_data.get("operator")
    width = request_data.get("width")
    height = request_data.get("height")
    app_tag = request_data.get("app_tag")
    introduction = request_data.get("introduction")

    try:
        app = App.objects.get(code=app_maker_code)
    except App.DoesNotExist:
        feedback["code"] = ApiErrorCodeEnumV2.APP_NOT_EXIST
        feedback["message"] = _(u"应用[%s]不存在") % app_maker_code
        return JsonResponse(feedback.get_json())

    if not validate_app_permission(app_maker_code, operator):
        feedback["message"] = _(u"您不是该 app 的开发者，没有操作该 app 的权限")
        feedback["code"] = ApiErrorCodeEnumV2.NO_PERMISSION
        return JsonResponse(feedback.get_json())
    # 保存应用基本信息
    app.width = width if width else app.width
    app.height = height if height else app.height
    app.introduction = introduction if introduction else app.introduction
    # 修改分类
    app_tag = AppTags.objects.get_tag_by_code(app_tag, is_default=False)
    app.tags = app_tag if app_tag else app.tags
    # 修改名称
    if app_name:
        app_name_old = app.name
        is_name_valid, name_msg = validate_app_name(app_name, app_name_old)
        if not is_name_valid:
            feedback["message"] = name_msg
            feedback["code"] = ApiErrorCodeEnumV2.PARAM_NOT_VALID
            return JsonResponse(feedback.get_json())
        app.name = app_name
    # 修改链接
    if app_url:
        is_app_url_valid, app_url_msg = validate_app_url(app_url)
        if not is_app_url_valid:
            feedback["message"] = app_url_msg
            feedback["code"] = ApiErrorCodeEnumV2.PARAM_NOT_VALID
            return JsonResponse(feedback.get_json())
        app.external_url = app_url
    try:
        with transaction.atomic():
            # 保存
            app.save()
            # 修改app开发者
            is_all_ok, error_msg = save_developers(app, developers)
            if not is_all_ok:
                logger.exception(error_msg)
    except Exception as e:
        # 修改应用时，保存应用基本信息出错:%s
        logger.exception(u"save app base info fail: %s" % e)
        feedback["message"] = _(u"app修改出错,请联系平台开发者")
        feedback["code"] = ApiErrorCodeEnumV2.EDIT_APP_ERROR
    feedback["message"] = _(u"app 修改成功")
    return JsonResponse(feedback.get_json())


@csrf_exempt
@login_exempt
@require_POST
@esb_required_v2()
def modify_app_logo(request):
    feedback = InnerFeedBackClassV2()
    # 获取参数
    request_data = get_post_data(request)
    logo = request_data.get("logo", "")
    app_maker_code = request_data.get("bk_light_app_code", "")
    operator = request_data.get("operator", "")
    try:
        app = App.objects.get(code=app_maker_code)
    except App.DoesNotExist:
        feedback["message"] = _(u"应用[%s]不存在") % app_maker_code
        feedback["code"] = ApiErrorCodeEnumV2.APP_NOT_EXIST
        return JsonResponse(feedback.get_json())
    # 判断用户权限
    if not validate_app_permission(app_maker_code, operator):
        feedback["message"] = _(u"您不是该 app 的开发者，没有操作该 app 的权限")
        feedback["code"] = ApiErrorCodeEnumV2.NO_PERMISSION
        return JsonResponse(feedback.get_json())
    # 判断logo是否为空
    if not logo:
        feedback["message"] = _(u"logo 不允许为空")
        feedback["code"] = ApiErrorCodeEnumV2.PARAM_NOT_VALID
        return JsonResponse(feedback.get_json())
    try:
        app.logo = generate_file_by_base64(logo)
        app.save()
    except Exception as e:
        # 保存logo时出错
        logger.exception(u"save app logo fail: %s" % e)
        feedback["message"] = _(u"logo 数据格式不合法")
        feedback["code"] = ApiErrorCodeEnumV2.PARAM_NOT_VALID
        return JsonResponse(feedback.get_json())
    feedback["message"] = _(u"app logo修改成功")
    return JsonResponse(feedback.get_json())


@csrf_exempt
@login_exempt
@require_POST
@esb_required_v2()
def del_app(request):
    feedback = InnerFeedBackClassV2()
    # 获取参数
    request_data = get_post_data(request)
    app_maker_code = request_data.get("bk_light_app_code", "")
    operator = request_data.get("operator")
    try:
        app = App.objects.get(code=app_maker_code)
    except App.DoesNotExist:
        feedback["message"] = _(u"应用[%s]s不存在") % app_maker_code
        feedback["code"] = ApiErrorCodeEnumV2.APP_NOT_EXIST
        return JsonResponse(feedback.get_json())
    # 判断用户权限
    if not validate_app_permission(app_maker_code, operator):
        feedback["message"] = _(u"您不是该 app 的开发者，没有操作该 app 的权限")
        feedback["code"] = ApiErrorCodeEnumV2.NO_PERMISSION
        return JsonResponse(feedback.get_json())
    # 将app状态标记为下架
    app.state = AppStateEnum.OUTLINE
    app.is_already_test = False
    app.is_already_online = False
    app.save()
    feedback["message"] = _(u"app 下架成功")
    return JsonResponse(feedback.get_json())
