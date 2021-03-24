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


from future import standard_library
standard_library.install_aliases()
import urllib.parse

from django.conf import settings
from django.utils.translation import ugettext as _
from django.db.models import Q

from app_maker.constants import APP_MAKER_CODE_CHECK_PATTERN, APP_MAKER_CODE_CHECK_MSG
from app.models import App
from common.log import logger


def _get_paas_domain():
    """
    获取paas的域名，去除端口的
    """
    return settings.PAAS_DOMAIN.split(":")[0] if settings.PAAS_DOMAIN else ""


def validate_app_url(url):
    """
    判断url是否在当前域名下
    """
    if not url:
        return False, _(u"APP链接不能为空")
    try:
        url_pares = urllib.parse.urlparse(url)
        netloc = url_pares.netloc
        paas_domain = _get_paas_domain()
        if not netloc or netloc.startswith(paas_domain):
            return True, ""
        return False, _(u"APP链接不合法，链接不在当前域名下")
    except Exception as e:
        logger.error(u"获取url的域名出错:%s, url:%s" % (e, url))
        return False, _(u"APP链接不合法，链接不在当前域名下")


def validate_app_code(app_code):
    """
    检查app_code是否合法
    """
    if not app_code:
        return False, _(u"应用ID不能为空")

    code_len = len(app_code)

    if code_len < 3:
        return False, _(u"应用ID长度不能少于3个字符")

    if code_len > 16:
        return False, _(u"应用ID长度不能超过16个字符")

    if not APP_MAKER_CODE_CHECK_PATTERN.match(app_code):
        return False, APP_MAKER_CODE_CHECK_MSG

    # NOTE: 这里去除了敏感词
    is_exists = App.objects.filter(code=app_code).exists()
    if is_exists:
        return False, _(u"应用 ID[%s]已存在") % app_code

    return True, _(u"校验通过")


def check_request_valid(request):
    """
    判断请求的域名是否合法
    """
    try:
        if "HTTP_REFERER" in request.META:
            http_host = urllib.parse.urlparse(request.META["HTTP_REFERER"]).netloc
        else:
            http_host = ""
        paas_domain = _get_paas_domain()
        if not http_host or http_host.startswith(paas_domain):
            return True
        return False
    except Exception as e:
        # app_maker 判断请求来源出错:%s
        logger.error(u"An error occurred in judging request source: %s" % e)
        return False


def validate_app_permission(app_code, operator):
    return App.objects.filter(Q(code=app_code), Q(developer__username=operator) | Q(creater=operator)).exists()
