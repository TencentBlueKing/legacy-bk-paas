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

from django.utils.translation import ugettext as _

from components import usermgr
from common.log import logger
from user_center.constants import WxTypeEnum
from user_center.models import WxBkUserTmpRecord
from blueking.component.shortcuts import get_client_by_user


def get_wx_config():
    """
    获取微信相关配置
    """
    client = get_client_by_user("")
    result = client.esb.get_weixin_config()
    if not result.get("result", False):
        logger.error("Get weixin config from esb fail, result=%s", result)
        return None

    comp_conf = result.get("data", {})
    # 检查微信配置的完整性
    if not comp_conf or not isinstance(comp_conf, dict):
        logger.error("WeChat notification component configuration is empty")
        return None

    if comp_conf.get("wx_type") not in [WxTypeEnum.MP, WxTypeEnum.QY, WxTypeEnum.QYWX]:
        logger.error("WeChat notification component WeChat type configuration error, Comp_conf:%s" % comp_conf)
        return None

    is_complete = comp_conf.get("wx_app_id") and comp_conf.get("wx_secret") and comp_conf.get("wx_token")
    if comp_conf.get("wx_type") == WxTypeEnum.MP and not is_complete:
        error_msg = (
            "WeChat Official Account notification component configuration is incomplete"
            "Is_complete: %s, Comp_conf:%s"
        ) % (is_complete, comp_conf)
        logger.error(error_msg)
        return None

    is_complete = (
        comp_conf.get("wx_qy_corpid") and comp_conf.get("wx_qy_corpsecret") and comp_conf.get("wx_qy_agentid")
    )
    if comp_conf.get("wx_type") in [WxTypeEnum.QY, WxTypeEnum.QYWX] and not is_complete:
        error_msg = (
            "WeChat Corporation ID / Work WeChat notification component configuration is incomplete"
            "Is_complete: %s, Comp_conf:%s"
        ) % (is_complete, comp_conf)
        logger.error(error_msg)
        return None

    return comp_conf


def get_wx_userid(request):
    """
    获取微信userid
    """
    username = request.user.username
    return usermgr.get_user_wx(username)


def get_user_wx_info(request):
    """
    查询是否用户的微信信息（包括微信类型和微信用户id）
    :return: (wx_type, wx_userid)
    """
    comp_conf = get_wx_config()
    is_use_wx_component = comp_conf is not None
    wx_type = comp_conf.get("wx_type") if is_use_wx_component else None
    wx_userid = get_wx_userid(request) if is_use_wx_component else ""
    return (wx_type, wx_userid)


def bind_user_wx_info(wx_ticket, wx_userid):
    """
    绑定用户微信信息
    """
    try:
        # bk_token = WxBkUserTmpRecord.objects.get(wx_ticket=wx_ticket).bk_token
        # is_success, message = remote_bind_wx_user_info(bk_token, wx_userid)
        username = WxBkUserTmpRecord.objects.get(wx_ticket=wx_ticket).username
        is_success, message = usermgr.bind_user_wx(username, wx_userid)
    except WxBkUserTmpRecord.DoesNotExist:
        is_success, message = False, _(u"不存在该微信二维码的扫描用户")
    return is_success, message
