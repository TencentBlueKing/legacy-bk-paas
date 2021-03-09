# -*- coding: utf-8 -*-
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
