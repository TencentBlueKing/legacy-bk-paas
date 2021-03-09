# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.utils.translation import ugettext as _

from enum import Enum

from django.conf import settings


# 系统应用 cc,job 配置信息
SYS_APP_INFO = {
    "bk_cmdb": {
        "code": "bk_cmdb",
        "name": _("配置平台"),
        "link": "%s://%s" % (settings.HTTP_SCHEMA, settings.HOST_CC),
        "introduction": "蓝鲸配置平台是一款面向应用的CMDB，在ITIL体系里，CMDB是构建其它流程的基石，而在蓝鲸智云体系里，配置平台就扮演着基石的角色，为应用提供了各种运维场景的配置数据服务。",
        "logo": "%sapplogo/bk_cmdb.png" % settings.MEDIA_URL,
        "is_online": True,
    },
    "bk_job": {
        "code": "bk_job",
        "name": _("作业平台"),
        "introduction": "为运维量身定制的脚本自动化操作平台，实现各种复杂运维场景的一键式、自动化操作。包含：批量脚本执行、文件分发、文件拉取、定时任务。流程化执行一系列脚本，各个步骤可自动或人工执行。",
        "link": "%s://%s" % (settings.HTTP_SCHEMA, settings.HOST_JOB),
        "logo": "%sapplogo/bk_job.png" % settings.MEDIA_URL,
        "is_online": True,
    },
}


class LinkTypeEnum(Enum):
    COMMON = 0
    SAAS = 1
    LIGHT_APP = 2


# Home 中常用链接类型
LINK_TYPE_CHOICES = [
    (LinkTypeEnum.COMMON.value, "普通链接"),
    (LinkTypeEnum.SAAS.value, "SaaS链接"),
    (LinkTypeEnum.LIGHT_APP.value, "轻应用"),
]

# 首次显示应用的个数
INDEX_FIRST_SHOW_APPS_COUNT = 12


class LogoImgRelatedDirEnum(Enum):
    APP = "applogo"
    ICON = "iconlogo"
    # saas内置应用logo解压目录
    SAAS = "saaslogo"
