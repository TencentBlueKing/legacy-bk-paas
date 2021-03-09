# -*- coding: utf-8 -*-
from django.conf import settings
from common.djmysql_pool import patch_mysql

patch_mysql(pool_options=settings.DJ_POOL_OPTIONS)

from .utils.config import load_config  # noqa


# load config for esb
load_config()
