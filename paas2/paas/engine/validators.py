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


import re
import socket

from django.utils.translation import ugettext as _

from engine.constants import IP_PATTERN


def is_valid_ip(address):
    try:
        socket.inet_aton(address)
        return True
    except Exception:
        return False


# TODO: change to form validate
def validate_app_server_info(server_ip, server_port, app_port, server_category):
    if not IP_PATTERN.match(server_ip):
        return False, _(u"服务器IP格式不正确")

    if not is_valid_ip(server_ip):
        return False, _(u"服务器IP格式不正确")

    if not server_port:
        return False, _(u"Agent端口不能为空")

    try:
        server_port = int(server_port)
    except Exception:
        return False, _(u"Agent端口必须为正数")

    if not app_port:
        return False, _(u"App服务端口不能为空")

    try:
        app_port = int(app_port)
    except Exception:
        return False, _(u"App服务端口必须为正数")

    if not server_category:
        return False, _(u"服务器类别不能为空")

    return True, "Valid"


def is_valid_domain(domain):
    pattern = re.compile(
        r"^(([a-zA-Z]{1})|([a-zA-Z]{1}[a-zA-Z]{1})|"
        r"([a-zA-Z]{1}[0-9]{1})|([0-9]{1}[a-zA-Z]{1})|"
        r"([a-zA-Z0-9][-_.a-zA-Z0-9]{0,61}[a-zA-Z0-9]))\."
        r"([a-zA-Z]{2,13}|[a-zA-Z0-9-]{2,30}.[a-zA-Z]{2,3})$"
    )
    return pattern.match(domain)


def validate_third_server_info(server_ips, server_port, username, password, server_category):
    if not server_ips:
        return False, _(u"服务器地址列表不能为空(IP或域名)")

    for server_ip in server_ips.split(";"):
        if not ((IP_PATTERN.match(server_ip) and is_valid_ip(server_ip)) or is_valid_domain(server_ip)):
            return False, _(u"服务器地址格式不正确, 必须为合法IP或域名[%s]") % server_ip

    if not server_port:
        return False, _(u"端口不能为空")

    try:
        server_port = int(server_port)
    except Exception:
        return False, _(u"端口必须为正数")

    if not username:
        return False, _(u"用户名不能为空")

    if not password:
        return False, _(u"密码不能为空")

    if not server_category:
        return False, _(u"服务器类型不能为空")

    return True, "Valid"
