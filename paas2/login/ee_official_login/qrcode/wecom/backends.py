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

from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

from common.log import logger
from common import usermgr
from .utils import get_wx_access_token, get_wx_user_info


class QrcodeBackend(ModelBackend):
    """
    自定义企业微信二维码认证方法
    """
    def authenticate(self, code=None):
        # 企业微信登录验证
        try:
            # 调用接口验证登录票据CODE，并获取access_token
            access_token = get_wx_access_token()
            if not access_token:
                return None
            # 通过access_token 获取用户信息, 企业微信用户userid字段映射为用户管理的username字段
            userinfo = get_wx_user_info(access_token, code)
            if not userinfo:
                logger.debug("QrcodeBackend get_wx_user_info fail")
                return None
            # 验证通过
            username = userinfo.get("username")

            ok, message, data = usermgr.get_user(username)
            if ok:
                # 获取User类
                UserModel = get_user_model()
                user, _ = UserModel.objects.get_or_create(username=username)
                return user
            else:
                logger.debug('get_user failed, %s'%message)
                return None

        except Exception:
            logger.exception("wecom qrcode login backend validation error!")
        return None
