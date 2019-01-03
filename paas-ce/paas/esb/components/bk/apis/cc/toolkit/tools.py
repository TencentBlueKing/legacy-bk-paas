# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
import urllib
import copy

from common.log import logger
from common.errors import CommonAPIError, error_codes
from esb.utils.func_ctrl import FunctionControllerClient

from . import configs


class CCClient(object):

    def __init__(self, component):
        self.http_client = component.outgoing.http_client

        self.app_code = component.request.app_code
        self.bk_username = component.current_user.username
        self.bk_supplier_account = component.request.kwargs.get('bk_supplier_account') or \
            configs.DEFAULT_BK_SUPPLIER_ACCOUNT

    def request(self, method, host, path, params=None, data=None, headers={}, **kwargs):
        headers = copy.copy(headers)
        headers.update({
            'BK_USER': self.bk_username,
            'HTTP_BK_SUPPLIER_ACCOUNT': self.bk_supplier_account,
        })
        return self.http_client.request(method, host, path, params=params, data=data, headers=headers, **kwargs)

    def post_request(self, host, path, data=None, headers_json=True, **kwargs):
        headers = {}
        if not headers_json:
            headers = {'Content-type': 'application/x-www-form-urlencoded'}
            data = urllib.urlencode(data)
        response = self.request('POST', host, path, data=data, headers=headers, **kwargs)
        try:
            code = str(response['code'])
        except:
            logger.exception('response: %s', response)
            raise CommonAPIError(
                'An exception occurred while requesting CC interface, '
                'please contact the component developer to handle it.')

        if code != '0':
            return {
                'result': False,
                'message': response.get('extmsg') or response.get('msg') or 'An unknown error occurred',
                'error': {
                    'error_data': {
                        'api_spec': response
                    }
                }
            }
        else:
            return {'result': True, 'data': response.get('data')}

    def verify_app_can_use_superadmin(self):
        """校验app是否可以使用开发商账号superadmin"""
        if self.bk_supplier_account == 'superadmin' and \
                not CmdbFunctionControllerClient.is_allowed_use_superadmin(self.app_code):
            raise error_codes.APP_PERMISSION_DENIED.format_prompt(
                'APP [bk_app_code=%s] is not allowed to use the bk_supplier_account' % self.app_code)


class CmdbFunctionControllerClient(FunctionControllerClient):

    @classmethod
    def is_allowed_use_superadmin(cls, app_code):
        """是否允许app使用开发商账号superadmin"""
        switch_status, wlist = cls._get_func_ctrl_by_code('cmdb::verify_superadmin::allowed_app')
        if switch_status and app_code not in wlist:
            return False
        else:
            return True
