# -*- coding: utf-8 -*
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
from common.errors import error_codes


class BasePerm(object):

    def __init__(self, request, current_user):
        self.request = request
        self.current_user = current_user

    def get_user_allowed_cc_app(self):
        from components.bk.apis.cc.get_app_by_user import GetAppByUser
        result = GetAppByUser(current_user=self.current_user).invoke()
        if not result['result']:
            raise error_codes.USER_PERMISSION_DENIED.format_prompt(
                'Failed to get the business information of current user (%s) with permissions, please try again later.'
                % self.current_user.username)
        return [item['ApplicationID'] for item in result['data']]
