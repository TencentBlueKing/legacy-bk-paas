# -*- coding: utf-8 -*-

from __future__ import unicode_literals

from django.utils.translation import ugettext as _
from oauth2_provider.views.generic import ProtectedResourceView

from common import usermgr
from common.mixins.exempt import LoginExemptMixin
from api.utils import APIV3FailJsonResponse, APIV3OKJsonResponse
from api.constants import ApiErrorCodeEnumV3


class UserView(LoginExemptMixin, ProtectedResourceView):
    def get(self, request):
        """
        获取用户信息API

        只能拿取授权用户(from access_token)的信息
        """
        username = request.resource_owner.username

        # use the raw data from usermgr
        ok, message, data = usermgr.get_user(username, "v3")
        if not ok:
            return APIV3FailJsonResponse(message, code=ApiErrorCodeEnumV3.USER_NOT_EXISTS)

        return APIV3OKJsonResponse(_("用户信息获取成功"), data=data)
