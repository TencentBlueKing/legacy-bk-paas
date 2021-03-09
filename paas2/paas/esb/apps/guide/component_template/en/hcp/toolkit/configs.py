# -*- coding: utf-8 -*-
from esb.utils import SmartHost


# The system name in lowercase shall be the same as the system package name
SYSTEM_NAME = "HCP"

host = SmartHost(
    # The domain name of system production environment shall be filled in
    host_prod="hcp.domain.com",
)
