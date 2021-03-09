# -*- coding: utf-8 -*-
"""
Usage:

    from common.log import logger

    logger.info("test")
    logger.error("wrong1")
    logger.exception("wrong2")

    # with traceback
    try:
        1 / 0
    except Exception:
        logger.exception("wrong3")
"""
from __future__ import unicode_literals

import logging

logger = logging.getLogger("root")
