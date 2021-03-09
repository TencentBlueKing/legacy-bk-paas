# -*- coding: utf-8 -*-
from django.utils.translation import ugettext as _

ESB_API_AUTH_LEVEL = [
    (0, _(u"无限制")),
    (1, _(u"普通权限")),
    (2, _(u"敏感权限")),
    (3, _(u"特殊权限")),
]

ESB_API_AUTH_LEVEL_DICT = dict(ESB_API_AUTH_LEVEL)
