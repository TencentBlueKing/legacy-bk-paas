# -*- coding: utf-8 -*-

import os

from django.http import JsonResponse
from django.http import HttpResponse
from django.conf import settings
from django.utils.translation import ugettext as _

from common.license import check_license
from common.exceptions import LoginErrorCodes
from bkauth.decorators import login_exempt


# ====================  helpers =========================

LOGIN_MODULE_CODE = "1302000"


def _gen_json_response(ok, code, message, data):
    """
    ok: True/False
    code:  平台 1302000 / 模块 1302100 / 具体错误  1302105
    message: 报错信息
    data: dict, 内容自定义
    """
    return JsonResponse({"ok": ok, "code:": code, "message": message, "data": data}, status=200)


def _gen_success_json_response(data):
    """
    成功
    """
    return _gen_json_response(ok=True, code=LOGIN_MODULE_CODE, message="OK", data=data)


def _gen_fail_json_response(code, message, data):
    """
    失败
    """
    return _gen_json_response(ok=False, code=code, message=message, data=data)


# ====================  check =========================


def _check_settings():
    """
    check settings, 注意不暴露密码等敏感信息
    """
    # check settings, 注意不暴露密码等敏感信息
    try:
        settings.ESB_TOKEN
        {
            "debug": settings.DEBUG,
            "env": os.getenv("BK_ENV", "unknow"),
            "cookie_domain": settings.BK_COOKIE_DOMAIN,
            "mysql": {
                "host": settings.DATABASES.get("default", {}).get("HOST"),
                "port": settings.DATABASES.get("default", {}).get("PORT"),
                "user": settings.DATABASES.get("default", {}).get("USER"),
                "database": settings.DATABASES.get("default", {}).get("NAME"),
            },
        }
    except Exception, e:
        return False, _(u"配置文件不正确, 缺失对应配置: %s") % str(e), LoginErrorCodes.E1302001_BASE_SETTINGS_ERROR

    return True, "ok", 0


def _check_database():
    try:
        from bkaccount.models import BkToken

        objs = BkToken.objects.all()[:3]
        [o.token for o in objs]
    except Exception, e:
        return False, _(u"数据库连接存在问题: %s") % str(e), LoginErrorCodes.E1302002_BASE_DATABASE_ERROR

    return True, "ok", 0


def _check_license():
    # check license
    is_license_ok, message, valid_start_time, valid_end_time = check_license()
    if not is_license_ok:
        return False, _(u"企业证书无效：%s; 只影响桌面版本信息的展示") % message, LoginErrorCodes.E1302005_BASE_LICENSE_ERROR

    return True, "ok", 0


@login_exempt
def healthz(request):
    """
    health check
    """
    data = {}

    # 强依赖
    _check_funcs = [
        ("settings", _check_settings),
        ("database", _check_database),
        # ("license", _check_license),
    ]

    if settings.EDITION == "ee":
        _check_funcs.append(("license", _check_license))

    for name, func in _check_funcs:
        is_health, message, code = func()
        if is_health:
            data[name] = "ok"
        else:
            return _gen_fail_json_response(code=code, message=message, data={})

    return _gen_success_json_response(data)


@login_exempt
def ping(request):
    return HttpResponse("pong", content_type="text/plain")
