# -*- coding: utf-8 -*-
BK_USER_JSON_VERSION = 1


class BaseBKUser(object):

    username = ""
    verified = False

    def as_json(self):
        return {
            "version": BK_USER_JSON_VERSION,
            "bk_username": self.username,
            "verified": self.verified,
        }


class BKUser(BaseBKUser):
    def __init__(self, username, verified=False):
        self.username = username
        self.verified = bool(username and verified)


class AnonymousBKUser(BaseBKUser):
    pass
