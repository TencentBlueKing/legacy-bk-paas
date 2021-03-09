# -*- coding: utf-8 -*-
"""
db
"""
from django.db import connections

from common.log import logger


def execute_sql(db_alias, operation, params=None):
    """
    @summary: 查询数据库中的数据
    @param db_alias: 数据连接别名，数据连接由settings.DATABASES设置
    @param execute_sql: 执行更新操作的SQL语句
    @param params: SQL语句中条件参数
    @return: 返回是否执行成功
    """
    cursor = connections[db_alias].cursor()
    res = True
    msg = ""
    try:
        cursor.execute(operation)
        msg = u"执行成功"
    except Exception:
        logger.exception(u"sql语句执行失败")
        res = False
    finally:
        # 关闭连接
        cursor.close()
    return res, msg
