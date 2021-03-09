# -*- coding: utf-8 -*-
from django.utils.translation import ugettext as _

import re

CATEGORY_SERVER_TEST = "tapp"
CATEGORY_SERVER_PROD = "app"

SERVER_CATEGORY_CHOICES = [
    (CATEGORY_SERVER_TEST, _(u"测试服务器")),
    (CATEGORY_SERVER_PROD, _(u"正式服务器")),
]

THIRD_SERVER_CATEGORY_MQ = "rabbitmq"
THIRD_SERVER_CATEGORY_CHOICES = [
    (THIRD_SERVER_CATEGORY_MQ, _(u"RabbitMQ服务")),
]

IP_PATTERN = re.compile("^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$")

ENVIRONMENT_CHOICES = [("test", _(u"测试环境")), ("prod", _(u"正式环境"))]
