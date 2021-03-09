# -*- coding: utf-8 -*-
from django.utils.translation import ugettext_lazy as _

from common.constants import ModeEnum


ENV_MODE_TYPE_CHOICES = [
    (ModeEnum.ALL, _(u"所有环境")),
    (ModeEnum.TEST, _(u"测试环境")),
    (ModeEnum.PROD, _(u"正式环境")),
]
