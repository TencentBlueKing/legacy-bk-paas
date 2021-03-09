# -*- coding: utf-8 -*-
BK_APP_JSON_VERSION = 1


class BaseBKApp(object):

    app_code = ""
    verified = False

    def as_json(self):
        return {
            "version": BK_APP_JSON_VERSION,
            "bk_app_code": self.app_code,
            "verified": self.verified,
        }


class BKApp(BaseBKApp):
    def __init__(self, app_code, verified=False):
        self.app_code = app_code
        self.verified = bool(app_code and verified)
