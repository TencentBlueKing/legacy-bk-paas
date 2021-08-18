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

import urllib
import random

import requests
from django.conf import settings as bk_settings
from django.core.cache import cache

from common.log import logger
from . import settings as wx_settings

def get_wx_access_token():
    """
    获取企业微信access_token
    """
    access_token = cache.get(wx_settings.CACHE_KEY_NAME, '')
    if access_token:
        return access_token
    token_url = wx_settings.ACCESS_TOKEN_URL.format(wx_settings.CORP_ID, wx_settings.CORP_SECRET)
    resp = requests.get(token_url)
    if resp.status_code != 200:
        # 记录错误日志
        content = resp.content[:100] if resp.content else ''
        error_msg = ("http enterprise request error! type: %s, url: %s, "
                     "response_status_code: %s, response_content: %s")
        logger.error(error_msg % ('GET', token_url, resp.status_code, content))
        return None
    try:
        data = resp.json()
        expires_in = data.get('expires_in', 0)
        access_token = data.get('access_token', None)
        if access_token and expires_in > 60:
            cache.set(wx_settings.CACHE_KEY_NAME, access_token, expires_in-60)
            return data.get('access_token')
        else:
            logger.debug("access_token: %s expires in %s"% (access_token, expires_in))
            return None
    except requests.exceptions.JSONDecodeError as e: 
        logger.exception("get wx access_token error: {}".format(str(e)))
        return None

def get_wx_user_info(access_token, code):
    """
    获取企业微信访问用户身份
    """
    info_url = wx_settings.WX_USER_INFO_URL.format(access_token, code)

    info_resp = requests.get(info_url)
    if info_resp.status_code != 200:
        # 记录错误日志
        content = info_resp.content[:100] if info_resp.content else ''
        error_msg = ("http enterprise request error! type: %s, url: %s, "
                     "response_status_code: %s, response_content: %s")
        logger.error(error_msg % ('GET', info_url, info_resp.status_code, content))
        return None
    try:
        info_data = info_resp.json()
        user_id = info_data.get('UserId', '')
        data = {
            "username": user_id
        }
        return data
    except requests.exceptions.JSONDecodeError as e: 
        logger.exception("get wx user info error: {}".format(str(e)))
        return None
    