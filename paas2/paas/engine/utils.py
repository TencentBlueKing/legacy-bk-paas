# -*- coding: utf-8 -*-

import random
from engine.models import BkServer, BkHostingShip


def get_app_prod_deploy_servers(app_code):
    """
    get app prod servers and deploy hostships
    """
    hostships = BkHostingShip.objects.get_app_prod_servers(app_code)
    servers = BkServer.objects.get_prod_servers()
    return hostships, servers


def random_choose_servers(servers):
    """
    if hostships is empty, then it's the first time that app do deploy
    random choose 2
    """
    server_ids = [s.id for s in servers]
    random.shuffle(server_ids)
    return server_ids[:2]
