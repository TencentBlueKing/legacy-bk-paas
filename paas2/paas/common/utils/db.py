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
