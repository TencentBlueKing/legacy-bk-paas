# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
from .base import BasePerm
from common.errors import error_codes


class CCPerm(BasePerm):

    def assert_app_perm(self, app_id):
        if str(app_id) not in self.get_user_allowed_cc_app():
            raise error_codes.USER_PERMISSION_DENIED.format_prompt(
                'The current user has no permission to access [%s] business data, please apply for permissions.'
                % app_id)
