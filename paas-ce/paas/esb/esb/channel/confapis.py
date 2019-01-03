# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
from esb.utils.confapis import get_confapis_manager
from .base import ChannelManager, get_channel_manager


class ConfapisChannelManager(ChannelManager):
    """
    Manager for Channels, query confapis config to find the matching channel.
    """

    def __init__(self, *args, **kwargs):
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
        super(ConfapisChannelManager, self).__init__(*args, **kwargs)
        self.changed = False
        self.channel_manager = get_channel_manager()
        self.confapis_manager = get_confapis_manager()
        self.set_default_channel_classes(self.channel_manager.get_default_channel_classes())

    def __str__(self):
        return '<CompapisChannelManager>'

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
            channel = self.preset_channels.get(method, {}).get(_path)

            if channel:
                return channel
        return channel

    def refresh_channel_groups(self):
        self.register_channel_groups(
            self.default_channel_classes,
            self.confapis_manager.get_apis_conf(),
            {},
        )


_confapis_channel_manager = None


def get_confapis_channel_manager():
    global _confapis_channel_manager
    if _confapis_channel_manager is None:
        manager = ConfapisChannelManager()
        manager.refresh_channel_groups()

        _confapis_channel_manager = manager
    return _confapis_channel_manager
