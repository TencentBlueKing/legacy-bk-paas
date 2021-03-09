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

import json
import time
import base64
import hashlib
import hmac

from django.utils.translation import ugettext as _

from app.models import App
from common.log import logger


"""API接口签名类"""


class Sign(object):
    """
    签名类
    """

    def __init__(self, request):
        self.request = request
        self.host = request.get_host()
        self.url = request.path
        self.method = request.method

        self.clean_field = ["clean_nonce", "clean_timestamp", "clean_signature"]

    def clean_nonce(self):
        """
        nonce 参数合法性校验
        """
        nonce = self.request.GET.get("Nonce")
        if not nonce:
            raise ValueError(_(u"Nonce不存在"))
        try:
            _nonce = int(nonce)
        except ValueError:
            raise ValueError(_(u"Nonce非法"))
        # 验证 -231 非法
        if _nonce <= 0:
            raise ValueError(_(u"Nonce非法, 必须是正整数"))
        # 验证 0111 非法
        if nonce != str(_nonce):
            raise ValueError(_(u"Nonce非法, 开头不能有0字符"))
        self.nonce = nonce
        return nonce

    def clean_timestamp(self):
        """
        时间戳 参数合法性校验
        """
        timestamp = self.request.GET.get("Timestamp")
        if not timestamp:
            raise ValueError(_(u"Timestamp不存在"))
        try:
            _timestamp = int(timestamp)
        except ValueError:
            raise ValueError(_(u"Timestamp非法, 非时间戳格式"))

        if _timestamp > int(time.time()) + 300:
            raise ValueError(_(u"Timestamp非法, 时间戳错误"))

        if _timestamp < int(time.time()) - 300:
            raise ValueError(_(u"Timestamp非法, 时间戳已过期"))

        if timestamp != str(_timestamp):
            raise ValueError(_(u"Timestamp非法, 开头不能有0字符"))
        self.timestamp = timestamp
        return timestamp

    def clean_signature(self):
        signature = self.request.GET.get("Signature")
        if not signature:
            raise ValueError(_(u"Signature不存在"))
        self.signature = signature
        return signature

    def _clean_app_code(self):
        app_code = self.request.GET.get("app_code")
        if not app_code:
            raise ValueError(_(u"app_code不存在"))
        try:
            app = App.objects.get(code=app_code)
        except App.DoesNotExist:
            raise ValueError(_(u"app[%s]不存在") % app_code)
        return app

    def get_app_token(self):
        app = self._clean_app_code()
        return app.auth_token

    def compute_signature(self, method, host, url, params, secret_key):
        """
        生成签名
        """
        params = "&".join(["%s=%s" % (i, params[i]) for i in sorted(params)])
        message = "%s%s%s?%s" % (method, host, url, params)
        digest_make = hmac.new(str(secret_key), str(message), hashlib.sha1).digest()
        _signature = base64.b64encode(digest_make)
        return _signature

    def clean_get(self):
        params = dict(self.request.GET.items())
        params.pop("Signature", None)
        return params

    def clean_post(self):
        params = dict(self.request.GET.items())
        params.pop("Signature", None)
        params["Data"] = self.request.body
        # request.POST中无参数，则将request.body中的push进request.POST中
        if not len(self.request.POST):
            try:
                data = json.loads(self.request.body)
                self.request.POST.update(data)
            except Exception as error:
                # APP_MAKER解析json串出错
                logger.error(u"APP_MAKER decode json string fail：%s" % error)
        return params

    def clean(self):
        for i in self.clean_field:
            _clean = getattr(self, i, lambda x: x)
            _clean()

        secret_key = self.get_app_token()

        if self.method == "GET":
            params = self.clean_get()
        elif self.method == "POST":
            params = self.clean_post()
        else:
            raise ValueError(_(u"只支持GET, POST"))

        _signature = self.compute_signature(self.method, self.host, self.url, params, secret_key)
        if _signature != self.signature:
            raise ValueError(_(u"Signature非法"))
        return True
