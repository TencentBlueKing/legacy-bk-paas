# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

from __future__ import unicode_literals
import json
import urlparse
import base64
import uuid

from django.conf import settings
from django.core.files.base import ContentFile

from common.log import logger
from home.models import UsefulLinks


def get_post_data(request):
    try:
        post_data = json.loads(request.body)
        return post_data
    except Exception:
        return {}


def _get_paas_domain():
    """
    获取paas的域名，去除端口的
    """
    return settings.PAAS_DOMAIN.split(":")[0] if settings.PAAS_DOMAIN else ''


def validate_app_url(url):
    """
    判断url是否在当前域名下
    """
    try:
        url_pares = urlparse.urlparse(url)
        hostname = url_pares.hostname
        paas_domain = _get_paas_domain()
        if not hostname or hostname == paas_domain:
            return True, ''
        return False, "APP链接不合法，链接不在当前域名下"
    except Exception as e:
        logger.error("获取url的域名出错:%s, url:%s" % (e, url))
        return False, "校验APP链接异常"


def validate_light_app_name(name, old_name):
    """
    校验app名称
    """
    if len(name) > 20:
        return False, "应用名称长度不能超过20个字符"

    if old_name:
        exists = UsefulLinks.objects.filter(name=name).exclude(name=old_name).exists()
    else:
        exists = UsefulLinks.objects.filter(name=name).exists()

    if exists:
        return False, "应用名称[{}]已存在".format(name)
    return True, "校验通过"


def generate_file_by_base64(value):
    image_data = base64.b64decode(value)
    image_name = ''.join(['data:image/png;base64,', str(uuid.uuid4()), '.png'])
    return ContentFile(image_data, image_name)
