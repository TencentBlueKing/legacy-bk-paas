# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
"""
Utils for ESB
"""
import re
import os

from django.conf import settings


__all__ = ['is_py_file', 'fpath_to_module', 'SmartHost', 'get_ssl_root_dir']


def is_py_file(fname):
    return fname.endswith('.py') or fname.endswith('.pyc')


def fpath_to_module(fpath):
    """Transform a filepath to a module string
    """
    prefix = settings.BASE_DIR
    if fpath.startswith(prefix):
        fpath = fpath[len(prefix):]
    # 去掉目录前的斜杠
    fpath = fpath.lstrip(os.path.sep)
    return fpath.replace(os.path.sep, '.').rsplit('.', 1)[0]


class SmartHost(object):
    """A smart host object

    当对外请求向这个SmartHost发送时，系统会根据当前访问的component对象状态（如
    是否访问测试环境等）来判断请求应该具体被解析到的主机地址。
    """

    def __init__(self, host_prod, host_test=None):
        self.hosts_prod = self.make_host_list(host_prod)
        if host_test:
            self.hosts_test = self.make_host_list(host_test)
            self._has_test_host = True
        else:
            self.hosts_test = self.hosts_prod
            self._has_test_host = False

        self.host_index = {
            'prod': 0,
            'test': 0,
        }

    @staticmethod
    def make_host_list(host):
        if isinstance(host, (list, tuple)):
            return host
        else:
            return host.split(';')

    def get_value(self, use_test_env):
        """根据环境获取需要访问host
        """
        key = 'test' if use_test_env else 'prod'
        hosts = self.hosts_test if use_test_env else self.hosts_prod
        return hosts[self.host_index[key] % len(hosts)]

    def shift_host(self, use_test_env):
        """切换下一次使用的主机
        """
        key = 'test' if use_test_env else 'prod'
        self.host_index[key] += 1

    def has_test_host(self):
        """是否拥有用于测试环境的主机地址
        """
        return self._has_test_host

    def as_json(self):
        """获取json格式数据
        """
        host = {'host_prod': ';'.join(self.hosts_prod)}
        if self.has_test_host():
            host['host_test'] = ';'.join(self.hosts_test)
        return host

    def __str__(self):
        return '<SmartHost hosts_test=%s hosts_prod=%s>' % (self.hosts_test, self.hosts_prod)


class PathVars(object):
    """组件路径匹配中的变量"""

    def __init__(self, val_dict=None, val_list=None):
        self.val_dict = val_dict or {}
        self.val_list = val_list or self.val_dict.values()

    @classmethod
    def from_matched_obj(cls, matched_obj):
        """从一次正则匹配结果生成一个PathVars对象

        :param matched_obj: 一次正则匹配结果对象
        """
        return cls(val_dict=matched_obj.groupdict(), val_list=matched_obj.groups())

    def __str__(self):
        return 'val_dict=%s val_list=%s' % (self.val_dict, self.val_list)


RE_PATH_VARIABLE = re.compile(r'\{([A-Za-z0-9_-]+)\}')


def preprocess_path_tmpl(path):
    """预处理形如"/users/{username}"的可变路径模板
    """
    return RE_PATH_VARIABLE.sub(r'(?P<\1>[\w-]+)', path)


def has_path_vars(path):
    """判断路径中是否有路径变量"""
    return RE_PATH_VARIABLE.search(path)


def get_ssl_root_dir():
    return os.path.abspath(
        getattr(settings, 'SSL_ROOT_DIR', '') or settings.DEFAULT_SSL_ROOT_DIR
    )
