# -*- coding: utf-8 -*-
import logging

import requests
import django.db

from api.models import ThirdServer, BkServer
from api.constants import THIRD_SERVER_CATEGORY_MQ
from api.utils import get_category_by_mode
from api import http
from api.exceptions import EngineErrorCodes

logger = logging.getLogger("root")


def get_db_status():
    try:
        with django.db.connection.cursor() as c:
            c.execute("SELECT 0")
    except django.db.Error as e:
        err_msg = "Database health check failed! Database connection exception %s" % e
        logger.exception("%s %s" % (EngineErrorCodes.E1304001_DATABASE_ERROR, err_msg))
        return EngineErrorCodes.E1304001_DATABASE_ERROR, err_msg
    return EngineErrorCodes.E1304000_DEFAULT_CODE, ""


def get_rabbitmq_status():
    try:
        rabbitmq_server = ThirdServer.objects.get(category=THIRD_SERVER_CATEGORY_MQ, is_active=True)
    except Exception:
        err_msg = "Query error, please ensure that the rabbitmq server has been properly registered and activated"
        logger.exception("%s %s" % (EngineErrorCodes.E1304202_RABBITMQ_INACTIVEATED_ERROR, err_msg))
        return EngineErrorCodes.E1304202_RABBITMQ_INACTIVEATED_ERROR, err_msg

    server_data = rabbitmq_server.server_data
    try:
        url = "http://%s:%s/api/overview" % (server_data["ip_address"], server_data["ip_port"])  # domain name in fact
        r = requests.get(url, auth=(server_data["username"], server_data["password"]))
        if r.status_code == 200:
            return EngineErrorCodes.E1304000_DEFAULT_CODE, ""
        if r.status_code == 401:
            return EngineErrorCodes.E1304203_RABBITMQ_UNAUTHORIZED_ERROR, "Administrator account information error"
        else:
            return (
                EngineErrorCodes.E1304201_RABBITMQ_ERROR,
                "Rabbitmq service exception: request status code %s" % r.status_code,
            )

    except Exception, e:
        err_msg = str(e)
        logger.exception("%s %s" % (EngineErrorCodes.E1304201_RABBITMQ_ERROR, err_msg))
        return EngineErrorCodes.E1304201_RABBITMQ_ERROR, "Rabbitmq service exception: %s" % err_msg


def get_paasagent_status():
    bk_servers = BkServer.objects.filter(is_active=True)
    if not bk_servers:
        return (
            EngineErrorCodes.E1304102_PAASAGENT_INACTIVEATED_ERROR,
            "Have not registered and activated applicable app servers",
        )

    code, msg = get_paasagent_status_by_mode(bk_servers, mode="test")
    if code != EngineErrorCodes.E1304000_DEFAULT_CODE:
        return code, msg

    code, msg = get_paasagent_status_by_mode(bk_servers, mode="prod")
    if code != EngineErrorCodes.E1304000_DEFAULT_CODE:
        return code, msg

    return EngineErrorCodes.E1304000_DEFAULT_CODE, ""


def get_paasagent_status_by_mode(bk_servers, mode="test"):
    servers = bk_servers.filter(category=get_category_by_mode(mode))
    if not servers:
        return (
            EngineErrorCodes.E1304102_PAASAGENT_INACTIVEATED_ERROR,
            "Have not registered app's %s environment server" % mode,
        )

    for server in servers:
        ip_address, ip_port, sid, token = (server.ip_address, server.ip_port, server.s_id, server.token)
        url = "http://%s:%s/v1/app/healthz" % (ip_address, ip_port)
        try:
            headers = http._gen_header(sid, token)
            resp = requests.get(url=url, headers=headers, timeout=10)
        except Exception, e:
            err_msg = "paasagent healthz FAIL! Request exception! url=%s, sid=%s, token=%s, error=%s" % (
                url,
                sid,
                token,
                e,
            )
            logger.exception("%s %s" % (EngineErrorCodes.E1304104_PAASAGENT_NOTSTARTED_ERROR, err_msg))
            return EngineErrorCodes.E1304104_PAASAGENT_NOTSTARTED_ERROR, err_msg

        if resp.status_code != 200:
            err_msg = "paasagent healthz FAIL! sid/token error! url=%s, sid=%s, token=%s, status=%s" % (
                url,
                sid,
                token,
                resp.status_code,
            )
            logger.error("%s %s" % (EngineErrorCodes.E1304103_PAASAGENT_UNAUTHORIZED_ERROR, err_msg))
            return EngineErrorCodes.E1304103_PAASAGENT_UNAUTHORIZED_ERROR, err_msg

        result = resp.json()
        if result.get("error") != 0:
            err_msg = "paasagent healthz FAIL! url=%s, sid=%s, token=%s, resp=%s" % (url, sid, token, result)
            logger.error("%s %s" % (EngineErrorCodes.E1304101_PAASAGENT_ERROR, err_msg))
            return EngineErrorCodes.E1304101_PAASAGENT_ERROR, err_msg

    return EngineErrorCodes.E1304000_DEFAULT_CODE, ""
