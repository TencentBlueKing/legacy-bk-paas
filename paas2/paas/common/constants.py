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


import re
from enum import Enum

from django.utils.translation import ugettext as _

"""
全局常量
"""


def enum(**enums):
    return type("Enum", (), enums)


# app code的正则常量(由小写英文字母、连接符(-)或数字组成  注意, 不再支持下划线
APP_CODE_REGEX = "[a-z0-9-]+"
# SaaS app code的正则常量(由小写英文字母、下划线、连接符(-)或数字组成
SAAS_CODE_REGEX = "[a-z0-9_-]+"

SAAS_APP_CODE_CHECK_PATTERN = re.compile(r"^[a-z0-9_-]+$")

APP_CODE_CHECK_PATTERN = re.compile(r"^[a-z][a-z0-9-]{1,15}$")
APP_CODE_CHECK_MSG = _(u"只允许输入小写英文字母,连字符或数字,并且以字母开头")

GIT_URL_CHECK_PATTERN = re.compile(r"^(http[s]{0,1}|git)://[a-zA-Z0-9]", re.IGNORECASE)
SVN_URL_CHENK_PATTREN = re.compile(r"^(http[s]{0,1}|svn)://[a-zA-Z0-9]", re.IGNORECASE)
GENERAL_URL_CHECK_PATTERN = re.compile(r"^http[s]{0,1}://", re.IGNORECASE)

DATETIME_FORMAT_STRING = "%Y-%m-%d %H:%M:%S"

ModeEnum = enum(TEST="test", PROD="prod", ALL="all")

ENV_DISPLAY_DICT = {
    ModeEnum.TEST: _(u"测试"),
    ModeEnum.PROD: _(u"正式"),
    ModeEnum.ALL: _(u"全部"),
}

# logo
# 应用logo目录
APP_LOGO_IMG_RELATED = "applogo"
# saas内置应用logo解压目录
SAAS_APP_LOGO_IMG_RELATED = "saaslogo"

# 应用初始化项目代码的目录
APP_INIT_PROJECT_FILES = "app_init_project_files"

# 桌面app默认窗口大小
DESKTOP_DEFAULT_APP_WIDTH = 1200
DESKTOP_DEFAULT_APP_HEIGHT = 720
DESKTOP_DEFAULT_APP_IS_MAX = False
DESKTOP_DEFAULT_APP_IS_DISPLAY = True


# 权限申请状态（开发者权限和组件权限）
ApprovalResultEnum = enum(APPLYING="applying", PASS="pass", REJECT="reject")

APPROVAL_RESULT_CHOICE = [
    (ApprovalResultEnum.APPLYING, _(u"申请中")),
    (ApprovalResultEnum.PASS, _(u"审批通过")),
    (ApprovalResultEnum.REJECT, _(u"驳回")),
]

# 用户角色
RoleCodeEnum = enum(STAFF=0, SUPERUSER=1, DEVELOPER=2, OPERATOR=3)

ROLECODE_CHOICES = [
    (RoleCodeEnum.STAFF, _(u"普通用户")),
    (RoleCodeEnum.SUPERUSER, _(u"超级管理员")),
    (RoleCodeEnum.DEVELOPER, _(u"开发者")),
    (RoleCodeEnum.OPERATOR, _(u"职能化用户")),
]

ROLECODE_LIST = [RoleCodeEnum.STAFF, RoleCodeEnum.SUPERUSER, RoleCodeEnum.DEVELOPER, RoleCodeEnum.OPERATOR]

BLUEKING_APP_NAME_DICT = {
    u"作业平台": _(u"作业平台"),
    u"配置平台": _(u"配置平台"),
}

BLUEKING_APP_INTRO_DICT = {
    u"蓝鲸配置平台是一款面向应用的CMDB，在ITIL体系里，CMDB是构建其它流程的基石，而在蓝鲸智云体系里，配置平台就扮演着基石的角色，为应用提供了各种运维场景的配置数据服务。": _(
        u"蓝鲸配置平台是一款面向应用的CMDB，在ITIL体系里，CMDB是构建其它流程的基石，而在蓝鲸智云体系里，配置平台就扮演着基石的角色，为应用提供了各种运维场景的配置数据服务。"
    ),  # NOQA
    u"作业平台是为运维量身定制的脚本自动化操作平台，实现各种复杂运维场景的一键式、自动化操作。包含：批量脚本执行、文件分发、文件拉取、定时任务。流程化执行一系列脚本，各个步骤可自动或人工执行。": _(
        u"作业平台是为运维量身定制的脚本自动化操作平台，实现各种复杂运维场景的一键式、自动化操作。包含：批量脚本执行、文件分发、文件拉取、定时任务。流程化执行一系列脚本，各个步骤可自动或人工执行。"
    ),  # NOQA
}

BLUEKING_CREATER_DICT = {u"蓝鲸智云": _(u"蓝鲸智云")}

DJANGO_PAGE_CONTENT_LIST = [
    _(u"管理 "),
    _(u"蓝鲸智云后台管理"),
    _(u"蓝鲸智云平台"),
    _(u"修改密码"),
    _(u"您暂时不能访问该站点的后台管理，这是以下原因造成的："),
    _(u"用户"),
    _(u"未激活！"),
    _(u"没有管理员权限，请联系管理员！"),
    _(u"未登录蓝鲸智云平台(401页)"),
    _(u"您需要登录蓝鲸智云"),
    _(u"立即登录"),
    _(u"您没有访问权限(403页)"),
    _(u"您没有访问权限，请联系系统管理员添加"),
    _(u"页面找不到（404页）"),
    _(u"页面找不到了"),
    _(u"系统异常(500页)"),
    _(u"系统出现异常"),
    _(u"努力恢复中，请稍后再试......"),
    _(u"CSRF验证失败"),
    _(u"您看到此消息是由于该站点在提交表单时需要一个CSRF cookie。此项是出于安全考虑，以确保您的浏览器没有被第三方劫持。"),
    _(u"如果您已经设置浏览器禁用cookies，请重新启用，至少针对这个站点，全部HTTPS请求，或者同源请求（same-origin）启用cookies。"),
    _(u"重新登录"),
]


class ConsoleErrorCodes(Enum):
    E1303000_DEFAULT_CODE = 1303000
    E1303001_BASE_SETTINGS_ERROR = 1303001
    E1303002_BASE_DATABASE_ERROR = 1303002
    E1303003_BASE_HTTP_DEPENDENCE_ERROR = 1303003
    E1303004_BASE_BKSUITE_DATABASE_ERROR = 1303004
    E1303005_BASE_LICENSE_ERROR = 1303005

    # 加载桌面应用错误
    E1303100_DESKTOP_USER_APP_LOAD_ERROR = 1303100
    # 应用市场查询应用失败
    E1303101_MARKET_APP_QUERY_FAIL = 1303101
    # 应用市场应用详情查询失败
    E1303102_MARKET_APP_DETAIL_QUERY_FAIL = 1303102

    # 请求微信GET接口出错
    E1303200_WEIXIN_HTTP_GET_REQUEST_ERROR = 1303200
    # 请求微信POST接口出错
    E1303201_WEIXIN_HTTP_POST_REQUEST_ERROR = 1303201
    # 微信公众号推送事件响应出错
    E1303202_WEIXIN_MP_EVENT_PUSH_RESPONSE_ERROR = 1303202
