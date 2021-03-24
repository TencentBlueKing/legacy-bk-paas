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

from builtins import str
from django.utils.translation import ugettext as _

from app.models import App, AppTags
from app.constants import VCS_TYPE_VALID_VALUES

from common.constants import (
    APP_CODE_CHECK_PATTERN,
    APP_CODE_CHECK_MSG,
    GIT_URL_CHECK_PATTERN,
    SVN_URL_CHENK_PATTREN,
    GENERAL_URL_CHECK_PATTERN,
)


def validate_app_code(app_code):
    """
    检查app_code是否合法
    """
    if not app_code:
        return False, _(u"应用ID不能为空")

    code_len = len(app_code)

    if code_len < 3:
        return False, _(u"应用ID长度不能少于3个字符")

    if code_len > 16:
        return False, _(u"应用ID长度不能超过16个字符")

    if not APP_CODE_CHECK_PATTERN.match(app_code):
        return False, APP_CODE_CHECK_MSG

    # NOTE: 这里去除了敏感词
    is_exists = App.objects.filter(code=app_code).exists()
    if is_exists:
        return False, _(u"应用 ID[%s]已存在") % app_code

    return True, _(u"校验通过")


def validate_external_url(external_url):
    """
    校验第三方系统 URL
    """
    cur_pattern = GENERAL_URL_CHECK_PATTERN
    if not cur_pattern.match(external_url):
        return False, _(u"请填写正确的系统URL，支持http和https")

    return True, _(u"校验通过")


def validate_app_name(name, old_name):
    """
    校验app名称
    """
    if not name:
        return False, _(u"应用名称不能为空")

    if len(name) > 20:
        return False, _(u"应用名称长度不能超过20个字符")

    if old_name:
        is_exists = App.objects.filter(name=name).exclude(name=old_name).exists()
    else:
        is_exists = App.objects.filter(name=name).exists()
    if is_exists:
        return False, _(u"应用名称[%s]已存在") % name
    return True, _(u"校验通过")


def validate_vcs_url(vcs_type, vcs_url):
    """
    校验地址
    """
    try:
        vcs_type = int(vcs_type)
    except Exception:
        return False, _(u"代码仓库[%s]不合法") % vcs_type
    if vcs_type not in VCS_TYPE_VALID_VALUES:
        return False, _(u"代码仓库[%s]不合法") % vcs_type

    cur_pattern = GIT_URL_CHECK_PATTERN if str(vcs_type) == "0" else SVN_URL_CHENK_PATTREN
    if not cur_pattern.match(vcs_url):
        return False, _(u"请填写正确的仓库地址")

    vcs_url = vcs_url.strip()
    if " " in vcs_url or "|" in vcs_url or "&" in vcs_url or ";" in vcs_url:
        return False, _(u"请填写正确的仓库地址")

    return True, _(u"校验通过")


def validate_app_tags(app_tags):
    tag = AppTags.objects.filter(code=app_tags)
    if tag:
        return True, _(u"校验通过"), tag[0]
    else:
        return False, _(u"应用分类[%s]不存在") % app_tags, None
