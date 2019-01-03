# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
import copy

ERROR_CODE_PREFIX_SYSTEM = '0'
ERROR_CODE_PREFIX_THIRD_PARTY = '1'


def wrap_error_code(code):
    """
    包装第三方系统返回的错误代码
    """
    return ERROR_CODE_PREFIX_THIRD_PARTY + str(code)


class BaseException(Exception):
    pass


class RequestThirdPartyException(BaseException):
    """
    当请求第三方系统时抛出的异常
    """

    def __init__(self, raw_exc, system_name, interface_name):
        self.raw_exc = raw_exc
        self.system_name = system_name
        self.interface_name = interface_name

    def __str__(self):
        return u'Component request third-party system [%s] interface [%s] error: %s, '\
            'please try again later or contact component developer to handle this'\
            % (self.system_name, self.interface_name, self.raw_exc.message)

    def get_message(self):
        """
        返回到终端用户的错误信息
        """
        return u'Component request third-party system [%s] interface [%s] error: %s, '\
            'please try again later or contact component developer to handle this'\
            % (self.system_name, self.interface_name, self.raw_exc.message)


class RequestSSLException(BaseException):
    """SSL错误，明确错误信息
    """
    def __init__(self, raw_exc, system_name, interface_name):
        self.raw_exc = raw_exc
        self.system_name = system_name
        self.interface_name = interface_name

    def __str__(self):
        return self.get_message()

    def get_message(self):
        """
        返回到终端用户的错误信息
        """
        if isinstance(self.raw_exc.cert, tuple):
            self.raw_exc.cert = u', '.join(self.raw_exc.cert)
        return u'Component request third-party system [%s] interface [%s] SSL error: '\
            'SSL configuration file [%s] does not exist or is illegal, '\
            'please get the certificates from the documentation and unzip it into [%s]' % (
                self.system_name, self.interface_name, self.raw_exc.cert, self.raw_exc.SSL_ROOT_DIR)


class TestHostNotFoundException(BaseException):
    """
    当以测试环境访问没有host_test的SmartHost时抛出
    """
    pass


class RequestBlockedException(BaseException):
    """
    当前请求被屏蔽之后抛出的异常
    """
    pass


class APIError(BaseException):
    """
    API Error
    """
    def __init__(self, code):
        self.code = code
        BaseException.__init__(self, code.prompt)

    def __str__(self):
        return "<APIError %s[%s]: %s>" \
            % (self.code.status, self.code.code, self.code.prompt)

    def format_prompt(self, prompt=None, replace=False, args=(), kwargs={}):
        """
        Using a customized prompt for this ErrorCode
        """
        self.code = copy.copy(self.code)
        if prompt:
            if replace:
                self.code.prompt = prompt
            else:
                self.code.prompt += ', %s' % prompt

        # Render prompt string
        if args:
            self.code.prompt = self.code.prompt % args
        if kwargs:
            self.code.prompt = self.code.prompt % kwargs
        return self


class ErrorCode(object):
    """
    Error Code class
    """

    def __init__(self, code_name, code, prompt, status=200):
        self.code_name = code_name
        self.code = code
        self.prompt = prompt
        self.status = status

    def as_dict(self):
        return {
            'result': False,
            'code': self.code,
            'data': None,
            'message': self.prompt
        }


class ErrorCodes(object):
    """
    错误代码规范
        7位整数，13代表蓝鲸PaaS，06代表ESB，最后3位可自定义

        1306xxx
    """

    error_codes = (
        # 13063xx, user error
        ErrorCode('OPERATOR_REQUIRED', 1306401, 'You must specify the current operator'),
        ErrorCode('USER_PERMISSION_DENIED', 1306402, 'User permission is insufficient'),
        ErrorCode('APP_PERMISSION_DENIED', 1306403, 'APP permission is insufficient'),
        ErrorCode('COMPONENT_NOT_FOUND', 1306404, 'Not found, component class not found'),
        ErrorCode('INACTIVE_CHANNEL', 1306405, 'Not found, inactive channel'),
        ErrorCode('ARGUMENT_ERROR', 1306406, 'Parameters error'),
        ErrorCode('BUFFET_CANNOT_FORMAT_PATH', 1306407, "The component's destination request path cannot be formatted"),
        ErrorCode('RATE_LIMIT_RESTRICTION', 1306429, 'Access frequency limit'),

        # 通用错误编码，用于目前系统中没有错误code的情况
        ErrorCode('COMMON_ERROR', 1306000, 'System error'),

        # 13062xx, 第三方系统错误
        ErrorCode('REQUEST_THIRD_PARTY_ERROR', 1306201, 'Request third-party interface error'),
        ErrorCode('REQUEST_SSL_ERROR', 1306203, 'Request third-party interface error'),
        ErrorCode('TEST_HOST_NOT_FOUND', 1306206, 'Error, the component does not support access third-party test environment'),  # noqa
        ErrorCode('REQUEST_BLOCKED', 1306207, 'Request to the third-party system is blocked'),
        ErrorCode('THIRD_PARTY_RESULT_ERROR', 1306208, '%s system interface results in an unknown format'),
        ErrorCode('REQEUST_DEST_METHOD_ERROR', 1306209, 'The system interface does not support the request method'),
    )

    # Init dict
    _error_codes_dict = {}
    for error_code in error_codes:
        _error_codes_dict[error_code.code_name] = error_code

    def __getattr__(self, code_name):
        error_code = self._error_codes_dict[code_name]
        return APIError(error_code)


class RequestThirdPartyErrorCodes(object):
    """
    请求第三方系统错误代码
    """

    error_codes = {
        'STATUS_CODE_500': 'Third-party system internal error',
        'STATUS_CODE_502': 'Third-party system Bad Gateway',

        'STATUS_CODE_403': 'Third-party system prohibit access to this interface',
        'STATUS_CODE_404': 'Third-party system does not find this interface',

        'STATUS_CODE_302': 'Third-party system redirects this interface',
    }


error_codes = ErrorCodes()
request_third_party_error_codes = RequestThirdPartyErrorCodes()


class CommonAPIError(APIError):
    """
    Shortcut for returning an error response
    """

    def __init__(self, message, error_code=None, status=None):
        """
        初始化一个常用的通用错误

        :param str message: 自定义的错误消息
        :param str error_code: 返回到相应的错误代码，默认 1306000
        """
        self.message = message
        code = error_codes.COMMON_ERROR.format_prompt(message, replace=True).code
        if error_code:
            code.code = error_code
        if status:
            code.status = status

        super(CommonAPIError, self).__init__(code)
