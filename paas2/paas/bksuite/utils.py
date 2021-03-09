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

from django.utils.translation import ugettext as _

from common.db_helper import SqlOperate
from bksuite.constants import BKSUITE_QUERY_SQL, ALL_PRODUCTION_QUERY_SQL, PRODUCTION_NAME_DICT


def _query_production_info(sql):
    """
    获取产品信息
    """
    sql_operate_obj = SqlOperate("bksuite")
    return sql_operate_obj.simple_query(sql)


def get_bksuite_info():
    """
    获取bksuite版本信息
    """
    return _query_production_info(BKSUITE_QUERY_SQL)


def get_all_production_info():
    """
    获取所有产品的版本信息
    """
    all_production = _query_production_info(ALL_PRODUCTION_QUERY_SQL)
    all_production_list = []
    for i in all_production:
        name = i.get("name", "--")
        display_name = name if name not in PRODUCTION_NAME_DICT else _(name)
        all_production_list.append(
            {"name": display_name, "code": i.get("code", "--"), "version": i.get("version", "--")}
        )
    return all_production_list
