# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
import json

from common.log import logger_api, logger
from common.base_utils import datetime_format


class BasicRequestLogger(object):
    """
    Basic Request Logger
    """

    def write(self, request, response):
        # 记录原始的请求参数，而不是被修改过的kwargs
        if 'kwargs_copy' in request.g:
            kwargs = request.g.kwargs_copy
        else:
            kwargs = request.g.kwargs
        msecs_cost = (request.g.ts_request_end - request.g.ts_request_start) * 1000
        if isinstance(response, dict):
            message = response and response.get('message', '')
        else:
            message = ''

        try:
            request_log = {
                'message': 'ESB request finished, method=%s system=%s component=%s' % (
                    request.method, request.g.system_name, request.g.component_alias_name),
                'type': 'pyls-comp-request',
                'request_id': request.g.request_id,
                'req_app_code': request.g.get('app_code', ''),
                'req_username': request.g.get('current_user_username', ''),
                'req_system_name': request.g.system_name,
                'req_component_name': request.g.component_alias_name,
                'req_client_ip': request.g.client_ip,
                'req_params': json.dumps(kwargs),
                'req_use_test_env': request.g.use_test_env,
                'req_status': request.g.component_status,
                'req_message': message,
                'req_msecs_cost': int(msecs_cost),
                'req_start_time': datetime_format(request.g.ts_request_start),
                'req_end_time': datetime_format(request.g.ts_request_end),
            }
            # Log to logstash, type="pyls-comp-request"
            logger_api.info(json.dumps(request_log))
        except Exception, e:
            logger.warning('logger reqeust exception: %s' % e)
