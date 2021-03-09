# -*- coding: utf-8 -*-

from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

from common.log import logger


class MockBackend(ModelBackend):
    """
    mock认证服务

    username == "admin" 且 password == "blueking" 时认证通过

    注意: 打logger.debug用于调试, 可以在日志路径下login.log查看到对应日志
    """

    def authenticate(self, username=None, password=None):
        if not (username == "admin" and password == "blueking"):
            logger.debug("MockBackend authenticate fail, username/password should be admin/blueking")
            return None

        # 获取User类
        UserModel = get_user_model()
        # 初始化User对象 -> bkauth/models.py:User -> 从userinfo获取对应字段进行初始化
        user = UserModel()
        user.username = username
        user.display_name = "mockadmin"
        user.email = "mockadmin@mock.com"

        # 同步用户到用户管理 sync to usermgr
        # ok, message = user.sync_to_usermgr()
        ok, message = True, "success"
        if not ok:
            logger.error("login success, but sync user to usermgr fail: %s", message)
            return None

        return user
