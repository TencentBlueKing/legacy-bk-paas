# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
import os
from importlib import import_module

from common.constants import BK_SYSTEMS
from components.esb_conf import CUSTOM_APIS_REL_PATH
from esb.utils import fpath_to_module, config
from esb.utils.confapis import get_confapis_manager
from esb.management.utils import constants
from .channel_tools import ChannelClient
try:
    from esb.management.utils import ee_constants as x_constants
except:
    from esb.management.utils import ec_constants as x_constants

import logging
logger = logging.getLogger(__name__)


class ConfClient(object):

    def __init__(self):
        self.custom_conf_module = self._get_custom_conf_module()

    @property
    def system_doc_category(self):
        return self.default_system_doc_category + self.custem_system_doc_category

    @property
    def systems(self):
        return self.default_systems + self.custom_systems

    @property
    def channels(self):
        all_channels = self.default_channels

        for system_name, system_channels in self.custom_channels.iteritems():
            all_channels.setdefault(system_name, [])
            all_channels[system_name].extend(system_channels)

        for system_name, system_channels in self.confapis_channels.iteritems():
            all_channels.setdefault(system_name, [])
            all_channels[system_name].extend(system_channels)

        return all_channels

    @property
    def buffet_components(self):
        return self.default_buffet_components + self.custom_buffet_components

    @property
    def default_system_doc_category(self):
        return getattr(constants, 'SYSTEM_DOC_CATEGORY', [])

    @property
    def default_systems(self):
        return BK_SYSTEMS.values() + getattr(x_constants, 'SYSTEMS', [])

    @property
    def default_channels(self):
        return self._get_channels_by_config(self._default_channels_conf, is_default=True)

    @property
    def default_buffet_components(self):
        return getattr(x_constants, 'BUFFET_COMPONENTS', [])

    @property
    def custem_system_doc_category(self):
        return getattr(self.custom_conf_module, 'SYSTEM_DOC_CATEGORY', [])

    @property
    def custom_systems(self):
        return getattr(self.custom_conf_module, 'SYSTEMS', [])

    @property
    def custom_channels(self):
        return self._get_channels_by_config(self._custom_channels_conf, is_default=False)

    @property
    def confapis_channels(self):
        return self._get_channels_by_config(self._confapis_channels_conf, is_default=True)

    @property
    def custom_buffet_components(self):
        return getattr(self.custom_conf_module, 'BUFFET_COMPONENTS', [])

    @property
    def _default_channels_conf(self):
        """
        :return
        [
            ('/cc/get_host/', {'comp_codename': 'generic.cc.get_host'}),
        ]
        """
        channels = []
        channel_groups = config.ESB_CONFIG['config']['channel_groups']
        for channel_group_conf in channel_groups.values():
            channels.extend(channel_group_conf['preset_channels'])
        return channels

    @property
    def _custom_channels_conf(self):
        return [
            (channel['path'], {'comp_codename': channel['comp_codename']}) if isinstance(channel, dict) else channel
            for channel in getattr(self.custom_conf_module, 'CHANNELS', [])
        ]

    @property
    def _confapis_channels_conf(self):
        confapis_manager = get_confapis_manager()
        confapis_channels_conf = confapis_manager.get_apis_conf()
        # check if channel is existed in default channels
        default_channel_path_list = [channel[0] for channel in self._default_channels_conf]
        confapi_channel_path_list = []
        _channels_conf = []
        for path, value in confapis_channels_conf:
            channel_key = '%s:%s' % (path, value.get('method', ''))
            if path in default_channel_path_list:
                logger.warning('confapi channel [path=%s] exists in esb_conf.py, will be ignored', path)
                continue
            if channel_key in confapi_channel_path_list:
                logger.warning('confapi channel [path=%s] is duplicate, will be ignored', path)
                continue
            confapi_channel_path_list.append(channel_key)
            _channels_conf.append((path, value))
        return _channels_conf

    def _get_custom_conf_module(self):
        conf_path = os.path.join(CUSTOM_APIS_REL_PATH, 'conf.py')
        try:
            return import_module(fpath_to_module(conf_path))
        except:
            return None

    def _get_channels_by_config(self, channels_config, is_default=False):
        """
        :return:
        {
            "CC": [
                {
                    "path": "/cc/get_host/",
                    "comp_codename": "generic.cc.get_host",
                    "comp_conf_to_db": {},
                    "system_name": "CC",
                    "component_name": "get_host",
                    "component_label": "Get host",
                    "component_type": "query",
                    "suggest_method": "GET",
                    "is_deprecated": False,
                    "is_confapi": False,
                }
            ]
        }
        """
        channels = {}
        for path, value in channels_config:
            if value.get('is_hidden'):
                continue
            if path.startswith('/data/'):
                continue
            if path.startswith('/devops/') and is_default:
                continue
            try:
                channel_client = ChannelClient(path, value)
                api_info = channel_client.get_info()
            except Exception as ex:
                error_msg = u'%s get api data fail, Exception: %s' % (value['comp_codename'], ex)
                logger.error(error_msg.encode('utf-8'))
                continue

            is_standard = channel_client.is_channel_path_standard()
            if not is_standard and not path.startswith('/devops/'):
                logger.warning('channel path is not standard and will be ignored, please check: %s, %s' % (
                    value['comp_codename'], path))
                continue

            system_name = api_info['system_name']
            channels.setdefault(system_name, [])
            channels[system_name].append(api_info)
        return channels
