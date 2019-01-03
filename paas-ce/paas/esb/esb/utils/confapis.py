# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
import os
import json

from django.conf import settings

from common.base_utils import load_yaml, read_file, smart_unicode
from common.log import logger


class ConfigForm(object):

    fields = {
        'path': {'required': True},
        'name': {'required': True},
        'label': {'required': True},
        'label_en': {'required': False},
        'api_type': {'required': False, 'choices': ['query', 'operate']},
        'suggest_method': {'required': False, 'choices': ['GET', 'POST']},
        'method': {'required': False, 'choices': ['GET', 'POST']},
        'comp_codename': {'required': True},
        'dest_path': {'required': True},
        'dest_http_method': {'required': True, 'choices': ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']},
        'extra_param_fields': {'required': False},
        'dest_host_group': {'required': False},
        'is_hidden': {'required': False},
    }

    @classmethod
    def clean(cls, data):
        for field, conf in ConfigForm.fields.items():
            value = data.get(field)
            if conf.get('required') and not value:
                raise Exception(u'param %s is required' % field)
            if conf.get('choices') and value and value not in conf['choices']:
                raise Exception(u'param %s select a valid choice, %s is not available' % (field, value))

        comp_conf_keys = [
            'dest_path', 'dest_http_method', 'api_type', 'name', 'label', 'label_en',
            'suggest_method', 'extra_param_fields', 'dest_host_group',
        ]
        comp_conf = cls.get_cleaned_data_when_exist(data, keys=comp_conf_keys)
        path = '/%s/' % data['path'].strip('/')
        cleaned_data = {
            'path': path,
            'config': {
                'is_confapi': True,
                'is_hidden': data.get('is_hidden', False),
                'comp_codename': data['comp_codename'],
                'comp_conf': comp_conf,
                'comp_conf_to_db': comp_conf,
            }
        }
        if 'method' in data:
            cleaned_data['config']['method'] = data['method']
            cleaned_data['config']['comp_conf']['suggest_method'] = data['method']
            cleaned_data['config']['comp_conf_to_db']['suggest_method'] = data['method']

        return cleaned_data

    @classmethod
    def get_cleaned_data_when_exist(cls, data, keys=[]):
        return dict([
            (key, data[key])
            for key in keys
            if key in data
        ])


class ConfapisManager(object):

    def __init__(self):
        self.base_dir = self._get_base_dir()
        self.apis_conf = {}

    def get_apis_conf(self):
        """
        :return:
        [
            ('/cc/get_host/', {'comp_codename': 'generic.cc.get_host'}),
        ]
        """
        conf = []
        map(conf.extend, self.apis_conf.values())
        return conf

    def reloadall(self):
        for system_name in os.listdir(self.base_dir):
            self.reload(system_name)

    def reload(self, system_name):
        """
        Priority loading environment config file, such as cc-dev.yaml in dev environment;
        """
        default_system_apis_conf = self._get_system_config(system_name)

        # RUN_MODE: optional value: dev, test, prod
        env = os.getenv('RUN_MODE')
        if env:
            env_system_apis_conf = self._get_system_config(system_name, env)
        else:
            env_system_apis_conf = []

        if not env_system_apis_conf:
            self.apis_conf[system_name] = default_system_apis_conf
            return

        system_apis_conf = env_system_apis_conf
        env_exist_apis_conf = dict([(_path, '') for _path, _ in env_system_apis_conf])
        for _path, _config in default_system_apis_conf:
            # only check 1 times, to check duplicate in the next
            if _path in env_exist_apis_conf:
                env_exist_apis_conf.pop(_path)
                continue
            system_apis_conf.append((_path, _config))

        self.apis_conf[system_name] = system_apis_conf

    def get_apidoc(self, system_name, component_name):
        apidoc_en = self._get_apidoc_content(system_name, component_name, language='en')
        apidoc_zhhans = self._get_apidoc_content(system_name, component_name, language='zh_hans')
        return {
            'en': smart_unicode(apidoc_en),
            'zh-hans': smart_unicode(apidoc_zhhans),
        }

    def _get_system_config(self, system_name, env=''):
        system_base_dir = os.path.join(self.base_dir, system_name, env or '')
        if not os.path.exists(system_base_dir):
            return []

        system_config = []
        for yaml_config in os.listdir(system_base_dir):
            if not yaml_config.endswith('.yaml'):
                continue
            config_path = os.path.join(system_base_dir, yaml_config)
            config = self._get_config(config_path)
            for _config in config:
                try:
                    _config = ConfigForm.clean(_config)
                except:
                    logger.exception('Confapis clean data error. config: %s', json.dumps(_config))
                    continue
                system_config.append((_config['path'], _config['config']))
        return system_config

    def _get_config(self, config_path):
        """Get and Check yaml content"""
        try:
            config = load_yaml(config_path) or []
        except:
            logger.exception('Load confapis yaml config fail. config_path: %s', config_path)
            return []
        if not isinstance(config, (tuple, list)):
            logger.error('Confapis yaml config error, it should be a list. config_path: %s', config_path)
            return []
        return config

    def _get_apidoc_content(self, system_name, component_name, language='en'):
        fpath = self._get_apidoc_fpath(system_name, component_name, language=language)
        if os.path.isfile(fpath):
            try:
                return read_file(fpath)
            except:
                logger.exception('Read file error. fpath=%s', fpath)
        return ''

    def _get_apidoc_fpath(self, system_name, component_name, language='en'):
        return os.path.join(self.base_dir, system_name.lower(), 'apidocs', language, '%s.md' % component_name)

    def _get_base_dir(self):
        return os.path.join(settings.BASE_DIR, 'components/confapis')


_confapis_manager = None


def get_confapis_manager():
    global _confapis_manager
    if not _confapis_manager:
        _confapis_manager = ConfapisManager()
        _confapis_manager.reloadall()
    return _confapis_manager
