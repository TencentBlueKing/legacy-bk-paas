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

# 企业微信CorpID
CORP_ID =''

# 企业微信自定义应用AgentID
AGENT_ID =''

# 企业微信自定义应用Secret
CORP_SECRET = ''

# access_token cache key
CACHE_KEY_NAME = 'ACCESS_TOKEN'

# 二维码跳转链接
QR_REDIRECT_LINK = 'https://open.work.weixin.qq.com/wwopen/sso/qrConnect?appid={}&agentid={}&redirect_uri={}&state={}'


# 获取access_token链接
ACCESS_TOKEN_URL= 'https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid={}&corpsecret={}'

# 获取访问用户身份
WX_USER_INFO_URL = 'https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo?access_token={}&code={}'

# 获取用户详细身份信息
# WX_USER_URL = 'https://qyapi.weixin.qq.com/cgi-bin/user/get?access_token={}&userid={}'