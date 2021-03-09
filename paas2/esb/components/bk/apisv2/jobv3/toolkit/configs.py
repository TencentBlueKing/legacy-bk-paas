# -*- coding: utf-8 -*-
import os.path
from urlparse import urlparse

from django.conf import settings

from esb.utils import SmartHost, get_ssl_root_dir


SYSTEM_NAME = "JOBV3"

HOST_JOB = getattr(settings, "HOST_JOB", "")
if HOST_JOB.startswith("https://"):
    host_job = HOST_JOB
elif HOST_JOB.startswith("http://"):
    host_job = urlparse(HOST_JOB)._replace(scheme="https").geturl()
else:
    host_job = "https://%s" % HOST_JOB

host = SmartHost(host_prod=host_job)

# 证书配置
SSL_ROOT_DIR = get_ssl_root_dir()
CLIENT_CERT = os.path.join(SSL_ROOT_DIR, "job_esb_api_client.crt")
CLIENT_KEY = os.path.join(SSL_ROOT_DIR, "job_esb_api_client.key")
