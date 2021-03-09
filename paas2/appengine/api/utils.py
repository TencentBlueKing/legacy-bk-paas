# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS
Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License.
You may obtain a copy of the License at http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
specific language governing permissions and limitations under the License.
"""

import json
import random
import logging
import requests

from django.conf import settings
import models
import http
import consul

logger = logging.getLogger("root")

r_key_format = "bkapps/upstreams/%s/%s"


def generate_consul_key(app_code, mode):
    app_key = "t.%s" % app_code if mode == "test" else app_code
    return r_key_format % (mode, app_key)


def consul_client():
    try:
        port = int(settings.CONSUL_HTTPS_PORT)
    except Exception:
        port = int(settings.CONSUL_HTTP_PORT)
        return consul.Consul(host="localhost", port=port)
    else:
        return consul.Consul(
            host="localhost",
            port=port,
            scheme="https",
            verify=settings.CONSUL_SERVER_CA_CERT,
            cert=(settings.CONSUL_CLIENT_CERT_FILE, settings.CONSUL_CLIENT_KEY_FILE),
        )


def is_online_event(event_type):
    _, _, handle = event_type.split(".")
    if handle == "online":
        return True
    return False


def parse_event_type(event_type):
    _, mode, handle = event_type.split(".")
    return {"mode": mode, "handle": handle}


def get_assigned_servers(app_code, mode):
    category = get_category_by_mode(mode)
    hs_qset = models.BkHostingShip.objects.select_related("bk_server").filter(
        bk_app__app_code=app_code, is_active=True, bk_server__category=category
    )
    servers = []
    for hs in hs_qset:
        servers.append(hs.bk_server)
    return servers


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


def unresgister_app_routers(app_code, mode):
    r_key = generate_consul_key(app_code, mode)
    try:
        c = consul_client()
        c.kv.delete(r_key)
        logger.info("unresgister_app_router %s %s success" % (app_code, mode))

    except Exception:
        logger.exception("unresgister_app_router %s %s failed" % (app_code, mode))


def update_app_routers(app_code, event_type):
    e_data = parse_event_type(event_type)
    mode, handle = e_data["mode"], e_data["handle"]
    if handle == "online":
        register_app_routers(app_code, mode)
    else:
        unresgister_app_routers(app_code, mode)


def delete_server_backend(client, app_code, mode, server_backend):
    r_key = generate_consul_key(app_code, mode)
    backends_json = client.kv.get(r_key)[1]["Value"]
    backends = json.loads(backends_json)
    backends.remove(server_backend)
    if backends:
        client.kv.put(r_key, json.dumps(backends))


def delete_server_from_routers(server_id):
    bk_server = models.BkServer.objects.get(id=server_id)
    hs_qsets = models.BkHostingShip.objects.select_related("bk_app__app_code").filter(bk_server=bk_server)
    c = consul_client()
    for hs in hs_qsets:
        mode = get_mode_by_category(bk_server.category)
        delete_server_backend(c, hs.bk_app.app_code, mode, "%s:%s" % (bk_server.ip_address, bk_server.app_port))


def merge_two_dicts(x, y):
    """Given two dicts, merge them into a new dict as a shallow copy."""
    z = x.copy()
    z.update(y)
    return z


def get_category_by_mode(mode):
    return "tapp" if mode == "test" else "app"


def get_mode_by_category(category):
    if category == "tapp":
        return "test"
    return "prod"


def check_rabbitmq(server_info, admin_account):
    """
    """
    try:
        url = "http://%s:%s/api/overview" % (server_info["server_ip"], server_info["server_port"])
        r = requests.get(url, auth=(admin_account["name"], admin_account["password"]))
        if r.status_code == 200:
            return True, ""
        if r.status_code == 401:
            return False, "Administrator account information error"
        else:
            return False, "Rabbitmq service exception"
    except Exception, e:
        return False, str(e)


def apply_mq_res(server_info, admin_account, user_account, vhost):
    app_code = user_account["name"]
    rabbitmq_host = "http://%s:%s" % (server_info["server_ip"], server_info["server_port"])
    auth = (admin_account["name"], admin_account["password"])
    headers = {"content-type": "application/json"}

    # 创建vhost
    url = "%s/api/vhosts/%s" % (rabbitmq_host, vhost)
    r = requests.put(url=url, headers=headers, auth=auth)
    if r.status_code != 204:
        raise ValueError("Create vhost failed")

    # 创建账户
    url = "%s/api/users/%s" % (rabbitmq_host, app_code)
    user_json = {"password": user_account["password"], "tags": "management"}
    r = requests.put(url, headers=headers, auth=auth, json=user_json)
    if r.status_code != 204:
        raise ValueError("Create account failed")

    url = "%s/api/permissions/%s/%s" % (rabbitmq_host, vhost, app_code)
    permission_json = {"configure": ".*", "write": ".*", "read": ".*"}
    r = requests.put(url, headers=headers, auth=auth, json=permission_json)
    if r.status_code != 204:
        raise ValueError("Vhost authorization failed")

    # create mirror policy
    url = "%s/api/policies/%s/ha-all" % (rabbitmq_host, vhost)
    policy_json = {"pattern": "", "definition": {"ha-mode": "all", "ha-sync-mode": "automatic"}}
    r = requests.put(url, headers=headers, auth=auth, json=policy_json)
    if r.status_code != 204:
        logger.exception("Vhost mirror policy create failed, status_code is %s" % r.status_code)
    return


class PortManager(object):
    """
    manager port for app container, especially for java
    """

    def __init__(self, bk_app, mode, server_ids=None, port_pools=settings.PORT_POOLS):
        self.bk_app = bk_app
        self.mode = mode
        self.server_ids = server_ids
        self.port_pools = port_pools

    def _get_available_port(self):
        used_ports = list(models.BkAppBindPort.objects.filter(mode=self.mode).values_list("port", flat=True))
        available_ports = list(set(self.port_pools) - set(used_ports))
        for _ in range(settings.PORT_MAX_TRIES):
            available_port = random.choice(available_ports)
            if self._check_port_available(available_port):
                return available_port
        raise ValueError("Port allocation failed after being tried %s times" % settings.PORT_MAX_TRIES)

    def bind_app_to_port(self):
        try:
            available_port = models.BkAppBindPort.objects.get(bk_app=self.bk_app, mode=self.mode).port
        except models.BkAppBindPort.DoesNotExist:
            available_port = self._get_available_port()
            models.BkAppBindPort.objects.create(bk_app=self.bk_app, mode=self.mode, port=available_port)
        return available_port

    def recycle_app_port(self):
        models.BkAppBindPort.objects.filter(bk_app=self.bk_app, mode=self.mode).delete()

    def _check_port_available(self, port):
        if not self.server_ids:
            raise ValueError("No servers")

        for server_id in self.server_ids:
            server = models.BkServer.objects.get(id=server_id)
            url = "http://%s:%s/v1/app/ports/%s" % (server.ip_address, server.ip_port, port)
            ret, data = http.http_get(url, server.s_id, server.token, "", timeout=5)
            if not ret or data["error"] != 0 or data["already_use"]:
                return False
        return True


def is_paasagent_active(server):
    url = "http://%s:%s/healthz" % (server.ip_address, server.ip_port)
    try:
        requests.get(url=url, timeout=2)
    except Exception:
        logger.exception("paas_agent(%s:%s) not active" % (server.ip_address, server.ip_port))
        return False
    else:
        return True
