# -*- coding: utf-8 -*-
from django.utils.translation import ugettext_lazy as _

from common.constants import enum

AppStateEnum = enum(
    OUTLINE=0,
    DEVELOPMENT=1,
    TEST=3,
    ONLINE=4,
    IN_TEST=8,
    IN_ONLINE=9,
    IN_OUTLINE=10,
)

# 应用状态信息
STATE_CHOICES = [
    (AppStateEnum.OUTLINE, _(u"已下架")),
    (AppStateEnum.DEVELOPMENT, _(u"开发中")),
    (AppStateEnum.TEST, _(u"测试中")),
    (AppStateEnum.ONLINE, _(u"已上线")),
    (AppStateEnum.IN_TEST, _(u"正在提测")),
    (AppStateEnum.IN_ONLINE, _(u"正在上线")),
    (AppStateEnum.IN_OUTLINE, _(u"正在下架")),
]


LANGUAGE_CHOICES = [
    ("python", "Python"),
    ("php", "PHP"),
]


OpenModeEnum = enum(DESKTOP="desktop", NEW_TAB="new_tab")

OPENMODE_CHOICES = [(OpenModeEnum.DESKTOP, _(u"桌面")), (OpenModeEnum.NEW_TAB, _(u"新标签页"))]
