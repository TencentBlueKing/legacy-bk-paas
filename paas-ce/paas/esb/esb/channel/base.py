# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
import re
import copy
import time
import uuid
import string
import json

from django.http import HttpResponse

from esb.bkcore.models import ESBChannel
from esb.component import CompRequest
from esb.utils import config
from esb.utils.base import PathVars, preprocess_path_tmpl, has_path_vars
from esb.response import format_resp_dict
from common.log import logger
from common.base_utils import FancyDict, get_request_params, str_bool, get_client_ip
from common.base_validators import ValidationError
from common.django_utils import JsonResponse
from common.constants import COMPONENT_STATUSES
from common.bkerrors import bk_error_codes
from common.errors import (error_codes, CommonAPIError, APIError, RequestThirdPartyException,
                           TestHostNotFoundException, RequestBlockedException, RequestSSLException)


class BaseChannel(object):
    """
    Base Channel class for handle django request, port a request to django
    """

    request_loggers = []
    request_validators = []

    channel_type = None

    IGNORE_HEADERS = (
        'HTTP_X_BKAPI_AUTHORIZATION',
        'HTTP_X_REQUEST_URI',
        'HTTP_HOST',
    )

    def __init__(self, comp_class, path, is_active=True, request_loggers=None,
                 request_validators=None, comp_conf=None, channel_conf=None):
        """
        Init a channel object

        :param component_class: Component class used to handle this request
        :param str path: request path for this channel
        :param bool is_active: if this channel is active, default to True
        :param request_loggers: extra request loggers for `common_api_class`
        :param request_validators: extra request validators for `common_api_class`
        :param channel_conf: channel perm_level, rate_limit_conf config
        """
        self.comp_class = comp_class
        self.comp = self.comp_class()
        self.comp_conf = comp_conf
        self.channel_conf = channel_conf or {}

        # 对于支持加载自定义配置的组件，调用 setup_conf 方法
        if hasattr(self.comp, 'setup_conf') and self.comp_conf:
            self.comp.setup_conf(copy.deepcopy(self.comp_conf))

        self.path = path
        self.is_active = is_active

        # 如果使用 += 会造成修改到原有默认变量的bug
        self.request_loggers = self.request_loggers + (request_loggers or [])
        self.request_validators = self.request_validators + (request_validators or [])

    def set_request_validators(self, validators):
        self.request_validators = validators

    def append_request_validators(self, validators):
        self.request_validators = self.request_validators + validators

    def request_id_generator_func(self, request):
        """
        create request_id
        """
        return uuid.uuid4().get_hex()

    def validate_request(self, request):
        """
        Use specified validators to validate incoming request
        """
        for validator in self.request_validators:
            try:
                validator.validate(request)
            except ValidationError, e:
                raise CommonAPIError(e.message)

    def log_request(self, request, response):
        """
        Write request logs if needed
        """
        for req_logger in self.request_loggers:
            req_logger.write(request, response)

    def patch_request_common(self, request):
        """
        Patch the incoming django request instance and set a lot of useful
        variables
        """
        request.g.system_name = self.comp.sys_name
        request.g.component_name = self.comp.get_component_name()
        request.g.component_alias_name = self.comp.get_alias_name()
        request.g.client_ip = get_client_ip(request)
        request.g.request_id = self.request_id_generator_func(request)
        request.g.component_status = COMPONENT_STATUSES.EXECUTING
        request.g.channel_type = self.channel_type
        request.g.use_test_env = self.get_use_test_env(request)
        request.g.api_type = self.comp.api_type
        request.g.headers = self.get_headers(request)
        request.g.channel_conf = self.channel_conf

        # To be override
        request.g.kwargs = FancyDict()

    def get_use_test_env(self, request):
        """
        Decide access test env or not to third-party system

        - pass "x-use-test-env" in header
        """
        header_flag = request.META.get('HTTP_X_USE_TEST_ENV')
        if header_flag is not None:
            return str_bool(header_flag)
        return False

    def get_headers(self, request):
        """"""
        headers = {}
        for key, value in self.request.META.iteritems():
            if key.startswith('HTTP_') and value and key not in self.IGNORE_HEADERS:
                headers[self.capitalize_header(key[5:])] = value
        return headers

    @staticmethod
    def capitalize_header(header):
        """capitalize django header
        """
        return '-'.join(string.capitalize(s) for s in header.split('_'))

    def handle_request(self, request):
        """
        Handle the incoming request, often called by route view

        :param request: request object from django
        """
        self.request = request
        self.patch_request_common(self.request)

        try:
            # Hook before request, before_handle_request may return response,
            # if it returns a response, do not call component then.
            response = self.before_handle_request()
            if not response:
                self.validate_request(request)

                self.comp.set_request(CompRequest(wsgi_request=request))

                response = self.comp.invoke()
        except APIError, e:
            response = e.code.as_dict()
            request.g.component_status = COMPONENT_STATUSES.ARGUMENT_ERROR
        except RequestThirdPartyException, e:
            response = error_codes.REQUEST_THIRD_PARTY_ERROR.format_prompt(e.get_message(), replace=True).code.as_dict()
            request.g.component_status = COMPONENT_STATUSES.EXCEPTION
        except RequestSSLException, e:
            response = error_codes.REQUEST_SSL_ERROR.format_prompt(e.get_message(), replace=True).code.as_dict()
            request.g.component_status = COMPONENT_STATUSES.EXCEPTION
        except TestHostNotFoundException, e:
            response = error_codes.TEST_HOST_NOT_FOUND.code.as_dict()
            request.g.component_status = COMPONENT_STATUSES.EXCEPTION
        except RequestBlockedException, e:
            response = error_codes.REQUEST_BLOCKED.format_prompt(e.message).code.as_dict()
            request.g.component_status = COMPONENT_STATUSES.EXCEPTION
        except:
            logger.exception('Request exception, request_id=%s, path=%s' % (request.g.request_id, request.path))
            response = CommonAPIError('Component error, please contact the component developer to handle it.')\
                .code.as_dict()
            request.g.component_status = COMPONENT_STATUSES.EXCEPTION
        else:
            if response and isinstance(response, dict) and response.get('result'):
                request.g.component_status = COMPONENT_STATUSES.SUCCESS
            else:
                request.g.component_status = COMPONENT_STATUSES.FAILURE

        self.response = response
        self.request.g.ts_request_end = time.time()
        self.log_request(self.request, self.response)
        # Hook after request
        self.after_handle_request()

        # Turn dict response to django response
        if isinstance(self.response, dict):
            self.response['request_id'] = request.g.request_id
            self.response = format_resp_dict(self.response)
            self.response = JsonResponse(self.response)
        elif not isinstance(self.response, (HttpResponse, str)):
            self.response = JsonResponse(self.response)
        return self.response

    def before_handle_request(self):
        """
        Called before request is handled by component,
        if it return a reponse dict, no more component will be called
        """
        pass

    def after_handle_request(self):
        """
        Called after request has been handled by component,
        it may modify self.response object
        """
        pass


class ApiChannel(BaseChannel):
    """
    Channel class for pure API type
    """

    channel_type = 'api'

    def before_handle_request(self):
        self.request.g.kwargs = FancyDict(get_request_params(self.request))
        # request.g.kwargs 之后会被修改，为了保留最原始的请求参数，创建一个copy
        self.request.g.kwargs_copy = copy.copy(self.request.g.kwargs)
        self.request.g.request_type = 'app'

        if not self.request.g.get('app_code'):
            self.request.g.app_code = self.request.g.kwargs.get('bk_app_code') or self.request.g.kwargs.get('app_code', '')  # noqa

    def after_handle_request(self):
        pass


class ChannelManager(object):
    """
    Manager for Channels, query database to find the matching channel.
    """

    def __init__(self, ):
        """
        :preset_channels example:
        {
            "GET": {
                "/cc/add_plat_id/": {
                    "raw_path": "/cc/add_plat_id/",
                    "re_path": re_obj,
                    "channel": esb_channel_obj,
                    "classes": {"api": None},
                    "comp_conf": {},
                    "channel_conf": {},
                }
            }
        }
        """
        self.preset_channels = {}
        self.preset_channels_with_path_vars = {}
        self.default_channel_classes = None
        self.rewrite_channels = {}

    def __str__(self):
        return '<ChannelManager>'

    def set_default_channel_classes(self, value):
        self.default_channel_classes = value

    def get_default_channel_classes(self):
        return self.default_channel_classes

    def get_channel_by_path(self, path, method):
        """
        根据路径获取对应的channel配置

        :param str path: 需要查询的路径
        :param str method: HTTP请求的方法
        :returns dict: 包含当前channel和channel_classes的字典
        """
        if not path.startswith('/'):
            path = '/%s' % path

        channel = None
        # 处理path最后有无斜杠两种情况
        path_another = path.rstrip('/') if path.endswith('/') else '%s/' % path
        for _path in (path, path_another):
            channel = ESBChannel.objects.filter(path=_path).first()
            # 从数据库查询出来需要为结果添加channel_classes
            if channel:
                try:
                    comp_conf = json.loads(channel.comp_conf) if channel.comp_conf else None
                    if isinstance(comp_conf, (tuple, list)):
                        comp_conf = dict(comp_conf)
                except:
                    logger.error('%s channel comp_conf is not a json string. channel path=%s',
                                 bk_error_codes.COMPONENT_COMP_CONF_ERROR.code, _path)
                    comp_conf = None
                try:
                    channel_conf = channel.channel_conf
                except:
                    logger.error('get channel channel_conf error. channel path=%s', _path)
                    channel_conf = None

                channel = {
                    'channel': channel,
                    'classes': self.get_default_channel_classes(),
                    'comp_conf': comp_conf,
                    'channel_conf': channel_conf,
                }
            # Find channel by hard-coded channels
            else:
                channel = self.preset_channels.get(method, {}).get(_path)

            if channel:
                return channel
        return channel

    def search_channel_by_repath(self, path, method):
        """
        根据正则匹配来查找对应的channel

        :param str path: 需要查询的路径
        :param str method: HTTP请求的方法
        :returns tuple:
            - value(dict): 包含当前channel和channel_classes的字典
            - path_vars(PathVars object): 路径匹配中获得的变量
        """
        if not path.startswith('/'):
            path = '/%s' % path

        channels = self.preset_channels_with_path_vars.get(method, {})
        for value in channels.values():
            matched_obj = value['re_path'].match(path)
            if matched_obj:
                # 把匹配到的path变量作为结果返回
                return value, PathVars.from_matched_obj(matched_obj)
        return None, None

    def get_rewrite_path_by_path(self, path):
        """
        不同版本 path 指向同一组件；现统一为重定向后的path
        """
        return self.rewrite_channels.get(path)

    def get_all_registed_channels(self):
        """
        罗列出目前所注册的所有channels
        """
        result = [
            {
                'raw_path': channel.path,
                'channel': channel,
                'classes': self.get_default_channel_classes(),
            }
            for channel in ESBChannel.objects.all()
        ]
        for channels in self.preset_channels.values():
            result.extend(channels.values())
        return result

    def register_channel_groups(self, channel_classes, channels, rewrite_channels):
        """
        注册一批channels

        :param dict channel_classes: 指定这批channel应该使用什么ChannelClass
        :param list channels: 由path到component的对应关系列表
        """
        self.rewrite_channels.update(rewrite_channels)

        method_delimiter = re.compile(r'\w+')
        for path, value in channels:
            channel = ESBChannel(path=path, component_codename=value['comp_codename'])

            # 设置自定义的 request_validators
            if 'request_validators' in value:
                channel.request_validators = value['request_validators']
            if 'append_request_validators' in value:
                channel.append_request_validators = value['append_request_validators']

            # 支持的方法，默认支持GET、POST
            method = value.get('method') or 'GET,POST'
            method = method_delimiter.findall(method)

            for m in method:
                self.preset_channels.setdefault(m, {})
                self.preset_channels_with_path_vars.setdefault(m, {})
                preset_channel = {
                    # 支持使用正则匹配
                    'raw_path': path,
                    're_path': re.compile(r'^%s$' % preprocess_path_tmpl(path)),
                    'channel': channel,
                    'classes': channel_classes,
                    'comp_conf': value.get('comp_conf'),
                    'channel_conf': value.get('channel_conf'),
                }
                self.preset_channels[m][path] = preset_channel
                if has_path_vars(path):
                    self.preset_channels_with_path_vars[m][path] = preset_channel


_channel_manager = None


def get_channel_manager():
    """
    获取当前channel_manager
    """
    global _channel_manager
    if _channel_manager is None:
        channel_config = config.ESB_CONFIG['config']
        manager = ChannelManager()
        # 配置中如果定义了默认的channel_classes,使用默认值
        default_channel_classes = channel_config.get('default_channel_classes')
        for group_name, channel_group_conf in channel_config['channel_groups'].items():
            manager.register_channel_groups(
                channel_group_conf['channel_classes'],
                channel_group_conf['preset_channels'],
                channel_group_conf.get('rewrite_channels', {})
            )
            # 使用default_channel_classes, 或'default'下channel_classes，或第一个碰到的channel_classes作为默认
            default_channel_classes = default_channel_classes or \
                channel_config['channel_groups'].get('default', {}).get('channel_classes') or \
                channel_group_conf['channel_classes']

        # 设置默认的channel_classes，专门用来处理数据库中没有设置channel_classes的ESBChannel对象
        manager.set_default_channel_classes(default_channel_classes)

        _channel_manager = manager
    return _channel_manager
