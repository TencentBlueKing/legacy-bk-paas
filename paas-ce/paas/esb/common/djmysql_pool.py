# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
import logging

from sqlalchemy import exc
from sqlalchemy import event
from sqlalchemy.pool import manage
from sqlalchemy.pool import Pool

POOL_PESSIMISTIC_MODE = False
POOL_SETTINGS = {}
POOL_SETTINGS.setdefault("recycle", 3600)

logger = logging.getLogger('djmysql_pool.pool')


@event.listens_for(Pool, "checkout")
def _on_checkout(dbapi_connection, connection_record, connection_proxy):
    logger.debug("connection retrieved from pool")

    if POOL_PESSIMISTIC_MODE:
        cursor = dbapi_connection.cursor()
        try:
            cursor.execute("SELECT 1")
        except Exception:
            # raise DisconnectionError - pool will try
            # connecting again up to three times before raising.
            raise exc.DisconnectionError()
        finally:
            cursor.close()


@event.listens_for(Pool, "checkin")
def _on_checkin(*args, **kwargs):
    logger.debug("connection returned to pool")


@event.listens_for(Pool, "connect")
def _on_connect(*args, **kwargs):
    logger.debug("connection created")


def patch_mysql(pool_options={}):  # noqa
    class hashabledict(dict):  # noqa
        def __hash__(self):
            return hash(tuple(sorted(self.items())))

    class hashablelist(list):  # noqa
        def __hash__(self):
            return hash(tuple(sorted(self)))

    class ManagerProxy(object):
        def __init__(self, manager):
            self.manager = manager

        def __getattr__(self, key):
            return getattr(self.manager, key)

        def connect(self, *args, **kwargs):
            if 'conv' in kwargs:
                conv = kwargs['conv']
                if isinstance(conv, dict):
                    items = []
                    for k, v in conv.items():
                        if isinstance(v, list):
                            v = hashablelist(v)
                        items.append((k, v))
                    kwargs['conv'] = hashabledict(items)
            if 'ssl' in kwargs:
                ssl = kwargs['ssl']
                if isinstance(ssl, dict):
                    items = []
                    for k, v in ssl.items():
                        if isinstance(v, list):
                            v = hashablelist(v)
                        items.append((k, v))
                    kwargs['ssl'] = hashabledict(items)
            return self.manager.connect(*args, **kwargs)

    from django.db.backends.mysql import base as mysql_base

    POOL_SETTINGS = pool_options  # noqa

    if not hasattr(mysql_base, "_Database"):
        mysql_base._Database = mysql_base.Database
        mysql_base.Database = ManagerProxy(manage(mysql_base._Database, **POOL_SETTINGS))
