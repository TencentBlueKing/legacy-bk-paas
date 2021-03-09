# -*- coding: utf-8 -*-
from urlparse import urlparse
import os.path

from django.conf import settings

from esb.utils import SmartHost, get_ssl_root_dir


SYSTEM_NAME = "JOB"
JOB_API_ACTION_URL = "/api/jobApi.action"

# 是否开启
USE_SSL = getattr(settings, "JOB_SSL", True)

# make url默认转成http，开启SSL后单独处理
if not settings.HOST_JOB.startswith("http://") and not settings.HOST_JOB.startswith("https://"):
    host_job = "http://%s" % settings.HOST_JOB
else:
    host_job = settings.HOST_JOB

if USE_SSL:
    host_job = urlparse(host_job)._replace(scheme="https").geturl()
else:
    host_job = urlparse(host_job)._replace(scheme="http").geturl()

host = SmartHost(host_prod=host_job)

# 证书配置
SSL_ROOT_DIR = get_ssl_root_dir()
CLIENT_CERT = os.path.join(SSL_ROOT_DIR, "job_esb_api_client.crt")
CLIENT_KEY = os.path.join(SSL_ROOT_DIR, "job_esb_api_client.key")
