# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

from django.conf import settings
from django.http import JsonResponse

from .errors import CheckException
from .utils import ok_resp, failed_resp


def healthz(request):
    """
    health check
    """
    try:
        check_settings()
        check_db()
        check_third_api()
    except CheckException as e:
        return JsonResponse(failed_resp(message=e.get_message()))
    except Exception as e:
        return JsonResponse(failed_resp(message=u'ESB 服务检查异常：%s' % e))
    return JsonResponse(ok_resp(message='OK'))


def check_settings():
    """检查 settings 配置"""
    # 不能为空
    no_empty_settings_key = [
        'ESB_TOKEN', 'PAAS_HOST', 'HOST_BK_LOGIN',
        'HOST_CC', 'HOST_FTA',
    ]
    for key in no_empty_settings_key:
        if not getattr(settings, key, ''):
            raise CheckException(u'settings 配置中 %s 不能为空' % key)


def check_db():
    """检查 DB"""
    try:
        from esb.bkcore.models import ComponentSystem
        systems = ComponentSystem.objects.all()
        system_names = [system.name for system in systems]
    except Exception as ex:
        raise CheckException(u'数据库连接出现异常：%s' % ex)

    if not system_names:
        raise CheckException(u'组件系统及通道数据未初始化，请执行 "python manage.py sync_system_and_channel_data" 进行初始化')


def check_redis():
    try:
        import redis
        from common.base_redis import get_redis_pool, redis_config, redis_sentinel_config
        client = redis.Redis(connection_pool=get_redis_pool(redis_config, redis_sentinel_config))

        client.ping()

        key = 'esb_redis_check'
        client.set(key, 'esb')
        client.expire(key, 60)
        client.get(key)
    except Exception as ex:
        raise CheckException(u'Redis [%s:%s] [use_sentinel=%s] 连接出现异常：%s' % (
            settings.REDIS_HOST, settings.REDIS_PORT, getattr(settings, 'USE_SENTINEL', False), ex))


def check_third_api():
    """检查第三方系统API"""
    check_bk_login_api()
    check_cc_api()
    check_fta_api()


def check_bk_login_api():
    try:
        from components.bk.apis.bk_login.get_all_user import GetAllUser
        result = GetAllUser().invoke({'role': 1})
        if not result['result']:
            raise Exception(result['message'])
    except Exception as ex:
        raise CheckException(u'系统 BK_LOGIN 接口访问异常：%s' % ex)


def check_cc_api():
    try:
        from components.bk.apis.cc.get_set_property import GetSetProperty
        result = GetSetProperty().invoke()
        if not result['result']:
            raise Exception(result['message'])
    except Exception as ex:
        raise CheckException(u'系统 CC 接口访问异常：%s' % ex)


def check_fta_api():
    try:
        from components.bk.apis.fta.fta_component import FtaComponent
        from esb.component.base import CompRequest
        comp = FtaComponent()
        comp.set_request(CompRequest(headers={}, input={}))
        comp.setup_conf({
            'dest_path': '/event/api/1/',
            'dest_http_method': 'POST',
        })
        comp.invoke()
    except Exception as ex:
        raise CheckException(u'系统 FTA 接口访问异常：%s' % ex)
