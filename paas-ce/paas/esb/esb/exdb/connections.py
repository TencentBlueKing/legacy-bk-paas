# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
"""
使用 SQLAlchemy 来和其他数据库打交道
"""
import urllib

from sqlalchemy import create_engine
from django.conf import settings

from common.base_utils import FancyDict


def make_sa_conn_string(config_dict, driver_type='pymysql'):
    """
    Convert a django db dict to sqlalchemy string
    """
    return 'mysql+%(driver_type)s://%(user)s:%(password)s@%(host)s:%(port)s/%(db)s?charset=utf8' % {
        'driver_type': driver_type,
        'user': config_dict['USER'],
        'password': urllib.quote(config_dict['PASSWORD']),
        'host': config_dict['HOST'],
        'port': config_dict['PORT'],
        'db': config_dict['NAME'],
    }


_connections = FancyDict()


def get_connections(name):
    return _connections[name]


# Init connections
for db_name, db_config in [('default', settings.DATABASES['default']), ]:
    dbstr = make_sa_conn_string(db_config, driver_type='pymysql')
    pool_options = db_config.get('POOL_OPTIONS') or {
        'pool_size': 20,
        'max_overflow': 100,
        'pool_recycle': 3600
    }
    engine = create_engine(dbstr, echo=False, **pool_options)
    _connections[db_name] = engine
