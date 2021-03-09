# -*- coding: utf-8 -*-
"""
Channel Tools
"""

from .component_tools import ComponentClient, ConfapiComponentClient


class ChannelClient(object):
    def __init__(self, path, channel_config):
        self.path = path
        self.channel_config = channel_config

        if self.channel_config.get("is_confapi"):
            self.comp_client = ConfapiComponentClient(
                self.channel_config, comp_codename=channel_config["comp_codename"]
            )
        else:
            self.comp_client = ComponentClient(comp_codename=channel_config["comp_codename"])

    def get_info(self):
        info = self.comp_client.get_info()
        info.update(
            {
                "path": self.path,
                "method": self.channel_config.get("method", ""),
                "comp_codename": self.channel_config["comp_codename"],
                "comp_conf_to_db": self.channel_config.get("comp_conf_to_db"),
                "is_deprecated": self.channel_config.get("is_deprecated", False),
                "no_sdk": self.channel_config.get("no_sdk", False),
            }
        )
        return info

    def is_channel_path_standard(self):
        # check path is /system_name/api_name/ or not
        system_name = self.comp_client.get_system_name().lower()
        # 参数规范化后的组件
        if self.path.startswith("/v2/%s/" % system_name):
            return True

        # 参数未规范化的组件
        return self.path.startswith("/%s/" % system_name)
