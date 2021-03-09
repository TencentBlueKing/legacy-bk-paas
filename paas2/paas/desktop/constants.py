# -*- coding: utf-8 -*-
from django.utils.translation import ugettext as _

from common.constants import enum

# 应用市场左侧导航类别
MarketNavEnum = enum(
    CREATOR=0,
    APPTAG=1,
)

MARKET_NAV_CHOICES = [
    (MarketNavEnum.CREATOR, _(u"应用创建者")),
    (MarketNavEnum.APPTAG, _(u"应用分类")),
]
