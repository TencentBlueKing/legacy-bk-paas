# -*- coding: utf-8 -*-

from __future__ import unicode_literals

from django.db import models
from django.conf import settings


class WxBkUserTmpRecordManager(models.Manager):
    def create_tmp_record(self, request, wx_ticket):
        """
        创建临时记录
        """
        username = request.user.username
        bk_token = request.COOKIES.get(settings.BK_COOKIE_NAME)
        self.create(username=username, bk_token=bk_token, wx_ticket=wx_ticket)
        return True
