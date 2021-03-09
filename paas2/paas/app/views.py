# -*- coding: utf-8 -*-
"""
Copyright © 2012-2017 Tencent BlueKing. All Rights Reserved. 蓝鲸智云 版权所有
"""
from django.conf import settings
from django.http import HttpResponseRedirect
from django.utils.translation import ugettext as _
from django.db import transaction

from common.utils.basic import html_escape
from common.decorators import app_exists, has_app_develop_permission, escape_exempt_param
from common.mymako import render_mako_context, render_json, render_mako_tostring_context
from common.log import logger
from common.exceptions import PaaSErrorCodes
from common.constants import DESKTOP_DEFAULT_APP_WIDTH, DESKTOP_DEFAULT_APP_HEIGHT
from common.bk_iam import Permission

from app.models import App, SecureInfo, AppTags
from app.initializer import AppInitializer, AppInitializeCodeError
from app.utils import (
    update_all_app_state,
    modify_app_base_info,
    modify_app_desktop_info,
    modify_app_introduction,
    modify_app_vcs_info,
    modify_app_db_info,
    modify_app_visiable_labels,
    parse_app_visiable_labels,
)

from app.validators import validate_app_code, validate_app_name, validate_vcs_url, validate_app_tags
from app.constants import (
    DB_TYPE_CHOICES,
    VCS_TYPE_CHOICES,
    AppOpenEnum,
    AppStateEnum,
    LANGUAGE_VALID_VALUES,
    OPENMODE_CHOICES,
    OPENMODE_DICT,
)
from engine.models import BkServer
from audit.utils import record_audit_log
from audit.constants import AuditEventOperationTypeEnum, AuditSystemEnum, AuditOPObjectTypeEnum
from bk_iam.utils import apply_app_creator_permission


def check_app_code(request):
    """
    检查新的app_code是否已经存在
    """
    app_code = request.GET.get("app_code", "")
    is_valid, message = validate_app_code(app_code)
    return render_json({"result": is_valid, "message": _(message)})


def check_app_name(request):
    """
    检查app名称
    """
    name = request.GET.get("name", "")
    old_name = request.GET.get("old_name", "")
    is_valid, message = validate_app_name(name, old_name)
    return render_json({"result": is_valid, "message": message})


@escape_exempt_param(param_list=["vcs_username", "vcs_password"])
def create_app(request):
    """
    创建应用.
    Get请求到创建页面，post页面则保存应用信息后到基本信息页面
    """
    if request.method == "GET":
        tags = AppTags.objects.get_all_tags()
        error = request.GET.get("error", "")
        context = dict(error=error, db_type_choices=DB_TYPE_CHOICES, vcs_type_choices=VCS_TYPE_CHOICES, tags=tags)
        return render_mako_context(request, "app/create.html", context)
    else:
        return _save_app(request)


def _save_app(request):  # noqa
    """
    新建应用
    """
    creater = request.user.username
    # 获取参数
    code = request.POST.get("code", "").replace("&nbsp;", " ").strip()
    name = request.POST.get("name", "").replace("&nbsp;", " ").strip()
    introduction = request.POST.get("introduction", "").replace("&nbsp;", " ").strip()
    app_tags = request.POST.get("app_tags")
    language = request.POST.get("language", "python")

    is_init_app = int(request.POST.get("is_init_app") or 0)
    vcs_type = request.POST.get("vcs_type")
    vcs_url = request.POST.get("vcs_url", "").replace("&nbsp;", " ").strip()
    vcs_username = request.POST.get("vcs_username", "").replace("&nbsp;", " ").strip()
    vcs_password = request.POST.get("vcs_password", "").replace("&nbsp;", " ").strip()

    # validate
    error_url = u"%sapp/create/?error={error}" % settings.SITE_URL
    is_code_valid, code_msg = validate_app_code(code)
    if not is_code_valid:
        return HttpResponseRedirect(error_url.format(error=code_msg))

    is_name_valud, name_msg = validate_app_name(name, "")
    if not is_name_valud:
        return HttpResponseRedirect(error_url.format(error=name_msg))

    is_vcs_valid, vcs_msg = validate_vcs_url(vcs_type, vcs_url)
    if not is_vcs_valid:
        return HttpResponseRedirect(error_url.format(error=vcs_msg))

    is_tags_valid, tags_msg, app_tags = validate_app_tags(app_tags)
    if not is_tags_valid:
        return HttpResponseRedirect(error_url.format(error=tags_msg))

    # 非规定语言，则默认为python
    language = "python" if language not in LANGUAGE_VALID_VALUES else language

    # 注册应用信息
    from engine.api import register_app

    is_success, register_result = register_app(code, name, language)
    token = register_result.get("token", "") if register_result else ""
    if not is_success or not token:
        msg_fmt = _(u"%s 应用[%s]注册失败, 失败信息:%s. 可能原因:App Engine 未正常启动")
        error_msg = msg_fmt % (PaaSErrorCodes.E1301008_BASE_APPENGINE_ERROR, code, register_result)
        logger.error(error_msg)
        return HttpResponseRedirect(error_url.format(error=error_msg))

    # 保存应用信息到数据库
    try:
        with transaction.atomic():
            app = App.objects.create(
                name=name,
                code=code,
                introduction=introduction,
                creater=creater,
                language=language,
                auth_token=token,
                tags=app_tags,
            )

            # 普通应用保存源码等需要跟App Engine交互的信息
            secure_info = SecureInfo.objects.create(
                app_code=code,
                vcs_type=vcs_type,
                vcs_url=vcs_url,
                vcs_username=vcs_username,
                vcs_password=vcs_password,
            )
            if is_init_app:
                app_initializer = AppInitializer(app, secure_info)
                # 将应用代码初始化，并生成可下载文件
                is_success, init_msg = app_initializer.initialize_with_template()
                # 不成功，则回滚DB
                if not is_success:
                    raise AppInitializeCodeError(init_msg)

        record_audit_log(
            system=AuditSystemEnum.PAAS,
            username=creater,
            op_type=AuditEventOperationTypeEnum.CREATE,
            op_object_type=AuditOPObjectTypeEnum.APP,
            op_object_id=code,
            op_object_name=name,
        )

        # NOTE: apply for iam authorization
        apply_app_creator_permission(app_code=code, app_name=name, username=creater)

    except AppInitializeCodeError as e:
        # 创建应用时，初始化应用代码出错:%s
        logger.exception(u"create application, init app code fail:%s" % e)
        err = _(u"初始化应用代码出错，请联系平台管理查询日志排查")
        return HttpResponseRedirect(error_url.format(error=err))
    except Exception as e:
        # 创建应用时，保存应用基本信息出错:%s
        logger.exception(u"create application, save app base info fail: %s" % e)
        err = _(u"保存应用基本信息出错")
        return HttpResponseRedirect(error_url.format(error=err))
    return HttpResponseRedirect("%sapp/info/%s/" % (settings.SITE_URL, code))


@app_exists
@has_app_develop_permission
@escape_exempt_param(param_list=["vcs_username", "vcs_password"])
def modify_app(request, app_code):
    """
    编辑应用基本信息
    """
    operate = request.POST.get("operate", "")
    if not operate:
        return render_json({"result": False, "msg": _(u"参数异常")})

    # 保存基本信息
    if operate == "base":
        is_success, message = modify_app_base_info(app_code, request)
    elif operate == "desktop":
        is_success, message = modify_app_desktop_info(app_code, request)
    elif operate == "introduction":
        is_success, message = modify_app_introduction(app_code, request)
    elif operate == "vcs":
        is_success, message = modify_app_vcs_info(app_code, request)
    elif operate == "db":
        is_success, message = modify_app_db_info(app_code, request)
    elif operate == "visiable_labels":
        is_success, message = modify_app_visiable_labels(app_code, request)

    if is_success:
        return render_json({"result": True, "msg": _(u"编辑成功")})
    else:
        return render_json({"result": False, "msg": message})


@app_exists
@has_app_develop_permission
def modify_app_logo(request, app_code):
    """
    修改应用图标
    """
    app = App.objects.get(code=app_code)

    url_prefix = "app"
    if app.is_saas:
        url_prefix = "saas"
    if app.is_third:
        url_prefix = "tpapp"

    logo = request.FILES.get("logo_m", "")
    if not logo:
        error = _(u"更换logo失败, logo必须为png格式")
        return HttpResponseRedirect("%s%s/list/?error=%s" % (settings.SITE_URL, url_prefix, error))
    try:
        # 校验log是否为png格式
        log_type = logo.content_type
        if log_type == "image/png":
            app.logo = logo
            app.save()
    except Exception:
        # 应用logo[%s]更换失败
        logger.exception(u"change [%s]'s logo fail" % app_code)

    return HttpResponseRedirect("%s%s/list/" % (settings.SITE_URL, url_prefix))


def app_list(request):
    """
    应用列表页
    """
    return render_mako_context(request, "app/list.html", {})


def query_app_list(request):
    """
    查询获得app列表
    """
    username = request.user.username
    keyword = request.GET.get("keyword").replace("&nbsp;", "").strip()

    try:
        hide_outline = int(request.GET.get("hide_outline", "0"))
        page = int(request.GET.get("page", 1))
        page_size = int(request.GET.get("page_size", 8))
    except Exception as e:
        # 应用列表页面参数异常:%s
        logger.exception(u"query app list param invalid: %s" % e)
        return render_json({"data": _(u"请求参数异常"), "total_num": 0, "extend_fun": ""})

    # get app_list from iam
    user_app_list = Permission().app_list(username)

    total, app_list = App.objects.query_app_list(
        user_app_list=user_app_list,
        keyword=keyword,
        hide_outline=hide_outline,
        is_saas=False,
        is_lapp=False,
        is_third=False,
        page=page,
        page_size=page_size,
    )
    has_app = total > 0
    has_conditions = request.GET.get("keyword") is not None

    # 判断应用状态是否需要刷新
    update_all_app_state(app_list)

    result = {
        "total": total,
        # 'app_list': refresh_app_list,
        "app_list": app_list,
        # 'has_app': has_app,
    }
    template_name = "app/list_table.part" if (has_app or has_conditions) else "app/list_tip.part"
    html_data = render_mako_tostring_context(request, template_name, result)
    return render_json({"data": html_data, "total_num": total, "extend_fun": ""})


@app_exists
@has_app_develop_permission
def info(request, app_code):
    """
    应用基本信息
    """
    app_info = {}
    error = ""
    try:
        app = App.objects.get(code=app_code)
    except Exception:
        error = _(u"应用[ID:%s]不存在") % app_code
        return render_mako_context(request, "app/info_error.html", {"error": error, "app_code": app_code})

    try:
        app_secure_info = SecureInfo.objects.get(app_code=app_code)
    except Exception:
        # 应用[ID:%s]的源码信息不存在
        logger.info(u"App [ID:%s] has no source info" % app_code)
        app_secure_info = None

    # 获取应用分类列表
    tags = AppTags.objects.get_all_tags()

    # 获取开发者信息
    # get app_developers from iam
    # app_developers = Permission().app_developers(app_code)
    # developers = subjects_display(app_developers)
    developers = "--"
    paas_host = "{}://{}".format(settings.HTTP_SCHEMA, settings.PAAS_DOMAIN)

    # 解析APP信息
    vcs_type = app_secure_info.vcs_type if app_secure_info else ""

    app_name = app.name_display

    app_info = {
        "code": app.code,
        "auth_token": app.auth_token,
        "creater": app.creater or "",
        "name": app_name,
        "state": app.state,
        "tags": _(app.tags.name) if app.tags else "",
        "tags_code": app.tags.code if app.tags else "",
        "app_test_url": app.app_test_url,
        "app_prod_url": app.app_prod_url,
        "first_test_time": app.first_test_time_display or "",
        "first_online_time": app.first_online_time_display or "",
        "introduction": app.introduction_display or "",
        "language": app.language or "",
        "vcs_type": vcs_type,
        "vcs_type_name": dict(VCS_TYPE_CHOICES).get(vcs_type, ""),
        "vcs_url": app_secure_info.vcs_url if app_secure_info else "",
        "vcs_username": html_escape(app_secure_info.vcs_username) if app_secure_info else "",
        "vcs_password": "******",
        "developers": developers,
        "width": app.width or DESKTOP_DEFAULT_APP_WIDTH,
        "height": app.height or DESKTOP_DEFAULT_APP_HEIGHT,
        "is_max": 1 if app.is_max else 0,
        "open_mode": app.open_mode,
        "open_mode_name": _(OPENMODE_DICT.get(app.open_mode)) or "",
        "project_tmp_download_url": app.project_tmp_download_url,
        "visiable_labels": parse_app_visiable_labels(app.visiable_labels),
        "paas_host": paas_host,
    }
    # 有错误信息则直接跳转到错误页面
    if error or not app_info:
        return render_mako_context(request, "app/info_error.html", {"error": error, "app_code": app_code})

    context = {
        "app_info": app_info,
        "app_code": app_code,
        "tags": tags,
        "open_mode_choices": OPENMODE_CHOICES,
    }
    return render_mako_context(request, "app/info.html", context)


def app_status(request, app_code):
    """
    应用状态

    res值:
    1    正式环境，测试环境都打开
    2    只有测试环境
    3    只有正式环境
    4    正式环境，测试环境都关闭
    """
    try:
        app = App.objects.get(code=app_code)
    except Exception:
        # app status 应用[id:%s]不存在
        logger.exception(u"app [id:%s] not exist" % app_code)
        context = {"result": 0, "app_test_url": "###", "app_prod_url": "###", "app_name": ""}
        return render_json(context)

    # 判断应用在那些环境下可以打开
    is_test = app.state not in [AppStateEnum.DEVELOPMENT] and app.is_already_test
    is_pro = app.state not in [AppStateEnum.OUTLINE, AppStateEnum.DEVELOPMENT] and app.is_already_online
    if is_pro and is_test:
        res = AppOpenEnum.OPEN_IN_ALL
    elif is_pro:
        res = AppOpenEnum.OPEN_IN_PRO
    elif is_test:
        res = AppOpenEnum.OPEN_IN_TEST
    else:
        res = AppOpenEnum.OPEN_NONE

    app_name = app.name_display

    context = {
        "result": res,
        "app_test_url": app.app_test_url,
        "app_prod_url": app.app_prod_url,
        "app_name": app_name,
        "app_logo_url": app.logo_url,
    }
    return render_json(context)


@app_exists
@has_app_develop_permission
def get_vcs_password(request, app_code):
    """
    获取代码仓库密码
    """
    try:
        app_secure_info = SecureInfo.objects.get(app_code=app_code)
    except Exception:
        res = False
        msg = _(u"应用[ID:%s]的源码信息不存在") % app_code
    else:
        res = True
        msg = app_secure_info.vcs_password
    return render_json({"res": res, "msg": msg})


# def error(request, error_id, app_code):
#     """
#     错误提示信息
#     """
#     template_name = 'error/app_error_dialog%s.html' % error_id
#     return render_mako_context(request, template_name, {'app_code': app_code})


def get_apptags(request):
    """
    获取app 分类列表
    """
    alltags = AppTags.objects.all()
    tags_name = tags_code = []
    for tag in alltags:
        tags_name.append(tag.name)
        tags_code.append(tag.code)
    return render_json({"tags_name": tags_name, "tags_code": tags_code})


def show_apply_process(request):
    """
    激活码申请流程
    """
    app_code = request.GET.get("app_code", "")
    is_base_info = request.GET.get("is_base_info")
    # 查询所有激活服务器的mac地址
    active_servers = BkServer.objects.filter(is_active=True)
    active_server_ips = active_servers.values_list("ip_address", flat=True)
    active_server_ips = ";".join(set(active_server_ips))
    # 所有已经激活的服务器都检测到mac地址才默认显示，否则用开发者自动获取
    active_servers_count = active_servers.count()
    mac_list = active_servers.values_list("mac", flat=True)
    if len(mac_list) == active_servers_count:
        mac_info = ";".join(mac_list)
    else:
        mac_info = ""
    context = {
        "is_base_info": is_base_info,
        "app_code": app_code,
        "mac_info": mac_info,
        "active_server_ips": active_server_ips,
    }
    return render_mako_context(request, "app/show_apply_process.html", context)
