# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
"""
Channel Tools
"""
import re

from .component_tools import ComponentClient, ConfapiComponentClient


class ChannelClient(object):

    def __init__(self, path, channel_config):
        self.path = path
        self.channel_config = channel_config

        if self.channel_config.get('is_confapi'):
            self.comp_client = ConfapiComponentClient(
                self.channel_config,
                comp_codename=channel_config['comp_codename'])
        else:
            self.comp_client = ComponentClient(comp_codename=channel_config['comp_codename'])

    def get_info(self):
        info = self.comp_client.get_info()
        info.update({
            'path': self.path,
            'comp_codename': self.channel_config['comp_codename'],
            'comp_conf_to_db': self.channel_config.get('comp_conf_to_db'),
            'is_deprecated': self.channel_config.get('is_deprecated', False),
            'no_sdk': self.channel_config.get('no_sdk', False),
        })
        return info

    def is_channel_path_standard(self):
        # check path is /system_name/api_name/ or not
        system_name = self.comp_client.get_system_name().lower()
        component_name = self.comp_client.get_component_name()
        guess_api_path = r'^(/v2)?/%s/%s/$' % (system_name, component_name)
        return re.match(guess_api_path, self.path)
