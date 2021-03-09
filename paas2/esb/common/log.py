# -*- coding: utf-8 -*-
"""
初始化logger实例(对logging的封装)
"""
# 使用python的logging模块，配合settings的LOGGING属性
import logging


# the root logger, 用于整个project的logger
logger = logging.getLogger("root")

# request and api log
logger_api = logging.getLogger("api")
