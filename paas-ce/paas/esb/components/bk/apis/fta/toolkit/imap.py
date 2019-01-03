# -*- coding: utf-8 -*
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
# for esb safe, not patch
# import gevent.monkey
# gevent.monkey.patch_all()

import email
import email.header
import imaplib
import time

from gevent.pool import Pool
import arrow

from common.log import logger

LOCALE_TZ = time.strftime("%Z", time.localtime())
pool = Pool(1000)


class EMail(dict):
    AVALIABLE_CONTENT_TYPE = frozenset(["text/plain", "text/html"])

    def __getattr__(self, attr):
        return self[attr]

    def __init__(self, uid, message, criteria=None, charset="utf-8"):
        self.uid = uid
        self.sender = None
        self.receiver = None
        self.subject = None
        self.message_id = None
        self.subject = None
        self.content = None
        self.time = None
        self.criteria = None
        self.charset = charset
        self.refresh(message, criteria)

    def to_dict(self):
        return {
            "uid": self.uid,
            "sender": self.sender,
            "receiver": self.receiver,
            "subject": self.subject,
            "message_id": self.message_id,
            "content": self.content,
            "time": self.time and self.time.isoformat(),
            "criteria": self.criteria,
        }

    @classmethod
    def decode(cls, content, charset=None):
        result = []
        for i, c in email.header.decode_header(content):
            i = i.decode(c or charset)
            result.append(i)
        return u"".join(result)

    @classmethod
    def _get_payload(cls, message, charset=None):
        if isinstance(message, (str, unicode)):
            return message
        payload = []
        for i in message.walk():
            if i.is_multipart():
                continue
            if i.get_content_type() in cls.AVALIABLE_CONTENT_TYPE:
                data = i.get_payload(decode=True)
                if isinstance(data, (str, unicode)):
                    content_charset = i.get_content_charset(charset)
                    if content_charset:
                        data = data.decode(content_charset, "ignore")
                payload.append(data)

        return "".join(payload)

    def refresh(self, message, criteria=None):
        if not message:
            return
        raw = email.message_from_string(message)
        self.clear()
        self.raw = raw
        self.criteria = criteria

        content_type = raw.get("Content-Type")
        if content_type:
            charset = raw.get_content_charset(self.charset)
        else:
            charset = self.charset

        self.update({
            k: self.decode(v, charset)
            for k, v in raw.items()
        })
        self.sender = self.get("From")
        self.receiver = self.get("To")
        self.subject = self.get("Subject")
        self.message_id = self.get("Message-ID")
        self.content = self._get_payload(raw, charset)

        date = self.get("Date")
        if date:
            self.time = arrow.get(
                date, "ddd, D MMM YYYY HH:mm:SS Z",
            ).to(LOCALE_TZ)


def contain_one(content, patterns):
    for p in patterns:
        if p in content:
            return True
    return False


class MailPoller(object):
    CRITERIA_HEADER = "RFC822.HEADER"
    CRITERIA = "RFC822"

    def __init__(self, email, password, imap_host, imap_port, secure=False):
        self.email = email
        self.password = password
        self.imap_host = imap_host
        self.imap_port = int(imap_port)
        self.secure = secure
        self._imap_client = None

    @property
    def imap_client(self):
        if self._imap_client:
            return self._imap_client

        if self.secure:
            imap_client = imaplib.IMAP4_SSL(self.imap_host, self.imap_port)
        else:
            imap_client = imaplib.IMAP4(self.imap_host, self.imap_port)

        imap_client.login(self.email, self.password)
        self._imap_client = imap_client
        self._imap_client.select()

        return imap_client

    def noop(self):
        status, result = self.imap_client.noop()
        return status

    def select(self, mailbox="INBOX"):
        self.imap_client.select(mailbox)

    def search(self, charset=None, unseen=None, before=None, since=None, size_limit=None):
        queries = []
        if unseen is not None:
            queries.append("(UNSEEN)")
        if before:
            queries.append('(BEFORE "%s")' % before.replace(days=1).strftime("%d-%b-%Y"))
        if since:
            queries.append('(SINCE "%s")' % since.strftime("%d-%b-%Y"))
        if size_limit:
            queries.append('(SMALLER %s)' % size_limit)
        if not queries:
            queries.append('ALL')
        status, result = self.imap_client.search(charset, " ".join(queries))
        if status != "OK":
            return []
        return [EMail(uid, None, charset=charset) for uid in result[0].split()]

    def filter(self, mails, sent_from=None, sent_to=None, subject=None, before=None, since=None,
               fetch_header_already=False):
        result_list = []
        mails = mails if fetch_header_already else self.iter_fetch_chunks(mails=mails, criteria=self.CRITERIA_HEADER,)
        sent_from = sent_from.split(",") if sent_from else ()
        sent_to = sent_to.split(",") if sent_to else ()
        subject = [subject] if subject else []
        for mail in mails:
            if ((before and before <= mail.time) or (since and since > mail.time)):
                continue
            if sent_from and not contain_one(mail.sender, sent_from):
                continue
            if sent_to and not contain_one(mail.receiver, sent_to):
                continue
            if subject and not contain_one(mail.subject, subject):
                continue

            result_list.append(mail)
        return result_list

    def fetch_header(self, mails):
        for mail in self.iter_fetch_chunks(mails=mails, criteria=self.CRITERIA_HEADER):
            pass

    def fetch(self, mails, criteria=None):
        mail_mappings = {str(mail.uid): mail for mail in mails}
        status, result = self.imap_client.fetch(",".join(mail_mappings.keys()), criteria or self.CRITERIA,)
        if status != "OK":
            raise Exception("fetch mail[%s] failed", mail_mappings.keys())

        for i in result:
            if len(i) < 2:
                continue
            uid, s, _ = i[0].partition(" ")
            mail = mail_mappings[uid]
            mail.refresh(i[1], criteria)
        return mails

    def iter_fetch_chunks(self, mails, chunks=100, criteria=None):
        def fetch(mail):
            try:
                return self.fetch(mail, criteria)
            except Exception as error:
                logger.error(error)
                return ()

        if mails:
            length = len(mails)
            chunks_list = [mails[i: i + chunks] for i in range(0, length, chunks)]
            for chunk in pool.imap(fetch, chunks_list):
                for mail in chunk:
                    yield mail

    def fetch_by(self, charset=None, unseen=None, before=None, since=None, size_limit=None,
                 sent_from=None, sent_to=None, subject=None, index=None, limit=None):
        # default charset is utf-8
        charset = charset or 'utf-8'

        mails = self.search(charset=charset, unseen=unseen, before=before, since=since, size_limit=size_limit)
        mails = self.filter(mails, sent_from=sent_from, sent_to=sent_to, subject=subject, before=before, since=since)
        if index is not None:
            mails = mails[index:]
        if limit is not None:
            mails = mails[:limit]
        _mails = []
        for mail in list(self.iter_fetch_chunks(mails)):
            _mails.append(mail.to_dict())
        return _mails
