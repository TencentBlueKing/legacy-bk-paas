# -*- coding: utf-8 -*-
import re
import json

from cachetools import cached, TTLCache

from common.constants import CACHE_MAXSIZE, CacheTimeLevel
from common.constants import FunctionControllerCodeEnum
from esb.bkcore.models import FunctionController


class FunctionControllerClient(object):
    """功能控制器"""

    @classmethod
    def _get_func_ctrl_by_code(cls, func_code, data_type="list"):
        """根据功能标识获取对应数据

        :param str data_type: list，将字符串按照逗号、分号分隔转换为列表；json，将字符串json.loads
        """
        func_ctrl = FunctionController.objects.filter(func_code=func_code).first()
        if func_ctrl:
            if data_type == "list":
                return func_ctrl.switch_status, re.findall(r"[^,;]+", func_ctrl.wlist or "")
            elif data_type == "json":
                try:
                    return func_ctrl.switch_status, json.loads(func_ctrl.wlist)
                except Exception:
                    return None, None
            else:
                return func_ctrl.switch_status, func_ctrl.wlist
        else:
            return None, None

    @classmethod
    @cached(cache=TTLCache(maxsize=CACHE_MAXSIZE, ttl=CacheTimeLevel.CACHE_TIME_SHORT.value))
    def is_skip_user_auth(cls, app_code):
        """判定APP是否可跳过用户认证，如果功能开放，且APP在白名单内，则可跳过"""
        switch_status, wlist = FunctionControllerClient._get_func_ctrl_by_code(
            FunctionControllerCodeEnum.SKIP_USER_AUTH.value
        )
        if switch_status and app_code in wlist:
            return True
        else:
            return False

    @classmethod
    @cached(cache=TTLCache(maxsize=10, ttl=CacheTimeLevel.CACHE_TIME_SHORT.value))
    def get_jwt_key(cls):
        _, wlist = cls._get_func_ctrl_by_code(FunctionControllerCodeEnum.JWT_KEY.value, data_type="json")
        if not isinstance(wlist, dict):
            return {}
        return wlist

    @classmethod
    def save_jwt_key(cls, private_key, public_key):
        FunctionController.objects.get_or_create(
            func_code=FunctionControllerCodeEnum.JWT_KEY.value,
            defaults={
                "func_name": u"JWT私钥公钥",
                "switch_status": True,
                "wlist": json.dumps({"private_key": private_key, "public_key": public_key}),
            },
        )
