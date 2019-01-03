# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
import time
import hmac
import base64
import hashlib

from common.base_validators import BaseValidator, ValidationError
from common.errors import error_codes
from esb.exdb.bkpaas import AppSecureInfo


class AppAuthValidator(BaseValidator):

    def __init__(self, verified_type='signature_or_app_secret', *args, **kwargs):
        """
        :param str verified_type: 验证类型，支持"app_secret", "signature", "signature_or_app_secret"
        """
        self.verified_type = verified_type
        super(AppAuthValidator, self).__init__(*args, **kwargs)

    def validate(self, request):
        if self.verified_type == 'app_secret':
            validator = AppSecretValidator()
            validator.validate(request)
            return

        elif self.verified_type == 'signature':
            validator = SignatureValidator()
            validator.validate(request)
            return

        elif self.verified_type == 'signature_or_app_secret':
            signature = request.GET.get('bk_signature') or request.GET.get('signature')
            app_secret = request.g.kwargs.get('bk_app_secret') or request.g.kwargs.get('app_secret')
            if signature:
                validator = SignatureValidator()
                validator.validate(request)
            elif app_secret:
                validator = AppSecretValidator()
                validator.validate(request)
            else:
                raise ValidationError('Signature [bk_signature] and APP Secret [bk_app_secret] cannot be empty at the same time')  # noqa
            return
        else:
            raise ValidationError('Please choose a valid APP verification method')


class AppSecretValidator(BaseValidator):
    """
    Validate app_code and app_secret
    """

    def __init__(self, *args, **kwargs):
        super(AppSecretValidator, self).__init__(*args, **kwargs)

    def validate(self, request):
        kwargs = request.g.kwargs
        app_code = request.g.app_code
        app_secret = kwargs.get('bk_app_secret') or kwargs.get('app_secret')

        if not app_code:
            raise ValidationError('APP Code [bk_app_code] cannot be empty')

        if not app_secret:
            raise ValidationError('APP Secret [bk_app_secret] cannot be empty')

        app_info = AppSecureInfo.get_by_app_code(app_code)
        if not app_info:
            raise ValidationError('Invalid APP Code [bk_app_code=%s], please confirm if the APP Code has been registered' % app_code)  # noqa

        if app_secret not in app_info['secure_key_list']:
            raise ValidationError('APP Secret verification failed, pelase confirm if the APP Secret and APP Code [bk_app_code=%s] match' % app_code)  # noqa


class SignatureValidator(BaseValidator):
    """
    Validate signature
    """

    def __init__(self, *args, **kwargs):
        super(SignatureValidator, self).__init__(*args, **kwargs)

    def get_request_path(self, request):
        """
        为了应对使用proxy_pass拿不到完整path的情况，先尝试获取自定义头信息，再尝试 path_info
        """
        path = request.META.get('HTTP_X_REQUEST_URI', '').split('?')[0]
        if not path:
            path = request.META['PATH_INFO']
        return path

    def validate(self, request):
        # if skip signature verify
        if getattr(request, '__esb_skip_signature__', False):
            return

        req_get_params = dict(request.GET.items())

        # 将 signature 参数从参数字典中拿掉
        signature = req_get_params.pop('bk_signature', None) or req_get_params.pop('signature', None)
        if not signature:
            raise ValidationError('Signature [bk_signature] cannot be empty')

        app_code = request.g.app_code

        app_info = self.check_app_code(app_code)
        self.check_nonce(req_get_params.get('bk_nonce'))
        self.check_timestamp(req_get_params.get('bk_timestamp'))

        path = self.get_request_path(request)
        params = req_get_params.copy()
        if request.method == 'POST':
            params['data'] = request.body

        verify_result = self.verify_signature(request.method, path, params, signature, app_info['secure_key_list'])
        if not verify_result:
            raise ValidationError('Signature [bk_signature] verification failed, please provide valid parameters and signature')  # noqa

    def verify_signature(self, method, path, params, signature, valid_app_secret_list):
        """
        校验signature有效
        """
        # 校验signature
        req_params = '&'.join(['%s=%s' % (k, v) for k, v in
                               sorted(params.iteritems(), key=lambda x: x[0])])
        message = '%s%s?%s' % (method, path, req_params)
        for valid_app_secret in valid_app_secret_list:
            sign = base64.b64encode(hmac.new(str(valid_app_secret), message, hashlib.sha1).digest())
            if cmp(sign, signature) == 0:
                return True
        return False

    def check_app_code(self, app_code):
        """
        验证 app_code
        """
        if not app_code:
            raise ValidationError('APP Code [bk_app_code] cannot be empty')

        app_info = AppSecureInfo.get_by_app_code(app_code)
        if not app_info:
            raise ValidationError('Invalid APP Code [bk_app_code=%s], please confirm if the APP Code has been registered' % app_code)  # noqa
        return app_info

    def check_nonce(self, bk_nonce):
        """
        验证 bk_nonce
        """
        if not bk_nonce:
            raise ValidationError('Parameter bk_nonce does not exist')
        try:
            nonce = int(bk_nonce)
        except:
            raise ValidationError('Parameter bk_nonce is illegal')
        if nonce <= 0:
            raise ValidationError('Parameter bk_nonce is illegal, it must be a positive integer')
        return nonce

    def check_timestamp(self, bk_timestamp):
        """
        验证时间戳是否合法
        """
        if not bk_timestamp:
            raise ValidationError('Parameter bk_timestamp does not exist')
        try:
            timestamp = int(bk_timestamp)
        except:
            raise ValidationError('Parameter bk_timestamp is illegal, due to non-time format')

        # 有效期为300s
        if timestamp < int(time.time()) - 300:
            raise ValidationError('Parameter bk_timestamp is illegal, because it has expired')
        return timestamp


class AppCodeWhiteListValidator(BaseValidator):

    def __init__(self, white_list=(), *args, **kwargs):
        self.white_list = white_list
        super(AppCodeWhiteListValidator, self).__init__(*args, **kwargs)

    def validate(self, request):
        app_code = request.g.app_code
        if app_code not in self.white_list:
            raise error_codes.APP_PERMISSION_DENIED.format_prompt('APP [bk_app_code=%s] is forbidden to access this component' % app_code)  # noqa
