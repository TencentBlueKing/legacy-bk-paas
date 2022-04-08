# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS
Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License.
You may obtain a copy of the License at http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
specific language governing permissions and limitations under the License.
"""

from __future__ import unicode_literals

from django.utils.translation import ugettext as _

from enum import Enum

from django.conf import settings


# 系统应用 cc,job 配置信息
def get_cmdb_job_info(code):
    if code == "bk_cmdb":
        return {
            "code": "bk_cmdb",
            "name": _("配置平台"),
            "link": "%s://%s" % (settings.HTTP_SCHEMA, settings.HOST_CC),
            "introduction": _(
                "蓝鲸配置平台是一款面向应用的CMDB，在ITIL体系里，CMDB是构建其它流程的基石，而在蓝鲸智云体系里，配置平台就扮演着基石的角色，为应用提供了各种运维场景的配置数据服务。"
            ),
            "logo": "%sapplogo/bk_cmdb.png" % settings.MEDIA_URL,
            "is_online": True,
        }
    if code == "bk_job":
        return {
            "code": "bk_job",
            "name": _("作业平台"),
            "introduction": _(
                "作业平台是为运维量身定制的脚本自动化操作平台，实现各种复杂运维场景的一键式、自动化操作。包含：批量脚本执行、文件分发、文件拉取、定时任务。流程化执行一系列脚本，各个步骤可自动或人工执行。"
            ),
            "link": "%s://%s" % (settings.HTTP_SCHEMA, settings.HOST_JOB),
            "logo": "%sapplogo/bk_job.png" % settings.MEDIA_URL,
            "is_online": True,
        }
    return None


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
