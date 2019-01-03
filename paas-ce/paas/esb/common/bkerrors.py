# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
"""
蓝鲸统一错误码处理
"""

bk_error_codes_conf = {
    'REDIS_CONNECTION_ERROR': {
        'code': '1306001',
        'reason': 'Redis connection failed',
        'solution': 'Check if the redis configuration is correct and if the service is normal',
    },

    'COMPONENT_REGISTER_ERROR': {
        'code': '1306101',
        'reason': 'Component code logic error, cannot be loaded',
        'solution': 'Check the code logic based on the exception message to exclude exceptions',
    },
    'COMPONENT_COMP_CONF_ERROR': {
        'code': '1306102',
        'reason': 'The component configuration in the component channel is not a valid JSON string',
        'solution': 'Check the component configuration, and the JSON string needs to be a dict or a list that can be converted to a dict',  # noqa
    },

    'REQUEST_THIRD_PARTY_ERROR': {
        'code': '1306201',
        'reason': 'An exception appeared while requesting a third-party system interface',
        'solution': 'Check if the third-party system interface service is normal',
    },
    'THIRD_PARTY_RESP_ERROR': {
        'code': '1306202',
        'reason': 'Return data from the third-party system interface is not a valid JSON string',
        'solution': 'Check if the third-party system interface service is normal',
    },
    'REQUEST_SSL_ERROR': {
        'code': '1306203',
        'reason': 'A SSLError occurred while requesting a third-party system interface',
        'solution': 'Check if the folder in the component configuration corresponding to SSL_ROOT_DIR exists, and if the certificates are valid',  # noqa
    },
    'REQUEST_GSE_ERROR': {
        'code': '1306204',
        'reason': 'An error occurred while accessing the system GSE interface',
        'solution': 'Check if the GSE system interface is normal',
    },
    'REQUEST_SMTP_ERROR': {
        'code': '1306205',
        'reason': 'An error occurred while accessing the SMTP email service',
        'solution': 'Check if the sending email component SMTP configuration is correct, and if the SMTP email service is normal',  # noqa
    },

    # thirt-party system error code
    'REQUEST_JOB_ERROR': {
        'code': 1306221,
        'reason': 'An error occurred while accessing the system JOB service',
        'solution': 'Check if the JOB system interface is normal',
    },
}


class ErrorCode(object):
    """
    Error Code class
    """

    def __init__(self, code_name, code, reason, solution):
        self.code_name = code_name
        self.code = code
        self.reason = reason
        self.solution = solution


class BkErrorCodes(object):

    def __init__(self):
        self._error_codes_dict = dict([
            (code_name, ErrorCode(code_name, **error_code))
            for code_name, error_code in bk_error_codes_conf.iteritems()
        ])

    def __getattr__(self, code_name):
        return self._error_codes_dict[code_name]


bk_error_codes = BkErrorCodes()
