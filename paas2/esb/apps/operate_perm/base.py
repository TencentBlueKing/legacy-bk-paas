# -*- coding: utf-8 -*
from common.errors import error_codes


class BasePerm(object):
    def __init__(self, request, current_user):
        self.request = request
        self.current_user = current_user

    def get_user_allowed_cc_app(self):
        from components.bk.apis.cc.get_app_by_user import GetAppByUser

        result = GetAppByUser(current_user=self.current_user).invoke()
        if not result["result"]:
            raise error_codes.USER_PERMISSION_DENIED.format_prompt(
                "Failed to get the business information of current user (%s) with permissions, please try again later."
                % self.current_user.username
            )
        return [item["ApplicationID"] for item in result["data"]]
