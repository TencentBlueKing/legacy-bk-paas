# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
import os
import functools

from django.conf import settings
from django.http import Http404

from common.errors import error_codes
from common.constants import API_TYPE_OP
from esb.channel import get_channel_manager
from esb.channel.confapis import get_confapis_channel_manager
from esb.component import get_components_manager
from esb.component.buffet import get_buffet_comp_manager


# 把当前目录切换到项目目录，因为后面用到的路径都是相对路径
try:
    os.chdir(settings.BASE_DIR)
except Exception:
    pass


def router_view(channel_type, request, path):
    components_manager = get_components_manager()
    channel_manager = get_channel_manager()

    # Get ESBChannel by path
    path = '/%s/' % path.strip('/')
    path = channel_manager.get_rewrite_path_by_path(path) or path
    request.g.comp_path = path

    channel_conf = get_channel_conf(path, request)
    esb_channel = channel_conf['channel']
    # Check if channel is active
    if not esb_channel.is_active:
        raise error_codes.INACTIVE_CHANNEL

    # Check if channel's component class exists
    comp_cls = components_manager.get_comp_by_name(esb_channel.component_codename)
    if not comp_cls:
        raise error_codes.COMPONENT_NOT_FOUND.format_prompt(esb_channel.component_codename)

    # Dynamic contribute channel object
    channel_class = channel_conf['classes'][channel_type]
    channel_obj = channel_class(
        comp_cls, path=path, is_active=True,
        comp_conf=channel_conf.get('comp_conf'),
        channel_conf=channel_conf.get('channel_conf', {}),
    )

    # 判断该channel是否拥有自定义的validators
    if getattr(esb_channel, 'request_validators', None) is not None:
        channel_obj.set_request_validators(esb_channel.request_validators)
    if getattr(esb_channel, 'append_request_validators', None) is not None:
        channel_obj.append_request_validators(esb_channel.append_request_validators)

    # 超时时间处理
    try:
        timeout_time = timeout_handler(esb_channel, comp_cls)
    except Exception:
        timeout_time = settings.REQUEST_TIMEOUT_SECS
    # 针对本次请求存储timeout和系统名
    # 系统名用于访问频率控制
    request.g.timeout = timeout_time
    request.g.sys_name = comp_cls.sys_name

    return channel_obj.handle_request(request)


def get_channel_conf(path, request):
    channel_manager = get_channel_manager()

    # path_vars为路径匹配过程中路径变量，通过正则定义
    channel_conf = channel_manager.get_channel_by_path(path, request.method)
    if channel_conf:
        return channel_conf

    # 添加可变参数的正则匹配
    channel_conf, path_vars = channel_manager.search_channel_by_repath(path, request.method)
    if channel_conf:
        request.g.path_vars = path_vars
        return channel_conf

    # 检查 confapis 中，官方第三方系统定义的API
    confapis_channel_manager = get_confapis_channel_manager()
    channel_conf = confapis_channel_manager.get_channel_by_path(path, request.method)
    if channel_conf:
        return channel_conf

    # 添加可变参数的正则匹配
    channel_conf, path_vars = confapis_channel_manager.search_channel_by_repath(path, request.method)
    if channel_conf:
        request.g.path_vars = path_vars
        return channel_conf

    raise Http404


def timeout_handler(esb_channel, comp_cls):
    # 保存超时时间，API类型以文件中标识为准，如果文件中不存在，则以数据库为准
    timeout_time = esb_channel.timeout_time
    execute_timeout = esb_channel.component_system.execute_timeout
    query_timeout = esb_channel.component_system.query_timeout
    # 获取系统级别的超时时间
    if not timeout_time:
        if comp_cls.api_type != 'unknown':
            timeout_time = execute_timeout if comp_cls.api_type == API_TYPE_OP else query_timeout
        else:
            timeout_time = execute_timeout if esb_channel.type == 1 else query_timeout
    return timeout_time


api_router_view = functools.partial(router_view, 'api')


def buffet_component_view(request, path):
    """
    处理自助接入组件的View
    """
    from esb.component.buffet import make_buffet_component_class

    channel_manager = get_channel_manager()
    buffet_comp_manager = get_buffet_comp_manager()

    path = '/%s/' % path.strip('/')
    request.g.comp_path = path

    buffet_comp_conf, path_vars = buffet_comp_manager.search_buffet_component(path, request.method)
    if not buffet_comp_conf:
        raise Http404

    buffet_comp_obj = buffet_comp_conf['obj']
    request.g.path_vars = path_vars

    # 动态生成一个component class
    comp_cls = make_buffet_component_class(buffet_comp_obj)
    if not comp_cls:
        raise error_codes.COMPONENT_NOT_FOUND

    channel_class = channel_manager.get_default_channel_classes()['api']
    channel_obj = channel_class(comp_cls, path=path, is_active=True)

    # 针对本次请求存储
    try:
        timeout_time = timeout_handler_for_buffet(buffet_comp_obj)
    except Exception:
        timeout_time = settings.REQUEST_TIMEOUT_SECS
    request.g.timeout = timeout_time

    return channel_obj.handle_request(request)


def timeout_handler_for_buffet(comp_obj):
    """针对自助接入接口的超时时间"""
    timeout_time = comp_obj.timeout_time
    if not timeout_time:
        if comp_obj.type == 2:
            timeout_time = comp_obj.system.query_timeout
        else:
            timeout_time = comp_obj.system.execute_timeout
    return timeout_time
