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

from __future__ import unicode_literals

import datetime
import time
import unicodedata

from django.conf import settings
from django.utils import timezone
from django.utils.six.moves.urllib.parse import urlparse
from django.utils.translation import ugettext as _

from common.log import logger
from common.encryption import encrypt, decrypt, salt
from common.utils.basic import escape_html_return_msg
from bkaccount.models import BkToken, Loignlog

BK_COOKIE_AGE = settings.BK_COOKIE_AGE
BK_INACTIVE_COOKIE_AGE = settings.BK_INACTIVE_COOKIE_AGE


def get_bk_token(username):
    """
    生成用户的登录态
    """
    bk_token = ""
    expire_time = int(time.time())
    # 重试5次
    retry_count = 0
    while not bk_token and retry_count < 5:
        now_time = int(time.time())
        expire_time = now_time + BK_COOKIE_AGE
        inactive_expire_time = now_time + BK_INACTIVE_COOKIE_AGE
        plain_token = "%s|%s|%s" % (expire_time, username, salt())
        bk_token = encrypt(plain_token)
        try:
            # BkToken.objects.create(token=bk_token)
            BkToken.objects.create(token=bk_token, inactive_expire_time=inactive_expire_time)
        except Exception:
            # logger.exception(u"登录票据保存失败")
            logger.exception("Login ticket failed to be saved during ticket generation")
            # 循环结束前将bk_token置空后重新生成
            bk_token = "" if retry_count < 4 else bk_token
        retry_count += 1
    return bk_token, datetime.datetime.fromtimestamp(expire_time, timezone.get_current_timezone())


def is_bk_token_valid(bk_token):  # NOQA
    """
    验证用户登录态
    """
    if not bk_token:
        error_msg = _("缺少参数bk_token")
        return False, error_msg

    try:
        plain_bk_token = decrypt(bk_token)
    except Exception:
        plain_bk_token = ""
        # logger.exception(u"参数[%s]解析失败" % bk_token)
        logger.exception("Parameter[%s] parse failed" % bk_token)

    # 参数bk_token非法
    error_msg = _("参数bk_token非法")
    if not plain_bk_token:
        return False, error_msg

    try:
        token_info = plain_bk_token.split("|")
        if not token_info or len(token_info) < 3:
            return False, error_msg
    except Exception:
        logger.exception("split token fail: %s" % bk_token)
        return False, error_msg

    try:
        # is_logout = BkToken.objects.get(token=bk_token).is_logout
        bktoken_obj = BkToken.objects.get(token=bk_token)
        is_logout = bktoken_obj.is_logout
        inactive_expire_time = bktoken_obj.inactive_expire_time
    except Exception:
        error_msg = _("不存在bk_token[%s]的记录") % bk_token
        return False, error_msg

    expire_time = int(token_info[0])
    now_time = int(time.time())
    # token已注销
    if is_logout:
        error_msg = _("登录态已注销")
        return False, error_msg
    # token有效期已过
    if now_time > expire_time + settings.BK_TOKEN_OFFSET_ERROR_TIME:
        error_msg = _("登录态已过期")
        return False, error_msg
    # token有效期大于当前时间的有效期
    if expire_time - now_time > BK_COOKIE_AGE + settings.BK_TOKEN_OFFSET_ERROR_TIME:
        error_msg = _("登录态有效期不合法")
        return False, error_msg

    # token 无操作有效期已过，
    if now_time > inactive_expire_time + settings.BK_TOKEN_OFFSET_ERROR_TIME:
        error_msg = _("长时间无操作，登录态已过期")
        return False, error_msg

    # 更新 无操作有效期
    try:
        # 为避免每个请求都刷新inactive_expire_time造成性能问题，在对inactive_expire_time续期前，进行更新时间间隔判断
        # 表记录中的inactive_expire_time = 上一个now_time + BK_INACTIVE_COOKIE_AGE
        # 需判断 (当前时间 + BK_INACTIVE_COOKIE_AGE) > (inactive_expire_time + 更新时间间隔)，才进行续期
        if now_time + BK_INACTIVE_COOKIE_AGE > inactive_expire_time + settings.BK_INACTIVE_UPDATE_INTERVEL:
            BkToken.objects.filter(token=bk_token).update(inactive_expire_time=now_time + BK_INACTIVE_COOKIE_AGE)
    except Exception:
        logger.exception("update inactive_expire_time fail")

    username = token_info[1]
    return True, username


@escape_html_return_msg
def validate_bk_token(data):
    """
    检查bk_token的合法性，并返回用户实例
    """
    bk_token = data.get(settings.BK_COOKIE_NAME)
    # 验证Token参数
    is_valid, username = is_bk_token_valid(bk_token)
    if not is_valid:
        return False, None, username

    # TODO: ? use usermgr get user check if user exists?
    return True, username, ""


def set_bk_token_invalid(request, response=None):
    """
    将登录票据设置为不合法
    """
    bk_token = request.COOKIES.get(settings.BK_COOKIE_NAME, None)
    if bk_token:
        BkToken.objects.filter(token=bk_token).update(is_logout=True)
    if response is not None:
        # delete cookie
        response.delete_cookie(settings.BK_COOKIE_NAME, domain=settings.BK_COOKIE_DOMAIN)
        return response
    return None


def is_safe_url(url, host=None):
    """
    判断url是否与当前host的根域一致

    以下情况返回False：
        1)根域不一致
        2)url的scheme不为：https(s)
        3)url为空
    """
    if url is not None:
        url = url.strip()
    if not url:
        return False
    # Chrome treats \ completely as /
    url = url.replace("\\", "/")
    # Chrome considers any URL with more than two slashes to be absolute, but
    # urlparse is not so flexible. Treat any url with three slashes as unsafe.
    if url.startswith("///"):
        return False
    url_info = urlparse(url)
    # Forbid URLs like http:///example.com - with a scheme, but without a hostname.
    # In that URL, example.com is not the hostname but, a path component. However,
    # Chrome will still consider example.com to be the hostname, so we must not
    # allow this syntax.
    if not url_info.netloc and url_info.scheme:
        return False
    # Forbid URLs that start with control characters. Some browsers (like
    # Chrome) ignore quite a few control characters at the start of a
    # URL and might consider the URL as scheme relative.
    if unicodedata.category(url[0])[0] == "C":
        return False
    url_domain = url_info.netloc.split(":")[0].split(".")[-2] if url_info.netloc else ""
    host_domain = host.split(":")[0].split(".")[-2] if host else ""
    return (not url_info.netloc or url_domain == host_domain) and (
        not url_info.scheme or url_info.scheme in ["http", "https"]
    )


def record_login_log(request, username, app_id):
    """
    记录用户登录日志
    """
    host = request.get_host()
    login_browser = request.META.get("HTTP_USER_AGENT", "unknown")
    # 获取用户ip
    login_ip = request.META.get("HTTP_X_FORWARDED_FOR", "REMOTE_ADDR")

    Loignlog.objects.record_login(username, login_browser, login_ip, host, app_id)
