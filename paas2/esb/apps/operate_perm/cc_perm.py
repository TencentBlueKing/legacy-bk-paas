# -*- coding: utf-8 -*-
from .base import BasePerm
from common.errors import error_codes


class CCPerm(BasePerm):
    def assert_app_perm(self, app_id):
        if str(app_id) not in self.get_user_allowed_cc_app():
            raise error_codes.USER_PERMISSION_DENIED.format_prompt(
                "The current user has no permission to access [%s] business data, please apply for permissions."
                % app_id
            )
