# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

from __future__ import unicode_literals

from enum import Enum


# 微信类型
class WxTypeEnum(Enum):
    MP = 'mp'
    QY = 'qy'
    QYWX = 'qywx'


# 微信公众号API相关URL
WEIXIN_MP_API_URL = {
    'get_access_token': 'https://api.weixin.qq.com/cgi-bin/token',
    'create_qrcode': 'https://api.weixin.qq.com/cgi-bin/qrcode/create',
    'show_qrcode_url': 'https://mp.weixin.qq.com/cgi-bin/showqrcode'
}

# 微信企业号/企业微信API相关URL
WEIXIN_QY_API_URL = {
    WxTypeEnum.QY.value: {
        'get_access_token': 'https://qyapi.weixin.qq.com/cgi-bin/gettoken',
        'login_url': 'https://qy.weixin.qq.com/cgi-bin/loginpage',
        'get_login_info': 'https://qyapi.weixin.qq.com/cgi-bin/service/get_login_info'
    },
    WxTypeEnum.QYWX.value: {
        'get_access_token': 'https://qyapi.weixin.qq.com/cgi-bin/gettoken',
        'login_url': 'https://open.work.weixin.qq.com/wwopen/sso/qrConnect',
        'get_user_info': 'https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo'
    }
}

# 微信公众号临时二维码过期时长
WEIXIN_MP_QRCODE_EXPIRE_SECONDS = 7200
