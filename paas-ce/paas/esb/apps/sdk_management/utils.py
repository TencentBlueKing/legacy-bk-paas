# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
import os
import shutil
import string

from django.conf import settings
from jinja2 import Template

from apps.sdk_management.constants import COLLECTIONS_PY_TMPL, API_PY_TMPL, API_COMPONENT_TMPL


class SDKGenerator(object):

    def __init__(self, channels, target_dir=''):
        self.channels = self.get_available_channels(channels)
        self.target_dir = target_dir or self.get_tmp_dir()

    def get_target_dir(self):
        return self.target_dir

    def get_tmp_dir(self):
        return os.path.join('/tmp/open_paas_esb_sdk/')

    def generate_files_for_sdk(self):
        self.copy_tmpl_to_target_dir()
        self.generate_collections_py()
        self.generate_apis_files()

    def get_available_channels(self, channels):
        new_channels = {}
        for system_name, sub_channels in channels.iteritems():
            new_sub_channels = [
                channel
                for channel in sub_channels
                if channel['suggest_method'] and not channel['no_sdk']
            ]
            if new_sub_channels:
                new_channels[system_name] = new_sub_channels
        return new_channels

    def copy_tmpl_to_target_dir(self):
        source_dir = os.path.join(settings.BASE_DIR, 'apps/sdk_management/sdk_tmpl/')

        if os.path.exists(self.target_dir):
            shutil.rmtree(self.target_dir)

        shutil.copytree(source_dir, self.target_dir)
        if not os.path.exists(os.path.join(self.target_dir, 'blueking')):
            raise Exception('Failed to copy SDK template to the temporary directory')

    def generate_collections_py(self):
        content = self.get_collections_py_content()
        collections_py_path = os.path.join(self.target_dir, 'blueking/component/collections.py')
        self.write_content_to_file(content, collections_py_path)

    def generate_apis_files(self):
        for system_name, channels in self.channels.items():
            content = self.get_api_file_content(system_name, channels)
            file_path = 'blueking/component/apis/{system_name}.py'.format(system_name=system_name.lower())
            api_file_path = os.path.join(self.target_dir, file_path)
            self.write_content_to_file(content, api_file_path)

    def get_collections_py_content(self):
        import_collections = []
        available_collections = []
        for system_name in sorted(self.channels.keys()):
            system_name_lower = system_name.lower()
            system_name_smart = self.smart_system_name(system_name)

            import_collections.append(
                'from .apis.{system_name_lower} import Collections{system_name_smart}'.format(
                    system_name_lower=system_name_lower,
                    system_name_smart=system_name_smart
                )
            )
            available_collections.append(
                "    '{system_name_lower}': Collections{system_name_smart},".format(
                    system_name_lower=system_name_lower,
                    system_name_smart=system_name_smart
                )
            )
        return Template(COLLECTIONS_PY_TMPL).render(
            import_collections='\n'.join(import_collections),
            available_collections='\n'.join(available_collections),
        )

    def get_api_file_content(self, system_name, channels):
        apis = []
        group_channels = self.group_channels_by_api_ver(channels)

        for _, channels in group_channels:
            channels = sorted(channels, key=lambda item: item['path'])
            for channel in channels:
                apis.append(API_COMPONENT_TMPL.format(
                    api_name=channel['component_name'],
                    api_path='/api/c/compapi{bk_api_ver}/%s/%s/' % (channel['system_name'].lower(), channel['component_name']),  # noqa
                    suggest_method=channel['suggest_method'],
                    description=channel['component_label'].encode('utf-8'),
                ))
        return Template(API_PY_TMPL).render(
            system_name_smart=self.smart_system_name(system_name),
            system_name=system_name,
            apis=''.join(apis).decode('utf-8')
        )

    def smart_system_name(self, system_name):
        if '_' in system_name:
            system_name = ''.join(string.capitalize(word) for word in system_name.split('_'))
        return system_name

    def write_content_to_file(self, content, file_path):
        content = content if isinstance(content, str) else content.encode('utf-8')
        with open(file_path, 'w') as fp:
            fp.write(content)
        if not os.path.exists(file_path):
            raise Exception('Failed to write file contents')

    def group_channels_by_api_ver(self, channels):
        channels_v1 = {}
        channels_v2 = {}
        for channel in channels:
            channel_path = channel['path']
            if channel_path.startswith('/v2/'):
                channels_v2[channel_path[3:]] = channel
            else:
                channels_v1[channel_path] = channel

        channels_v1_v2 = []
        channels_only_v2 = []
        for path, channel in channels_v2.items():
            if path in channels_v1:
                if channels_v1[path]['suggest_method'] != channel['suggest_method']:
                    print 'channel method different: v1=%s, v2=%s, path=%s' % (
                        channels_v1[path]['suggest_method'],
                        channel['suggest_method'],
                        path
                    )
                channels_v1_v2.append(channel)
                channels_v1.pop(path)
            else:
                channels_only_v2.append(channel)
        return [
            [('v2', ), channels_only_v2],
            [('', 'v2'), channels_v1_v2],
            [('', ), channels_v1.values()],
        ]
