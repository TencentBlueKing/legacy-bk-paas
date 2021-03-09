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

from __future__ import unicode_literals

from django.utils.translation import ugettext as _
from django.db import models
from django.utils import timezone


class LoginLogManager(models.Manager):
    """
    User login log manager
    """

    def record_login(self, _username, _login_browser, _login_ip, host, app_id):
        try:
            self.model(
                username=_username,
                login_browser=_login_browser,
                login_ip=_login_ip,
                login_host=host,
                login_time=timezone.now(),
                app_id=app_id,
            ).save()
            return (True, _("记录成功"))
        except Exception:
            return (False, _("用户登录记录失败"))
