# -*- coding: utf-8 -*-
"""
环境配置 - 环境变量读取
"""

# Generic Django project settings
DEBUG = False

# Database
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",  # 默认用mysql
        "NAME": "open_paas_eedev",
        "USER": "root",
        "PASSWORD": "123456",
        "HOST": "127.0.0.1",
        "PORT": "3306",
    }
}

# secure
SECRET_KEY = "vLqVTUsFBCGOZbihrjHMuRaQwKpkgoeIXtzJmlDEyNYAxfWdcPS"

# etcd services, ETCD_SERVERS = (('192.168.1.1', 4001), ('192.168.1.2', 4001), ('192.168.1.3', 4001))
IS_ETCD_ON = False
ETCD_SERVERS = "(('127.0.0.1', 4001), )"

CONSUL_HTTP_PORT = "CONSUL_HTTP_PORT"
CONSUL_HTTPS_PORT = "CONSUL_HTTPS_PORT"
CONSUL_SERVER_CA_CERT = "CONSUL_CA_FILE"
CONSUL_CLIENT_CERT_FILE = "CONSUL_CLIENT_CERT_FILE"
CONSUL_CLIENT_KEY_FILE = "CONSUL_CLIENT_KEY_FILE"
