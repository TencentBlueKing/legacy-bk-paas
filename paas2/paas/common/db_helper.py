# -*- coding: utf-8 -*-
"""
DJANGO DB 的本地查询
"""
from django.db import connections

from common.log import logger


class SqlOperate(object):
    """
    在django db上执行自定义SQL
    """

    def __init__(self, db="default"):
        self.connection = connections[db]

    def dictfetchall(self, cursor):
        columns = [col[0] for col in cursor.description]
        return [dict(zip(columns, row)) for row in cursor.fetchall()]

    def simple_query(self, sql):
        """
        简单查询
        @param sql:
        @return:[{'parent_id': None, 'id': 54360982}, {'parent_id': None, 'id': 54360880}]
        """
        try:
            cursor = self.connection.cursor()
            try:
                cursor.execute(sql)
                result = self.dictfetchall(cursor)
            except Exception as error:
                logger.error(u"sql(%s) query error: %s" % (sql, error))
                result = []
            finally:
                cursor.close()
        except Exception as error:
            logger.error(u"database connection error: %s" % error)
            result = []
        return result

    def simple_exec(self, sql):
        """
        简单执行
        @param sql:
        @return:[{'parent_id': None, 'id': 54360982}, {'parent_id': None, 'id': 54360880}]
        """
        try:
            cursor = self.connection.cursor()
            try:
                result = cursor.execute(sql)
            except Exception as error:
                logger.error(u"sql(%s) execute error: %s" % (sql, error))
                result = 0
            finally:
                cursor.close()
        except Exception as error:
            logger.error(u"database connection error: %s" % error)
            result = 0
        return result
