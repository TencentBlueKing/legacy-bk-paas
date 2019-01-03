#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
import smtplib

from email.MIMEMultipart import MIMEMultipart
from email.MIMEText import MIMEText
from email.utils import COMMASPACE


def send_mail(smtp_host, smtp_port, smtp_user, smtp_pwd, smtp_usessl, smtp_usetls, mail_sender, receiver):
    print "1. build mail content"
    # Create message container
    msg = MIMEMultipart()
    msg['Subject'] = "This is a test email"
    msg['From'] = mail_sender
    msg['To'] = COMMASPACE.join(receiver)
    # Create the body of the message (a plain-text and an HTML version).
    html = "Hello world!"
    # Record the MIME types of both parts - text/plain and text/html.
    part2 = MIMEText(html, 'html', 'utf-8')

    # Attach parts into message container.
    # According to RFC 2046, the last part of a multipart message, in this case
    # the HTML message, is best and preferred.
    msg.attach(part2)

    print "2. connect smtp client"
    if smtp_usessl:
        smtp = smtplib.SMTP_SSL(smtp_host, smtp_port, timeout=10)
    else:
        smtp = smtplib.SMTP(smtp_host, smtp_port, timeout=10)

    if smtp_usetls:
        smtp.set_debuglevel(True)
        smtp.ehlo()
        smtp.starttls()
        smtp.ehlo()

    print "3. login via username/password"
    smtp.login(smtp_user, smtp_pwd)

    print "4. do send mail"
    smtp.sendmail(mail_sender, receiver, msg.as_string())

    smtp.quit()
    print "5. done"
    return True


def main():
    # qq email: how to open POP3/SMTP/IMAP?
    # http://service.mail.qq.com/cgi-bin/help?subtype=1&&no=166&&id=28

    smtp_host = "smtp.qq.com"
    smtp_port = 465

    smtp_user = "10000@qq.com"
    smtp_pwd = "xxx"

    smtp_usessl = True
    smtp_usetls = False

    mail_sender = "10000@qq.com"
    receiver = ["bking@bking.com"]

    send_mail(smtp_host, smtp_port, smtp_user, smtp_pwd, smtp_usessl, smtp_usetls, mail_sender, receiver)


if __name__ == '__main__':
    # checklist
    # 1. check SMTP service connectivity
    #    - telnet smtp_host smtp_port
    # 2. check if ssl is needed
    # 3. check if tls is needed
    # 4. check username/password/sender is ok

    main()
