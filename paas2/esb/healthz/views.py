# -*- coding: utf-8 -*-
import os

from django.conf import settings
from django.http import HttpResponse, JsonResponse

from .errors import CheckException
from .utils import failed_resp, ok_resp


def healthz(request):
    """
    health check
    """
    try:
        check_settings()
        check_db()
        check_redis()
        check_third_api()
    except CheckException as e:
        return JsonResponse(failed_resp(message=e.get_message()))
    except Exception as e:
        return JsonResponse(failed_resp(message="Exceptions appeared in ESB service check: %s" % e))
    return JsonResponse(ok_resp(message="OK"))


def ping(request):
    return HttpResponse("pong")


def check_settings():
    """检查 settings 配置"""
    # 不能为空
    no_empty_settings_key = [
        "ESB_TOKEN",
        "SSL_ROOT_DIR",
        "PAAS_HOST",
        "HOST_BK_LOGIN",
        "HOST_CC_V3",
        "HOST_JOB",
        "REDIS_HOST",
        "REDIS_PORT",
        "REDIS_PASSWORD",
    ]
    for key in no_empty_settings_key:
        if not getattr(settings, key, ""):
            raise CheckException("In settings configuration, %s cannot be empty" % key)

    # SSL 文件检查
    if not os.path.exists(settings.SSL_ROOT_DIR):
        raise CheckException(
            "The folder %s specified by SSL_ROOT_DIR in the settings configuration does not exist"
            % settings.SSL_ROOT_DIR
        )
    ssl_files_config = {
        "JOB": ["job_esb_api_client.crt", "job_esb_api_client.key"],
        "GSE": ["gseca.crt", "gse_esb_api_client.crt", "gse_esb_api_client.key"],
    }
    for system_name, ssl_files in ssl_files_config.iteritems():
        for file_name in ssl_files:
            path = os.path.join(settings.SSL_ROOT_DIR, file_name)
            if not os.path.exists(path):
                raise CheckException(
                    "The ssl file %s used by component system %s does not exist" % (path, system_name)
                )


def check_db():
    """检查 DB"""
    try:
        from esb.bkcore.models import ComponentSystem

        systems = ComponentSystem.objects.all()
        system_names = [system.name for system in systems]
    except Exception as ex:
        raise CheckException("Exceptions occurred in database connection: %s" % ex)

    if not system_names:
        raise CheckException(
            "Component system and channel data have not been initialized, "
            'please execute "python manage.py sync_system_and_channel_data" to initialize'
        )


def check_redis():
    try:
        import redis
        from common.base_redis import get_redis_pool, redis_config, redis_sentinel_config

        client = redis.Redis(connection_pool=get_redis_pool(redis_config, redis_sentinel_config))

        client.ping()

        key = "esb_redis_check"
        client.set(key, "esb")
        client.expire(key, 60)
        client.get(key)
    except Exception as ex:
        raise CheckException(
            "Exceptions occurred in Redis connection ([%s:%s] [use_sentinel=%s]): %s"
            % (settings.REDIS_HOST, settings.REDIS_PORT, getattr(settings, "USE_SENTINEL", False), ex)
        )


def check_third_api():
    """检查第三方系统API"""
    check_bk_login_api()
    check_cc_api()
    check_job_api()
    check_gse_api()


def check_bk_login_api():
    try:
        from components.bk.apis.bk_login.get_all_user import GetAllUser

        result = GetAllUser().invoke({"role": 1})
        if not result["result"]:
            raise Exception(result["message"])
    except Exception as ex:
        raise CheckException("System BK_LOGIN interface access abnormal: %s" % ex)


def check_cc_api():
    try:
        from components.bk.apisv2.cc.search_business import SearchBusiness
        from esb.bkauth.models import BKUser

        result = SearchBusiness(current_user=BKUser("admin")).invoke()
        if not result["result"]:
            raise Exception(result["message"])
    except Exception as ex:
        raise CheckException("System CC interface access abnormal: %s" % ex)


def check_job_api():
    try:
        from components.bk.apis.job.get_task import GetTask
        from esb.bkauth.models import BKUser

        GetTask(current_user=BKUser("admin")).invoke(kwargs={"app_id": 1})
    except Exception as ex:
        raise CheckException("System JOB interface access abnormal: %s" % ex)


def check_gse_api():
    try:
        from components.bk.apisv2.gse.get_agent_status import GetAgentStatus

        result = GetAgentStatus().invoke(
            {
                "hosts": [
                    {
                        "ip": "10.0.0.1",
                        "bk_cloud_id": 1,
                    }
                ]
            }
        )
        if not result["result"]:
            raise Exception(result["message"])
    except Exception as ex:
        raise CheckException("System GSE interface access abnormal: %s" % ex)
