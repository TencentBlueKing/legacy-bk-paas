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

from django.db import connections

from common.log import logger

"""
DJANGO DB 的本地查询
"""


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
