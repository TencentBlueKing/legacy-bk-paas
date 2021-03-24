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

from builtins import object
import re
import json

from settings import SITE_URL
from django.conf import settings

from common.log import logger
from common.pxfilter import XssHtml
from common.redirect import redirect_403
from common.bk_iam import Permission, ActionEnum


def html_escape(html, is_json=False):
    """
    Replace special characters "&", "<" and ">" to HTML-safe sequences.
    If the optional flag quote is true, the quotation mark character (")
    is also translated.
    rewrite the cgi method
    @param html: html代码
    @param is_json: 是否为json串（True/False） ，默认为False
    """
    # &转换
    if not is_json:
        html = html.replace("&", "&amp;")  # Must be done first!
    # <>转换
    html = html.replace("<", "&lt;")
    html = html.replace(">", "&gt;")
    # 单双引号转换
    if not is_json:
        html = html.replace(" ", "&nbsp;")
        html = html.replace('"', "&quot;")
        html = html.replace("'", "&#39;")
    return html


def url_escape(url):
    url = url.replace("<", "")
    url = url.replace(">", "")
    url = url.replace(" ", "")
    url = url.replace('"', "")
    url = url.replace("'", "")
    return url


def texteditor_escape(str_escape):
    """
    富文本处理
    @param str_escape: 要检测的字符串
    """
    try:
        parser = XssHtml()
        parser.feed(str_escape)
        parser.close()
        return parser.get_html()
    except Exception as e:
        # js脚本注入检测发生异常，错误信息：%s
        logger.error(u"There are abnormalities in script injection detection, Error message: %s" % e)
        return str_escape


class CheckXssMiddleware(object):
    """
    XSS攻击统一处理中间件
    """

    def process_view(self, request, view, args, kwargs):
        """
        请求参数统一处理
        """
        try:
            # 判断豁免权
            if getattr(view, "escape_exempt", False):
                return None

            # 获取豁免参数名
            self.__escape_param_list = (
                getattr(view, "escape_exempt_param", []) if getattr(view, "escape_exempt_param", False) else []
            )

            # 判断豁免
            escape_type = None
            if getattr(view, "escape_texteditor", False):
                escape_type = "texteditor"
            elif getattr(view, "escape_url", False):
                escape_type = "url"
            # get参数转换
            request.GET = self.__escape_data(request.path, request.GET, escape_type)
            # post参数转换
            request.POST = self.__escape_data(request.path, request.POST, escape_type)
        except Exception as e:
            # CheckXssMiddleware 转换失败！错误信息：%s
            logger.error(u"CheckXssMiddleware Conversion failed! Error message: %s" % e)
        return None

    def __escape_data(self, path, query_dict, escape_type=None):  # noqa
        """
        GET/POST参数转义
        """
        data_copy = query_dict.copy()
        for _get_key, _get_value_list in data_copy.lists():
            new_value_list = []
            for _get_value in _get_value_list:
                new_value = _get_value
                # json串不进行转义
                try:
                    json.loads(_get_value)
                    is_json = True
                except Exception:
                    is_json = False
                # 转义新数据
                if not is_json:
                    try:
                        if escape_type is None:
                            use_type = self.__filter_param(path, _get_key)
                        else:
                            use_type = escape_type
                        if use_type == "url":
                            new_value = url_escape(_get_value)
                        elif use_type == "texteditor":
                            new_value = texteditor_escape(_get_value)
                        elif _get_key in self.__escape_param_list:
                            new_value = _get_value
                        else:
                            new_value = html_escape(_get_value)
                    except Exception as e:
                        # CheckXssMiddleware GET/POST参数 转换失败！%s
                        logger.error(u"CheckXssMiddleware GET/POST Parameters conversion failed: %s" % e)
                        new_value = _get_value
                else:
                    try:
                        new_value = html_escape(_get_value, True)
                    except Exception as e:
                        # CheckXssMiddleware GET/POST参数 转换失败！%s
                        logger.error(u"CheckXssMiddleware GET/POST Parameters conversion failed: %s" % e)
                        new_value = _get_value
                new_value_list.append(new_value)
            data_copy.setlist(_get_key, new_value_list)
        return data_copy

    def __filter_param(self, path, param):
        """
        特殊path处理
        @param path: 路径
        @param param: 参数
        @return: 'url/texteditor'
        """
        use_url_paths, use_texteditor_paths = self.__filter_path_list()
        result = self.__check_escape_type(path, param, use_url_paths, "url")
        # 富文本内容过滤
        if result == "html":
            result = self.__check_escape_type(path, param, use_texteditor_paths, "texteditor")
        return result

    def __check_escape_type(self, path, param, check_path_list, escape_type):
        """
        判断过滤类型
        @param path: 请求Path
        @param param: 请求参数
        @param check_path_list: 指定类型Path列表
        @param escape_type: 判断过滤类型
        @param result_type: 结果类型
        """
        try:
            result_type = "html"
            for script_path, script_v in list(check_path_list.items()):
                is_path = re.match(r"^%s" % script_path, path)
                if is_path and param in script_v:
                    result_type = escape_type
                    break
        except Exception as e:
            # CheckXssMiddleware 特殊path处理失败！错误信息%s
            logger.error(u"CheckXssMiddleware Special path processing failed! Error message: %s" % e)
        return result_type

    def __filter_path_list(self):
        """
        特殊path注册
        注册格式：{'path1': [param1, param2], 'path2': [param1, param2]}
        """
        use_url_paths = {
            "%saccounts/login" % SITE_URL: ["c_url"],
            "%s" % SITE_URL: ["url"],
        }
        use_texteditor_paths = {}
        return (use_url_paths, use_texteditor_paths)


class DeveloperCenterAccessMiddleware(object):
    def process_view(self, request, view, args, kwargs):
        # 静态资源不做登录态验证
        full_path = request.get_full_path()
        if full_path.startswith(settings.STATIC_URL) or full_path == "/robots.txt" or full_path == "/":
            return None

        if getattr(view, "login_exempt", False) or getattr(view, "developer_limit_exempt", False):
            return None

        if Permission().allowed_access_developer_center(request.user.username):
            return None

        return redirect_403(request, request.user.username, ActionEnum.ACCESS_DEVELOPER_CENTER)
