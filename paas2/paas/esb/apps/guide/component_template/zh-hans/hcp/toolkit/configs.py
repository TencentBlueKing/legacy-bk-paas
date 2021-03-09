# -*- coding: utf-8 -*-
from esb.utils import SmartHost


# 系统名的小写形式要与系统包名保持一致
SYSTEM_NAME = "HCP"

host = SmartHost(
    # 需要填入系统正式环境的域名地址
    host_prod="hcp.domain.com",
)
