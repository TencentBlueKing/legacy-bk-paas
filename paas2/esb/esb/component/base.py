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

import os
import copy
import json
from importlib import import_module

from common.bkerrors import bk_error_codes
from common.errors import APIError, error_codes
from common.base_utils import smart_lower, FancyDict, str_bool
from common.log import logger
from esb.outgoing import HttpClient
from esb.utils import is_py_file, fpath_to_module, config
from esb.utils.base import PathVars
from esb.response import CompResponse
from esb.bkauth.models import BKUser, AnonymousBKUser


class BaseComponent(object):
    """
    Base class for component
    """

    sys_name = "UNKNOWN"
    api_type = "unknown"
    name_prefix = ""

    # 如果定义一个Form，请求将会使用这个Form来验证输入参数的有效性
    Form = None

    def __init__(self, request=None, current_user=None):
        self.request = request
        self.response = CompResponse()
        self.form_data = {}
        self._current_user = current_user
        self._init()

    def _init(self):
        # Init outgoings client for later using
        self.outgoing = FancyDict()
        self.outgoing.http_client = HttpClient(self)

    def set_request(self, request):
        assert isinstance(request, CompRequest)
        self.request = request

    def get_current_user(self):
        """
        获取当前用户
        """
        if not self.request.wsgi_request:
            return AnonymousBKUser()

        username = self.request.wsgi_request.g.get("current_user_username")
        verified = self.request.wsgi_request.g.get("current_user_verified", False)
        if username:
            return BKUser(username, verified=verified)
        else:
            return AnonymousBKUser()

    @property
    def current_user(self):
        return self._current_user

    @current_user.setter
    def current_user(self, value):
        self._current_user = value

    def invoke(self, kwargs={}, use_test_env=False, request_id="", is_dummy=False, app_code="", timeout=None):
        """
        调用一个组件，需要注意的是，当这个组件实例被一个wsgi_request初始化过以后，
        是不需要传入后面这些额外的参数的。

        :param dict kwargs: 请求的参数键值对
        :param bool use_test_env: 是否访问测试环境，默认为不访问
        :param str request_id: 这一次请求的request_id，默认为None
        :param bool is_dummy: 是否虚拟请求结果，默认为False
        :param str app_code: APP身份标识
        :returns: dict格式结果
        :raises: 视情况可能会抛出 `common.errors.APIError` 实例
        """
        if not self.request:
            # 转换kwargs类型
            if isinstance(kwargs, dict):
                kwargs = FancyDict(kwargs)

            self.set_request(
                CompRequest(
                    input=kwargs,
                    use_test_env=use_test_env,
                    request_id=request_id,
                    is_dummy=is_dummy,
                    app_code=app_code,
                    timeout=timeout,
                )
            )
        if not self._current_user:
            self._current_user = self.get_current_user()

        self.validate_input()
        self.before_handle()
        try:
            self.handle()
        except APIError, e:
            self.response.payload = e.code.as_dict()
        self.after_handle()
        return self.response.get_payload()

    def invoke_other(self, *args, **kwargs):
        """
        Use given kwargs to invoke some other component
        """
        return self._invoke_other(*args, **kwargs)["result"]

    def _invoke_other(self, component_name, kwargs={}, use_test_env=None, timeout=None):
        """
        Use given kwargs to invoke some other component
        """
        comp_obj = self.prepare_other(component_name, kwargs=kwargs, use_test_env=use_test_env, timeout=timeout)
        result = comp_obj.invoke()
        return {"result": result, "comp": comp_obj}

    def prepare_other(self, component_name, kwargs={}, use_test_env=None, timeout=None):
        """
        以当前组件为基础，使用给定的参数和配置来生成一个可供调用的组件实例

        :param str component_name: 待生成组件的名称
        :param dict kwargs: 用来调用组件的参数
        :param bool use_test_env: 是否访问测试环境，默认使用当前组件配置
        """
        components_manager = get_components_manager()
        comp_class = components_manager.get_comp_by_name(component_name)

        if not comp_class:
            raise error_codes.ARGUMENT_ERROR.format_prompt("No component can be found via name=%s" % component_name)

        # use_test_env is self.request.use_test_env by default,
        # but this behaviour can be overridden.
        if use_test_env is None:
            use_test_env = self.request.use_test_env

        # 转换kwargs类型
        if isinstance(kwargs, dict):
            kwargs = FancyDict(kwargs)

        comp_obj = comp_class()
        comp_obj.current_user = self.current_user
        comp_obj.set_request(
            CompRequest(
                input=kwargs,
                use_test_env=use_test_env,
                request_id=self.request.request_id,
                is_dummy=self.request.is_dummy,
                app_code=self.request.app_code,
                headers=self.request.headers,
                timeout=timeout,
            )
        )
        return comp_obj

    def validate_input(self):
        """
        Validate the given input
        """
        if self.Form:
            self.form_data = self.Form.from_request(self.request).get_cleaned_data_or_error()
            self.request.kwargs.update(self.form_data)

    def before_handle(self):
        """
        Do things befor handle start
        """
        if getattr(self, "need_check_operate_perm", False):
            self.check_operate_perm()

    def handle(self):
        """
        All Component should override this class
        """
        pass

    def after_handle(self):
        """
        Do things after handle ended
        """
        pass

    def get_host_by_env(self, hosts):
        """
        Get outgoing host by use_test_env flag

        :param dict hosts: hosts, such as {'test': 'testhost', 'prod': 'prodhost'}
        """
        env_name = "test" if self.request.use_test_env else "prod"
        return hosts[env_name]

    @classmethod
    def set_name_prefix(cls, name_prefix):
        """
        设置组件名称的前缀，将会影响get_name的结果

        :param str name_prefix: 需要设置的名称前缀
        """
        cls.name_prefix = name_prefix

    @classmethod
    def get_name(cls):
        """
        Get name of this component, which should be unique
        """
        return "%s%s.%s" % (cls.name_prefix, cls.sys_name.lower(), cls.get_component_name())

    @classmethod
    def get_component_name(cls):
        return smart_lower(cls.__name__)

    def get_alias_name(self):
        return getattr(self, "name", self.get_component_name())


class CompRequest(object):
    """
    Request class for Component
    """

    SENSITIVE_PARAMS_KEY = [
        "app_secret",
        "signature",
        "bk_nonce",
        "bk_timestamp",
        "bk_app_secret",
        "bk_signature",
    ]

    NORMAL_PARAMS_KEY = [
        "app_code",
        "username",
        "bk_token",
        "bk_app_code",
        "bk_username",
        "__esb_skip_signature__",
        "__esb_skip_comp_perm__",
    ]

    def __init__(
        self,
        wsgi_request=None,
        input=None,
        use_test_env=False,
        request_id=None,
        channel_type="api",
        is_dummy=False,
        app_code="",
        path_vars=None,
        timeout=None,
        headers={},
    ):
        self.wsgi_request = wsgi_request
        # Load data from wsgi_request if given
        if self.wsgi_request:
            self.kwargs = copy.copy(self.wsgi_request.g.kwargs)
            self.kwargs = self._clean_sensitive_params(self.kwargs)
            self.use_test_env = self.wsgi_request.g.use_test_env
            self.request_id = self.wsgi_request.g.request_id
            self.channel_type = self.wsgi_request.g.channel_type
            self.is_dummy = str_bool(self.wsgi_request.g.kwargs.get("dummy"))
            self.app_code = self.wsgi_request.g.get("app_code", "")
            # 路径匹配中的变量
            self.path_vars = self.wsgi_request.g.path_vars
            # 超时时长
            self.timeout = self.wsgi_request.g.timeout
            self.headers = self.wsgi_request.g.headers
            self.bk_language = self.headers.get("Blueking-Language", "en")
        else:
            self.kwargs = copy.copy(input) or FancyDict()
            self.use_test_env = use_test_env
            self.request_id = request_id
            self.channel_type = channel_type
            self.is_dummy = is_dummy
            self.app_code = app_code
            # 路径匹配中的变量
            self.path_vars = path_vars or PathVars()
            # 超时时长
            self.timeout = timeout
            self.headers = copy.copy(headers)
            self.bk_language = self.headers.get("Blueking-Language", "en")

    def get_strict_clean_params(self):
        params = copy.deepcopy(self.kwargs)
        params = self._clean_normal_params(params)
        return params

    def get_clean_params(self, ctype="form"):
        if not self.wsgi_request:
            return ""
        if self.wsgi_request.method == "GET":
            return self._get_clean_raw_query(ctype)
        else:
            return self._get_clean_raw_body(ctype)

    def _get_clean_raw_query(self, ctype):
        query = self.wsgi_request.GET.copy()
        query = self._clean_sensitive_params(query)
        return query.urlencode() if ctype == "form" else json.dumps(dict(query.items()))

    def _get_clean_raw_body(self, ctype):
        if self.wsgi_request.body and self.wsgi_request.body.strip().startswith("{"):
            body = json.loads(self.wsgi_request.body)
            body = self._clean_sensitive_params(body)
            return body if ctype == "form" else json.dumps(body)
        else:
            body = self.wsgi_request.POST.copy()
            body = self._clean_sensitive_params(body)
            return body.urlencode() if ctype == "form" else json.dumps(dict(body.items()))

    def _clean_sensitive_params(self, params):
        for key in self.SENSITIVE_PARAMS_KEY:
            params.pop(key, None)
        return params

    def _clean_normal_params(self, params):
        for key in self.NORMAL_PARAMS_KEY:
            params.pop(key, None)
        return params


class ComponentsManager(object):
    """
    Manager for Components
    """

    blist_comp_fnames = [
        "component.py",
        "component.pyc",
    ]

    def __init__(
        self,
    ):
        self.name_component_map = {}
        self.path_configs = {}

    def __str__(self):
        return "<ComponentsManager: path_configs=%s>" % self.path_configs

    def register(self, comp_class, config={}):
        """
        Register a component class by channel_config

        :param dict config: 注册组件时的配置文件，比如组件的名称前缀等
        """
        comp_class.set_name_prefix(config.get("name_prefix", ""))
        self.name_component_map[comp_class.get_name().lower()] = comp_class

    def get_comp_by_name(self, name):
        ret = self.name_component_map.get(name)
        return ret

    def register_by_module(self, module, config={}):
        """
        Register Component class
        """
        cls_comp = self.find_component_class(module)
        if cls_comp:
            self.register(cls_comp, config=config)

    def register_by_config(self, config_list):
        """
        根据来自配置文件的组件配置来注册组件
        """
        if not config_list:
            return
        if not isinstance(config_list, (list, tuple)):
            config_list = [config_list]

        # 保存配置到self.path_configs,并且开始搜寻加载path
        for comp_config in config_list:
            if not comp_config:
                continue
            self.path_configs[comp_config["path"]] = comp_config.copy()
            self.register_path(comp_config["path"])

    def register_path(self, path):
        """
        Walk down components path to find all valid Component object
        """
        config = self.path_configs[path]
        for current_folder, folders, files in os.walk(path):
            for filename in files:
                filename = os.path.join(current_folder, filename)
                if self.should_register(filename):
                    try:
                        module = import_module(fpath_to_module(filename))
                        self.register_by_module(module, config=config)
                    except Exception:
                        logger.exception(
                            "%s Error when register file %s, skip",
                            bk_error_codes.COMPONENT_REGISTER_ERROR.code,
                            filename,
                        )

    def should_register(self, filename):
        """
        Determine if `filename` should be registered

        :param str filename: filename with directory, like "esb/generic/test.py"
        """
        fpath, base_fname = os.path.split(filename)
        # Components are not in toolkit folder
        if fpath.endswith("/toolkit") or fpath.endswith("/apidoc"):
            return False
        return is_py_file(base_fname) and not base_fname.startswith("_") and base_fname not in self.blist_comp_fnames

    @staticmethod
    def find_component_class(module):
        """
        Find the component class from the given module
        """
        for attr_name in dir(module):
            obj = getattr(module, attr_name)
            try:
                # Only if this Component class is **defined** in this module
                if hasattr(obj, "handle") and issubclass(obj, BaseComponent) and obj.__module__ == module.__name__:
                    cls_comp = obj
                    return cls_comp
            except Exception:
                pass
        return

    def get_registed_components(self):
        return self.name_component_map


_components_manager = None


def get_components_manager():
    """
    获取当前注册的components_manager
    """
    global _components_manager
    if _components_manager is None:
        manager = ComponentsManager()
        manager.register_by_config(config.ESB_CONFIG["config"].get("component_groups", []))
        _components_manager = manager
    return _components_manager
