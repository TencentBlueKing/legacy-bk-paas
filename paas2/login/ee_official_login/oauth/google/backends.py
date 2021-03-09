# -*- coding: utf-8 -*-
from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

from common.log import logger
from .utils import get_access_token, get_scope_data


class OauthBackend(ModelBackend):
    """
    自定义认证方法

    注意: 打logger.debug用于调试, 可以在日志路径下login.log查看到对应日志
    """

    def authenticate(self, code=None):
        # Google登录验证
        try:
            # 调用接口验证登录票据CODE，并获取access_token
            access_token = get_access_token(code)
            if not access_token:
                logger.debug("OauthBackend get_access_token fail")
                return None
            # 通过access_token 获取用户信息
            userinfo = get_scope_data(access_token)
            if not userinfo:
                logger.debug("OauthBackend get_scope_data fail")
                return None

            logger.debug("OauthBackend get userinfo=%s", userinfo)

            # 验证通过
            username = userinfo.get("username")

            # 获取User类
            UserModel = get_user_model()
            # 初始化User对象 -> bkauth/models.py:User -> 从userinfo获取对应字段进行初始化
            # 新建用户时, username/display_name必须
            user = UserModel()
            user.username = username
            user.display_name = userinfo.get("display_name")
            user.email = userinfo.get("email")
            user.telephone = userinfo.get("telephone")
            print user

            # 同步用户到用户管理 sync to usermgr
            ok, message = user.sync_to_usermgr()
            if not ok:
                logger.error("login success, but sync user to usermgr fail: %s", message)
                return None

            return user

        except Exception:
            logger.exception("Google login backend validation error!")
        return None
