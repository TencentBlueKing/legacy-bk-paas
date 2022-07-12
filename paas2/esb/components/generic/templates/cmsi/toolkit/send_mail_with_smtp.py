# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS
Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License.
You may obtain a copy of the License at http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
specific language governing permissions and limitations under the License.
"""

import base64
import mimetypes
import smtplib
from email.header import Header
from email.mime.image import MIMEImage
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import COMMASPACE

from django.utils.encoding import force_text

from common.base_utils import smart_str
from common.bkerrors import bk_error_codes
from common.log import logger


class SMTPClient(object):
    def __init__(
        self, smtp_host, smtp_port, smtp_user="", smtp_pwd="", smtp_usessl=False, smtp_usetls=False, smtp_timeout=10
    ):
        self.smtp_host = smtp_host
        self.smtp_port = smtp_port
        self.smtp_user = smtp_user
        self.smtp_pwd = smart_str(smtp_pwd)
        self.smtp_usessl = smtp_usessl
        self.smtp_usetls = smtp_usetls
        self.smtp_timeout = smtp_timeout

    def send_mail(self, kwargs):
        mail_sender = kwargs["sender"]
        all_receiver = kwargs["receiver"] + kwargs["cc"]

        if kwargs.get("mime_subtype"):
            msg = MIMEMultipart(kwargs["mime_subtype"])
        else:
            msg = MIMEMultipart()
        msg["Subject"] = Header(smart_str(kwargs["title"]), "utf-8")
        msg["From"] = mail_sender
        msg["To"] = COMMASPACE.join(kwargs["receiver"])
        msg["Cc"] = COMMASPACE.join(kwargs["cc"])

        # 添加邮件内容
        self.add_content_to_msg(msg, kwargs["content"], kwargs.get("body_format"))

        # 加载附件
        self.add_attachment_to_msg(msg, kwargs.get("attachments"))

        try:
            smtp = self.get_smtp_client()
            smtp.sendmail(mail_sender, all_receiver, msg.as_string())
            smtp.quit()
        except Exception:
            logger.exception(
                "%s send mail exception, server: %s:%s",
                bk_error_codes.REQUEST_SMTP_ERROR.code,
                self.smtp_host,
                self.smtp_port,
            )
            return {"result": False, "message": "Failed to send mail"}
        else:
            return {"result": True, "message": "Succeeded to send mail"}

    def add_content_to_msg(self, mail_msg, content, body_format):
        body_format = "plain" if body_format == "Text" else "html"
        msgtxt = MIMEText(smart_str(content), body_format, "utf-8")
        mail_msg.attach(msgtxt)

    def add_attachment_to_msg(self, mail_msg, attachments):
        """
        :param attachment:
        [
            {
                'file_name': 'test.jpg',   # 文件名
                'file_content': 'xxx',     # 文件内容
                'file_type': 'image',      # 文件类型
            }
        ]
        """
        for f_info in attachments or []:
            # rfc2047: encoded-word = "=?" charset "?" encoding "?" encoded-text "?="
            # encoding b for base64
            filename = smart_str(f_info.get("filename", ""))
            encoded_filename = "=?utf-8?b?" + base64.b64encode(filename) + "?="
            _content = f_info.get("content", "")
            _type = f_info.get("type") or force_text(filename).split(".")[-1] or "attachment"
            _disposition = f_info.get("disposition", "")
            # 添加二进制附件
            if _type in ["image", "jpg", "png", "jpeg"]:
                content_id = f_info.get("content_id") or "<%s>" % encoded_filename
                _disposition = _disposition or "inline"
                msgImage = MIMEImage(_content, name=encoded_filename)
                msgImage.add_header("Content-ID", content_id)
                msgImage.add_header("Content-Disposition", _disposition, filename=encoded_filename)
                mail_msg.attach(msgImage)
            else:
                _disposition = _disposition or "attachment"
                ctype, encoding = mimetypes.guess_type(encoded_filename)
                if ctype is None or encoding is not None:
                    ctype = "application/octet-stream"
                maintype, subtype = ctype.split("/", 1)
                att = MIMEImage(_content, _subtype=subtype)
                att.add_header("Content-Disposition", _disposition, filename=encoded_filename)
                mail_msg.attach(att)

    def get_smtp_client(self):
        if self.smtp_usessl:
            smtp = smtplib.SMTP_SSL(self.smtp_host, self.smtp_port, timeout=self.smtp_timeout)
        else:
            smtp = smtplib.SMTP(self.smtp_host, self.smtp_port, timeout=self.smtp_timeout)

        if self.smtp_usetls:
            smtp.ehlo()
            smtp.starttls()
            smtp.ehlo()

        if self.smtp_user and self.smtp_pwd:
            smtp.login(self.smtp_user, self.smtp_pwd)
        return smtp
