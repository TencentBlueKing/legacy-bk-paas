# -*- coding: utf-8 -*-
import requests
from . import imap

rpool = requests.Session()


class HttpClient(object):
    def request(self, method, url, **kwargs):
        # 超时时间必须ESB控制
        kwargs["timeout"] = 5

        try:
            resp = rpool.request(method, url, **kwargs)
            result = {"result": True, "data": resp.content}
        except Exception as error:
            result = {"result": False, "message": "%s" % error}

        return result


class IMAPClient(object):
    def __init__(self, email, password, imap_host, imap_port, secure=False):
        self.client = imap.MailPoller(email, password, imap_host, imap_port, secure=secure)

    def request(
        self,
        charset=None,
        unseen=None,
        before=None,
        since=None,
        size_limit=None,
        sent_from=None,
        sent_to=None,
        subject=None,
        index=None,
        limit=None,
    ):
        try:
            data = self.client.fetch_by(
                charset, unseen, before, since, size_limit, sent_from, sent_to, subject, index, limit
            )
            result = {"result": True, "data": data}
        except Exception as error:
            result = {"result": False, "message": "%s" % error}

        return result
