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

import re
import json
import urlparse

from cachetools import cached, TTLCache
from django.conf import settings
from django.http import HttpResponse
from jinja2 import Template

from esb.bkcore.models import ESBBuffetComponent, ESBBuffetMapping
from esb.utils.base import RE_PATH_VARIABLE, PathVars, preprocess_path_tmpl
from common.errors import error_codes, CommonAPIError
from common.log import logger
from .base import BaseComponent


class BuffetComponentMaker(object):
    def __init__(self, db_buffet_comp_obj):
        self.obj = db_buffet_comp_obj

    def make_comp_class(self, base_class=None):  # noqa
        base_class = base_class or BaseComponent
        db_buffet_obj = self.obj
        registed_path = self.obj.registed_path
        system_name = db_buffet_obj.system.name if db_buffet_obj.system else "BUFFET"

        class BuffetComponent(base_class):
            """
            自助接入组件的虚拟component class
            """

            sys_name = system_name

            def get_dest_request_method(self, db_buffet_obj):
                """
                获取应该用于请求第三方的请求类型

                :param db_buffet_obj: ESBBuffetComponent 实例
                """
                dest_http_method = db_buffet_obj.dest_http_method
                # 检查是否透传原始请求类型
                if dest_http_method == "_ORIG":
                    dest_http_method = self.request.wsgi_request.method
                return dest_http_method

            def handle(self):
                # 将用户传入的头信息传递给第三方接口
                req_headers = self.request.headers

                extra_headers = db_buffet_obj.get_extra_headers()

                dest_http_method = self.get_dest_request_method(db_buffet_obj)

                parsed_url = urlparse.urlparse(db_buffet_obj.dest_url)
                host = "%s://%s" % (parsed_url.scheme, parsed_url.netloc)

                # 替换目标地址中的变量模板
                path = parsed_url.path
                if RE_PATH_VARIABLE.search(parsed_url.path):
                    try:
                        path = parsed_url.path.format(**self.request.path_vars.val_dict)
                    except KeyError as e:
                        raise error_codes.BUFFET_CANNOT_FORMAT_PATH.format_prompt("{%s}" % e.args[0])

                # 拼装请求参数
                params, data = None, None
                if dest_http_method == "GET":
                    params = self.request.get_clean_params()
                elif dest_http_method == "POST":
                    # 目前支持的 Content-Type: form/json
                    if db_buffet_obj.favor_post_ctype == "form":
                        data = self.request.get_clean_params(ctype="form")
                        self.update_header_content_type(
                            extra_headers, content_type="application/x-www-form-urlencoded"
                        )
                    else:
                        data = self.request.get_clean_params(ctype="json")
                        self.update_header_content_type(extra_headers, content_type="application/json")

                headers = {}
                headers.update(req_headers)
                headers.update(extra_headers)
                headers.update(
                    {
                        "Bk-Username": self.current_user.username,
                    }
                )
                response = self.outgoing.http_client.request(
                    dest_http_method,
                    host,
                    path,
                    params=params,
                    data=data,
                    headers=headers,
                )

                if isinstance(response, basestring):
                    response = HttpResponse(response, content_type="application/json; charset=utf-8")
                elif isinstance(response, dict):
                    # 调整自助接入的 result 的默认数据
                    response.setdefault("result", None)
                self.response.payload = response

            def update_header_content_type(self, headers, content_type):
                """
                :访问后端接口，更新headers中Content-Type
                """
                headers_keys = [key.lower() for key in headers.keys()]
                if not ("content-type" in headers_keys or "content_type" in headers_keys):
                    headers.update({"Content-Type": content_type})
                return headers

            def apply_mappings(self, mapping_id, _input, _output=None):
                """
                使用设置好的 Mapping 来重新处理输入输出

                :param str mapping_id: ESBBuffetMapping 主键
                :param dict _input: 请求参数
                :param dict _output: 响应结果
                :returns: 经过模板转换过的结果
                """
                mapping_obj = ESBBuffetMapping.objects.filter(id=mapping_id).first()
                if not mapping_obj:
                    # INFO: 因为目前使用该方法的只有 _input 和 _output，目前优先返回 _output
                    return _output or _input

                try:
                    result = Template(mapping_obj.source).render(
                        _input=_input,
                        _output=_output,
                        # Custom funcitons
                        json=json.dumps,
                    )
                    result = json.loads(result)
                except Exception:
                    logger.exception(
                        "Error occoured when apply mapping[%s], _input=%s, _output=%s", mapping_id, _input, _output
                    )
                    raise CommonAPIError("An error occurred in mapping of template. Please contact the developer")
                return result

            @classmethod
            def get_component_name(cls):
                """
                目前的component name根据注册到的路径动态生成
                """
                name_by_path = registed_path.strip("/").lower().replace("/", ".")
                # 当路径以 sys_name 开头时，不包含系统名称
                if name_by_path.startswith(cls.sys_name.lower()):
                    return name_by_path
                return "%s.%s" % (cls.sys_name, name_by_path)

        return BuffetComponent


def make_buffet_component_class(buffet_comp_obj, *args, **kwargs):
    """
    根据配置好的ESBBuffetComponent实例生成一个组件
    """
    return BuffetComponentMaker(buffet_comp_obj).make_comp_class(*args, **kwargs)


class BuffetComponentManager(object):
    """
    Manager for buffet components
    """

    VALID_HTTP_METHODS = ("GET", "POST", "PUT", "DELETE")

    @cached(
        cache=TTLCache(
            maxsize=getattr(settings, "ESB_ALL_BUFFET_COMPONENTS_CACHE_MAXSIZE", 10),
            ttl=getattr(settings, "ESB_ALL_BUFFET_COMPONENTS_CACHE_TTL_SECONDS", 300),
        )
    )
    def get_all_buffet_components(self):
        """
        从数据库中查询出所有的自助接入组件，并将其注册路径转换为正则表达式

        :returns: 包含 obj, re_path 的字典列表
        """
        return [
            {
                "obj": obj,
                # 将数据库中注册的路径处理为正则表达式
                "re_path": re.compile(r"^%s$" % preprocess_path_tmpl(obj.registed_path)),
            }
            for obj in ESBBuffetComponent.objects.all()
        ]

    @cached(
        cache=TTLCache(
            maxsize=getattr(settings, "ESB_BUFFET_COMPONENT_CACHE_MAXSIZE", 1000),
            ttl=getattr(settings, "ESB_BUFFET_COMPONENT_CACHE_TTL_SECONDS", 300),
        )
    )
    def search_buffet_component(self, path, method):
        """
        根据当前路径寻找自助接入对象

        :param str path: 当前请求的路径
        :param str method: 当前请求类型
        :returns: ESBBuffetComponent 对象
        """
        for value in self.get_all_buffet_components():
            matched_obj = value["re_path"].match(path)
            obj = value["obj"]
            if matched_obj and obj.registed_http_method == method:
                # 把匹配到的path变量作为结果返回
                return value, PathVars.from_matched_obj(matched_obj)
            else:
                continue
        return None, None


_buffet_comp_manager = None


def get_buffet_comp_manager():
    """
    获取当前的buffet_comp_manager
    """
    global _buffet_comp_manager
    if _buffet_comp_manager is None:
        manager = BuffetComponentManager()
        _buffet_comp_manager = manager
    return _buffet_comp_manager
