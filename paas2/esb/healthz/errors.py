# -*- coding: utf-8 -*-


class CheckException(Exception):
    def __init__(self, message):
        self.message = message

    def __str__(self):
        return self.message.encode("utf-8") if isinstance(self.message, unicode) else self.message

    def get_message(self):
        return self.message
