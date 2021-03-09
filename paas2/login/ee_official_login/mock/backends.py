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
