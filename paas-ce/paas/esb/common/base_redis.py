# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
import redis
from redis import sentinel
from django.conf import settings

from common.log import logger
from common.bkerrors import bk_error_codes


redis_config = {
    'host': getattr(settings, 'REDIS_HOST', ''),
    'port': getattr(settings, 'REDIS_PORT', None),
    'db': getattr(settings, 'REDIS_DB', 0),
    'password': getattr(settings, 'REDIS_PASSWORD', ''),
    'max_connections': 600,
}

redis_sentinel_config = {
    'use_sentinel': getattr(settings, 'USE_SENTINEL', False),
    'master_name': getattr(settings, 'REDIS_MASTER_NAME', None),
}


def get_redis_pool(redis_conf, redis_sentinel_conf):
    """
    @param redis_conf: 针对整个redis配置都更改的情况
    @return: redis连接池
    """
    if redis_sentinel_conf['use_sentinel']:
        redis_sentinel = sentinel.Sentinel(
            [(redis_conf['host'], redis_conf['port'])],
            socket_timeout=5
        )
        return sentinel.SentinelConnectionPool(redis_sentinel_conf['master_name'], redis_sentinel,
                                               db=redis_conf['db'], password=redis_conf['password'],
                                               max_connections=redis_conf['max_connections'])
    else:
        return redis.BlockingConnectionPool(**redis_conf)


try:
    redisdb = redis.Redis(connection_pool=get_redis_pool(redis_config, redis_sentinel_config))
except:
    logger.exception(u'%s redis connection fail.', bk_error_codes.REDIS_CONNECTION_ERROR.code)
    redisdb = None
