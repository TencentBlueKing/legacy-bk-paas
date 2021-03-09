# -*- coding: utf-8 -*-
"""
common utils

Copyright © 2012-2017 Tencent BlueKing. All Rights Reserved. 蓝鲸智云 版权所有
"""
import json


from release.models import UserOperateRecord


def record_user_operate(app_code, username, operate_type, before_data="", arfter_data="", extra_data=""):
    """
    用户操作记录创建
    @param app_code: app编码
    @param username: 操作人
    @param operate_type: 操作类型
    @param before_data: 操作前数据
    @param arfter_data: 操作后数据
    @param extra_data: 其他数据
    """
    if isinstance(extra_data, dict):
        extra_data = json.dumps(extra_data)

    if not isinstance(extra_data, basestring):
        extra_data = str(extra_data)

    result = UserOperateRecord.objects.create_operate_record(
        app_code, username, operate_type, before_data, arfter_data, extra_data
    )
    return result
