# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS
Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License.
You may obtain a copy of the License at http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
specific language governing permissions and limitations under the License.
"""


import os

import redis
import requests
import urlparse

from django.http import JsonResponse
from django.conf import settings
from django.utils.translation import ugettext as _
from django.http import HttpResponse

from common.exceptions import PaaSErrorCodes
from account.decorators import login_exempt

# ====================  helpers =========================

PAAS_MODULE_CODE = "1301000"


def _gen_json_response(ok, code, message, data):
    """
    ok: True/False
    code:  平台 1300000 / 模块 1301000 / 具体错误  1301005
    message: 报错信息
    data: dict, 内容自定义
    """
    return JsonResponse({"ok": ok, "code:": code, "message": message, "data": data}, status=200)


def _gen_success_json_response(data):
    """
    成功
    """
    return _gen_json_response(ok=True, code=PAAS_MODULE_CODE, message="OK", data=data)


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
    try:
        settings.ESB_TOKEN

        {
            "debug": settings.DEBUG,
            "env": os.getenv("BK_ENV", "unknow"),
            "paas_domain": settings.PAAS_DOMAIN,
            "paas_inner_domain": settings.PAAS_INNER_DOMAIN,
            "cookie_domain": settings.BK_COOKIE_DOMAIN,
            "hosts_es": settings.ELASTICSEARCH_HOSTS,
            "host_redis": settings.ALARM_REDIS_HOST,
            "host_engine": settings.ENGINE_HOST,
            "host_login": settings.LOGIN_HOST,
            "host_cc": settings.HOST_CC,
            "host_job": settings.HOST_JOB,
            "redis": {"host": settings.ALARM_REDIS_HOST, "port": settings.ALARM_REDIS_PORT},
            "mysql": {
                "host": settings.DATABASES.get("default", {}).get("HOST"),
                "port": settings.DATABASES.get("default", {}).get("PORT"),
                "user": settings.DATABASES.get("default", {}).get("USER"),
                "database": settings.DATABASES.get("default", {}).get("NAME"),
            },
        }
    except Exception, e:
        return False, _(u"配置文件不正确, 缺失对应配置: %s") % str(e), PaaSErrorCodes.E1301001_BASE_SETTINGS_ERROR

    return True, "ok", 0


def _check_database():
    try:
        from saas.models import SaaSAppVersion

        objs = SaaSAppVersion.objects.all()[:3]
        [o.version for o in objs]
    except Exception, e:
        return False, _(u"数据库连接存在问题: %s") % str(e), PaaSErrorCodes.E1301002_BASE_DATABASE_ERROR

    return True, "ok", 0


def _remove_password_from_url(url):
    parsed = urlparse.urlparse(url)
    if parsed.username or parsed.password:
        replaced = parsed._replace(netloc="{}:{}@{}".format(parsed.username, "******", parsed.hostname))
        return replaced.geturl()

    return url


def _check_hosts():
    # check hosts
    # 不检查cc/jos, 因为不是强依赖只是用来展示, 用户浏览器能访问通即可, paas所在机器不需要
    engine_host = settings.ENGINE_HOST
    login_host = settings.LOGIN_HOST
    es_host = settings.ELASTICSEARCH_HOSTS[0] if len(settings.ELASTICSEARCH_HOSTS) else ""

    hosts = {"engine_host": engine_host, "login_host": login_host}

    if settings.EDITION == "ee":
        hosts["es_host"] = es_host

    for name, host in hosts.iteritems():
        try:
            if not host.startswith("http"):
                host = "http://%s" % host
            requests.get(host, timeout=10)
        except Exception, e:
            return (
                False,
                _(u"第三方依赖连接超时: name=%s, host=%s,  error=%s") % (name, _remove_password_from_url(host), str(e)),
                PaaSErrorCodes.E1301003_BASE_HTTP_DEPENDENCE_ERROR,
            )

    return True, "ok", 0


def _warning_redis():
    """
    check redis
    """
    data = {}
    try:
        r = redis.Redis(
            host=settings.ALARM_REDIS_HOST,
            port=settings.ALARM_REDIS_PORT,
            password=settings.ALARM_REDIS_PASSWORD or None,
            socket_timeout=10,
        )
        r.ping()
    except Exception, e:
        data["redis"] = _(u"%s Redis连接存在问题: %s; 将导致监控告警不可用") % (PaaSErrorCodes.E1301004_BASE_REDIS_ERROR, str(e))
    else:
        data["reids"] = "ok"
    return data


def _waring_paas_agent():
    data = {}
    try:
        from engine.models import BkServer

        if BkServer.objects.check_test_app_deployable():
            data["paas_agent_test"] = "ok"
        else:
            data["paas_agent_test"] = (
                _(u"WARNING: %s 当前没有可用的[测试服务器], 无法进行提测操作, 请到[蓝鲸智云-开发者中心-服务器信息]注册并激活服务器")
                % PaaSErrorCodes.E1301005_BASE_PAASAGENT_ERROR
            )

        if BkServer.objects.check_prod_app_deployable():
            data["paas_agent_test"] = "ok"
        else:
            data["paas_agent_prod"] = (
                _(u"WARNING: %s 当前没有可用的[正式服务器], 无法进行上线操作, 请到[蓝鲸智云-开发者中心-服务器信息]注册并激活服务器")
                % PaaSErrorCodes.E1301005_BASE_PAASAGENT_ERROR
            )
    except Exception:
        pass

    return data


def _warning_rabbitmq():
    data = {}
    try:
        from engine.models import ThirdServer

        is_exists = ThirdServer.objects.is_service_rabbitmq_active()
        if is_exists:
            data["third_server"] = "ok"
        else:
            data["third_server"] = (
                _(u"WARNING: %s 未注册并激活rabbitmq, 部署应用将无法启用celery及周期任务") % PaaSErrorCodes.E1301006_BASE_RABBITMQ_ERROR
            )
    except Exception:
        pass
    return data


def _warning_database_bksuite():
    data = {}
    try:
        import django.db

        with django.db.connections["bksuite"].cursor() as c:
            c.execute("SELECT 0")
    except django.db.Error as e:
        data["database bksuite"] = _(u"%s Bksuite数据库连接存在问题 %s; 不影响使用, 但[蓝鲸智云 - 开发者中心 - 版本信息]无法正常展示") % (
            PaaSErrorCodes.E1301007_BASE_BKSUITE_DATABASE_ERROR,
            str(e),
        )
    else:
        data["database bksuite"] = "ok"

    return data


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
        ("hosts", _check_hosts),
    ]
    for name, func in _check_funcs:
        is_health, message, code = func()
        if is_health:
            data[name] = "ok"
        else:
            return _gen_fail_json_response(code=code, message=message, data={})

    # 弱依赖, 有损服务
    _warnning_funcs = [_warning_redis, _waring_paas_agent, _warning_rabbitmq, _warning_database_bksuite]
    for func in _warnning_funcs:
        _data = func()
        data.update(_data)

    return _gen_success_json_response(data)


@login_exempt
def ping(request):
    return HttpResponse("pong")
