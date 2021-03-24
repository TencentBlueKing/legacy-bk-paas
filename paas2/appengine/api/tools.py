# -*- coding: utf-8 -*-

import logging
import json

from api.models import get_assigned_servers, BkServer, BkHostingShip
from api.utils import (
    parse_event_type,
    consul_client,
    generate_consul_key,
    unresgister_app_routers,
    get_mode_by_category,
    delete_server_backend,
)

logger = logging.getLogger("root")


def register_app_routers(app_code, mode):
    r_key = generate_consul_key(app_code, mode)
    try:
        servers = get_assigned_servers(app_code, mode)
        server_ips = []
        for s in servers:
            server_ips.append("%s:%s" % (s.ip_address, s.app_port))

        if server_ips:
            c = consul_client()
            c.kv.put(r_key, json.dumps(server_ips))
            logger.info("register_app_router %s %s success" % (app_code, mode))

    except Exception:
        logger.exception("register_app_router %s %s failed" % (app_code, mode))


def update_app_routers(app_code, event_type):
    e_data = parse_event_type(event_type)
    mode, handle = e_data["mode"], e_data["handle"]
    if handle == "online":
        register_app_routers(app_code, mode)
    else:
        unresgister_app_routers(app_code, mode)


def delete_server_from_routers(server_id):
    bk_server = BkServer.objects.get(id=server_id)
    hs_qsets = BkHostingShip.objects.select_related("bk_app__app_code").filter(bk_server=bk_server)
    c = consul_client()
    for hs in hs_qsets:
        mode = get_mode_by_category(bk_server.category)
        delete_server_backend(c, hs.bk_app.app_code, mode, "%s:%s" % (bk_server.ip_address, bk_server.app_port))
