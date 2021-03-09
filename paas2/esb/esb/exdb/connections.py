# -*- coding: utf-8 -*-
"""
使用 SQLAlchemy 来和其他数据库打交道
"""
import urllib

from sqlalchemy import create_engine
from django.conf import settings

from common.base_utils import FancyDict


def make_sa_conn_string(config_dict, driver_type="pymysql"):
    """
    Convert a django db dict to sqlalchemy string
    """
    return "mysql+%(driver_type)s://%(user)s:%(password)s@%(host)s:%(port)s/%(db)s?charset=utf8" % {
        "driver_type": driver_type,
        "user": config_dict["USER"],
        "password": urllib.quote(config_dict["PASSWORD"]),
        "host": config_dict["HOST"],
        "port": config_dict["PORT"],
        "db": config_dict["NAME"],
    }


_connections = FancyDict()


def get_connections(name):
    return _connections[name]


# Init connections
for db_name, db_config in [
    ("default", settings.DATABASES["default"]),
]:
    dbstr = make_sa_conn_string(db_config, driver_type="pymysql")
    pool_options = db_config.get("POOL_OPTIONS") or {"pool_size": 20, "max_overflow": 100, "pool_recycle": 3600}
    engine = create_engine(dbstr, echo=False, **pool_options)
    _connections[db_name] = engine
