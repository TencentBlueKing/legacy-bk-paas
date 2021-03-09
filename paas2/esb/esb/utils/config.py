# -*- coding: utf-8 -*-
from importlib import import_module

from django.conf import settings


# 保存目前运行的components的配置
ESB_CONFIG = None


def load_config(*args, **kwargs):
    """加载config"""
    global ESB_CONFIG

    config = real_load_config(*args, **kwargs)

    ESB_CONFIG = config
    return config


def real_load_config():
    """Load config dict by run_version"""
    # 直接从配置文件中加载config
    module_name, config_name = settings.ESB_SITE_ESB_CONF.rsplit(".", 1)
    config = getattr(import_module(module_name), config_name, None)
    return config
