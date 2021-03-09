# -*- coding: utf-8 -*-
"""
Copyright © 2012-2017 Tencent BlueKing. All Rights Reserved. 蓝鲸智云 版权所有
"""
from django.conf import settings
from django.http import HttpResponseRedirect
from django.utils import translation
from django.utils.translation import ugettext as _
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt

from account.decorators import login_exempt
from api.decorators import bk_paas_backend_required
from common.log import logger
from common.mymako import render_json, render_mako_context, render_mako_tostring_context
from common.decorators import has_smart_manage_permission, smart_app_exists
from common.constants import (
    ModeEnum,
    DESKTOP_DEFAULT_APP_WIDTH,
    DESKTOP_DEFAULT_APP_HEIGHT,
    DESKTOP_DEFAULT_APP_IS_MAX,
)
from app.constants import OPENMODE_DICT
from app.utils import get_open_mode_choices, parse_app_visiable_labels
from saas.models import SaaSUploadFile, SaaSApp, SaaSAppVersion
from saas.validators import (
    validate_upload_file,
    validate_upload_page,
    validate_and_extract_tar_file,
    validate_app_config,
)
from saas.utils import (
    update_app_state_in_list,
    upload_response_tpl,
    is_paas_version_too_low,
    save_saas_app_info,
    extract_logo_file,
    get_env_data,
    saas_online_task,
    delete_saas_app,
)
from engine.utils import get_app_prod_deploy_servers, random_choose_servers
from common.utils.file import md5_for_file

####################
#  saas list page  #
####################


@has_smart_manage_permission
def saas_list_page(request):
    """
    SaaS 列表
    """
    return render_mako_context(request, "saas/list.html", {})


@has_smart_manage_permission
def query_app_list(request):
    """
    查询获得上传部署应用的列表
    """
    keyword = request.GET.get("keyword").replace("&nbsp;", "").strip()

    try:
        hide_outline = int(request.GET.get("hide_outline", "0"))
        page = int(request.GET.get("page", 1))
        page_size = int(request.GET.get("page_size", 8))
    except Exception as e:
        # 应用列表页面参数异常:%s
        logger.exception(u"query app list param is invalid:%s" % e)
        return render_json({"data": _(u"请求参数异常"), "total_num": 0, "extend_fun": ""})

    total, app_list = SaaSApp.objects.query_app_list(keyword, hide_outline, page, page_size)

    # 应用状态是否需要刷新
    update_app_state_in_list(app_list)
    data = {
        "total": total,
        "app_list": app_list,
    }
    html_data = render_mako_tostring_context(request, "saas/list_table.part", data)
    return render_json({"data": html_data, "total_num": total, "extend_fun": ""})


####################
#  saas info page  #
####################


@smart_app_exists
@has_smart_manage_permission
def info(request, app_code):
    """
    SaaS 应用基本信息
    """
    saas_app = SaaSApp.objects.get(code=app_code)
    app = saas_app.app
    app_state = saas_app.state

    if app:
        desk_info = app.get_desk_info()
    else:
        current_version = saas_app.current_version
        desk_info = (
            current_version.get_desk_info()
            if current_version
            else {
                "width": DESKTOP_DEFAULT_APP_WIDTH,
                "height": DESKTOP_DEFAULT_APP_HEIGHT,
                "is_max": DESKTOP_DEFAULT_APP_IS_MAX,
            }
        )

    # 获取版本信息
    app_version = saas_app.get_deployable_version()
    version_info = app_version.get_version_info()
    paas_host = "{}://{}".format(settings.HTTP_SCHEMA, settings.PAAS_DOMAIN)

    app_info = {
        "code": saas_app.code or "--",
        "auth_token": app.auth_token if app else "--",
        "name": saas_app.name_display or "--",
        "state": saas_app.saas_state_display,
        "create_time": saas_app.created_date_display,
        "tag": _(app.tags.name) if app and app.tags else "--",
        "introduction": app.introduction_display if app else "",
        "creater": app.creater_display if app else "--",
        "language": app.language if app else "--",
        "open_mode": app.open_mode if app else "",
        "open_mode_name": (_(OPENMODE_DICT.get(app.open_mode)) or "") if app else "",
        "desk_info": desk_info,
        "version_info": version_info,
        "visiable_labels": parse_app_visiable_labels(app.visiable_labels) if app else "[]",
        "paas_host": paas_host,
    }
    app_version_settings = app_version.get_settings()
    if not app_info["introduction"]:
        app_info["introduction"] = app_version_settings.get("introduction", "--")

    # use the trans
    if translation.get_language() == "en":
        introduction_en = app.introduction_en_display if app else ""
        if not introduction_en:
            introduction_en = app_version_settings.get("introduction_en", "--")

        name_en = app.name_en if app else ""
        if not name_en:
            name_en = app_version_settings.get("name_en", "--")

        app_info["introduction"] = introduction_en
        app_info["name"] = name_en

    return render_mako_context(
        request,
        "saas/info.html",
        {
            "app_info": app_info,
            "app_code": app_code,
            "app_state": app_state,
            "open_mode_choices": get_open_mode_choices(),
        },
    )


############
#  upload  #
############


@has_smart_manage_permission
def upload_page(request, app_code):
    """
    上传版本页面
    """
    app_state_display = _(u"未知")

    base_tpl = "/base_center.html"

    saas_app = None
    online_version = _(u"未部署")
    test_version = _(u"未部署")

    if app_code != "0":
        base_tpl = "/base_saas.html"
        saas_app = SaaSApp.objects.get(code=app_code)
        app_state_display = saas_app.saas_state_display

        if saas_app.online_version:
            online_version = saas_app.online_version.version

            status = _(u"已发布") if saas_app.is_already_deployed(ModeEnum.PROD) else _(u"未部署")

            online_version = u"%s (%s)" % (online_version, status)

        if saas_app.test_version:
            test_version = saas_app.test_version.version

            status = _(u"已发布") if saas_app.is_already_deployed(ModeEnum.TEST) else _(u"未部署")
            test_version = u"%s (%s)" % (test_version, status)

    version_list = SaaSAppVersion.objects.get_version_list(saas_app)
    data = {
        "base_tpl": base_tpl,
        "app_code": app_code,
        "app_state_display": app_state_display,
        "online_version": online_version,
        "test_version": test_version,
        "version_list": version_list,
    }
    return render_mako_context(request, "saas/release/upload.html", data)


@has_smart_manage_permission
def version_list(request, app_code):
    """
    上传版本页面
    """
    saas_app = None
    if app_code != "0":
        saas_app = SaaSApp.objects.get(code=app_code)
    version_list = SaaSAppVersion.objects.get_version_list(saas_app)
    return render_mako_context(request, "saas/release/version_list.part", {"version_list": version_list})


@has_smart_manage_permission
def do_upload(request, app_code):
    return _do_upload(request, app_code)


@require_POST
@csrf_exempt
@login_exempt
@bk_paas_backend_required
def do_upload_from_backend(request, app_code):
    return _do_upload(request, app_code)


def _do_upload(request, app_code):
    """
    执行上传, 一整个事务操作

    注意安全性处理

    Note:
    1. app_code = 0, 则上传的新应用
    2. app_code != 0, 则上传老的应用, 需要校验app_code同包里的 app_code 是否一致
    """
    # 1. get the file
    saas_file = request.FILES.get("saas_file")

    # validate file: type and format
    is_valid, message = validate_upload_file(saas_file)
    if not is_valid:
        return upload_response_tpl(False, message)

    md5 = md5_for_file(saas_file.chunks())
    # 2. save to SaaSUploadFile
    saas_upload_file = SaaSUploadFile.objects.save_upload_file(
        name=saas_file.name, size=saas_file.size, md5=md5, file=saas_file
    )

    # 校验大小等参数
    is_valid, message, app_config = validate_and_extract_tar_file(
        filename=saas_upload_file.name, path=saas_upload_file.file.path
    )
    if not is_valid:
        logger.info(message)
        return upload_response_tpl(False, message)

    # basic settings check
    saas_app_code = app_config.get("app_code")

    is_valid, message = validate_upload_page(app_code, saas_app_code)
    if not is_valid:
        logger.info(message)
        return upload_response_tpl(False, message)

    is_valid, message = validate_app_config(saas_file.name, app_code, app_config)
    if not is_valid:
        return upload_response_tpl(False, message)

    app_name = app_config.get("app_name")
    platform_version = app_config.get("platform_version")
    is_lower, message = is_paas_version_too_low(app_name, platform_version)
    if is_lower:
        return upload_response_tpl(False, message)

    try:
        saas_app_version = save_saas_app_info(app_config, saas_upload_file)
    except Exception:
        # 保存SaaS包信息失败
        message = u"save saas file info fail"
        logger.exception(message)

        message = _(u"保存SaaS包信息失败")
        return upload_response_tpl(False, message)

    # 解压包文件中的logo到 media/logo/ 目录下
    extract_logo_file(filename=saas_upload_file.name, path=saas_upload_file.file.path, saas_app_code=saas_app_code)

    data = {"app_code": saas_app_version.saas_app.code}
    return upload_response_tpl(True, _(u"上传成功"), data)


#############
#  release  #
#############


@smart_app_exists
@has_smart_manage_permission
def online_page(request, app_code):
    """
    部署页面
    """
    tab = request.GET.get("tab", "0")
    data = {
        "app_code": app_code,
        "tab": tab,
    }
    return render_mako_context(request, "saas/release/online.html", data)


@smart_app_exists
@has_smart_manage_permission
def online_env(request, app_code):
    """
    部署子页面 - 区分正式/测试
    """
    mode = request.GET.get("mode", ModeEnum.TEST)
    data = get_env_data(app_code, mode)

    if mode == ModeEnum.PROD:
        hostships, servers = get_app_prod_deploy_servers(app_code)
        if not hostships and servers:
            hostships = random_choose_servers(servers)

        data.update({"servers": servers, "hostships": hostships})

    return render_mako_context(request, "saas/release/online_env.part", data)


@smart_app_exists
@has_smart_manage_permission
def offline_page(request, app_code):
    """
    下架页面
    """
    tab = request.GET.get("tab", "0")
    data = {
        "app_code": app_code,
        "tab": tab,
    }
    return render_mako_context(request, "saas/release/offline.html", data)


@smart_app_exists
@has_smart_manage_permission
def offline_env(request, app_code):
    """
    下架子页面 - 区分正式/测试
    """
    mode = request.GET.get("mode", ModeEnum.TEST)
    data = get_env_data(app_code, mode)
    return render_mako_context(request, "saas/release/offline_env.part", data)


@has_smart_manage_permission
def do_online(request, saas_app_version_id):
    """
    执行部署
    """
    return _do_online(request, saas_app_version_id)


@require_POST
@csrf_exempt
@login_exempt
@bk_paas_backend_required
def do_online_from_backend(request, saas_app_version_id):
    return _do_online(request, saas_app_version_id)


def _do_online(request, saas_app_version_id):
    username = request.user.username
    mode = request.POST.get("mode")

    servers = request.POST.get("servers", "").split(",")

    result = saas_online_task(saas_app_version_id, username, mode, servers=servers)
    return render_json(result)


############
#  delete  #
############


@smart_app_exists
@has_smart_manage_permission
def do_delete(request, app_code):
    """
    删除某个 saas 及其所有版本
    """
    username = request.user.username
    res, msg = delete_saas_app(app_code, username)
    return render_json({"result": res, "msg": msg})


############
#  record  #
############


@smart_app_exists
@has_smart_manage_permission
def record_page(request, app_code):
    """
    应用发布记录
    """
    saas_app = SaaSApp.objects.get(code=app_code)
    app_state = saas_app.state
    return render_mako_context(request, "saas/release/record.html", {"app_code": app_code, "app_state": app_state})


############
#  others  #
############


@smart_app_exists
@has_smart_manage_permission
def modify_app_logo(request, app_code):
    """
    修改应用图标
    """
    app = SaaSApp.objects.get(code=app_code)
    logo = request.FILES.get("logo_m", "")
    if not logo:
        error = _(u"更换logo失败, logo必须为png格式")
        return HttpResponseRedirect("%ssaas/list/?error=%s" % (settings.SITE_URL, error))
    try:
        # 校验log是否为png格式
        log_type = logo.content_type
        if log_type == "image/png":
            app.logo = logo
            app.save()
    except Exception:
        # 应用logo[%s]更换失败
        logger.exception(u"change app logo fail [%s]" % app_code)

    return HttpResponseRedirect("%ssaas/list/" % (settings.SITE_URL))
