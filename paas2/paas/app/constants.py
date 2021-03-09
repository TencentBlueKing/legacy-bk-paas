# -*- coding: utf-8 -*-
from django.utils.translation import ugettext as _

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
STATE_CHOICES_DISPALY_DICT = dict(STATE_CHOICES)

# 集成应用（第三方应用）应用状态信息
TPAPP_STATE_DISPLAY_DICT = {
    AppStateEnum.OUTLINE: _(u"已下架"),
    AppStateEnum.DEVELOPMENT: _(u"开发中"),
    AppStateEnum.TEST: _(u"开发中"),
    AppStateEnum.ONLINE: _(u"已上线"),
    AppStateEnum.IN_TEST: _(u"开发中"),
    AppStateEnum.IN_ONLINE: _(u"已上线"),
    AppStateEnum.IN_OUTLINE: _(u"已下架"),
}

# App允许打开条件: ALL全部/TEST 只有测试/PRO只有正式/NONE不能打开
AppOpenEnum = enum(
    OPEN_IN_ALL=1,
    OPEN_IN_TEST=2,
    OPEN_IN_PRO=3,
    OPEN_NONE=4,
)

LanguageEnum = enum(
    PYTHON="python",
    JAVA="java",
    PHP="php",
)
LANGUAGE_CHOICES = [
    (LanguageEnum.PYTHON, "Python"),
    (LanguageEnum.JAVA, "Java"),
    (LanguageEnum.PHP, "PHP"),
]
LANGUAGE_VALID_VALUES = dict(LANGUAGE_CHOICES).keys()

VCS_TYPE_CHOICES = [
    (0, u"Git"),
    (1, u"SVN"),
]
VCS_TYPE_VALID_VALUES = dict(VCS_TYPE_CHOICES).keys()


DB_TYPE_CHOICES = [
    (
        "mysql",
        "MySQL",
    ),
    ("postgresql", "PostgreSQL"),
    ("oracle", "Oracle"),
    ("db2", "DB2"),
    ("sqlserver", "SQL Server"),
]
DB_TYPE_VALID_VALUES = dict(DB_TYPE_CHOICES).keys()

APP_TAGS_CHOICES = [
    (_(u"运维工具"), "OpsTools"),
    (_(u"监控告警"), "MonitorAlarm"),
    (_(u"配置管理"), "ConfManage"),
    (_(u"开发工具"), "DevTools"),
    (_(u"企业IT"), "EnterpriseIT"),
    (_(u"办公应用"), "OfficeApp"),
    (_(u"其它"), "Other"),
]

OpenModeEnum = enum(DESKTOP="desktop", NEW_TAB="new_tab")

OPENMODE_CHOICES = [(OpenModeEnum.DESKTOP, _(u"桌面")), (OpenModeEnum.NEW_TAB, _(u"新标签页"))]


OPENMODE_DICT = dict(OPENMODE_CHOICES)
