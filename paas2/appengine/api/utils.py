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
from __future__ import absolute_import

from builtins import str
import json
import logging
import requests

from django.conf import settings
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


def unresgister_app_routers(app_code, mode):
    r_key = generate_consul_key(app_code, mode)
    try:
        c = consul_client()
        c.kv.delete(r_key)
        logger.info("unresgister_app_router %s %s success" % (app_code, mode))

    except Exception:
        logger.exception("unresgister_app_router %s %s failed" % (app_code, mode))


def delete_server_backend(client, app_code, mode, server_backend):
    r_key = generate_consul_key(app_code, mode)
    backends_json = client.kv.get(r_key)[1]["Value"]
    backends = json.loads(backends_json)
    backends.remove(server_backend)
    if backends:
        client.kv.put(r_key, json.dumps(backends))


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
    """"""
    try:
        url = "http://%s:%s/api/overview" % (server_info["server_ip"], server_info["server_port"])
        r = requests.get(url, auth=(admin_account["name"], admin_account["password"]))
        if r.status_code == 200:
            return True, ""
        if r.status_code == 401:
            return False, "Administrator account information error"
        else:
            return False, "Rabbitmq service exception"
    except Exception as e:
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


def is_paasagent_active(server):
    url = "http://%s:%s/healthz" % (server.ip_address, server.ip_port)
    try:
        requests.get(url=url, timeout=2)
    except Exception:
        logger.exception("paas_agent(%s:%s) not active" % (server.ip_address, server.ip_port))
        return False
    else:
        return True
