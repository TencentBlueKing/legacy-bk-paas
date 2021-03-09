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

from esb.utils import SmartHost
from .tools import get_base64_icon


SYSTEM_NAME = "CMSI"


host = SmartHost(
    host_prod="need_to_be_updated",
)


# 通过 SMTP 发送邮件的配置
smtp_host = ""
smtp_port = 25
smtp_user = ""
smtp_pwd = ""
smtp_usessl = False
smtp_usetls = False
mail_sender = "blueking@bking.com"


# 通过第三方接口发送邮件的配置
dest_url = ""  # 邮件第三方接口完整路径

# send_weixin 组件微信消息类型配置
wx_type = "qy"

# 发送微信公众号消息配置
wx_app_id = ""
wx_secret = ""
wx_template_id = "yrxKwt3OR4BGvuZzwiASaSm_GfOtxwak3mMfh5Ijiaw"

# 微信企业号配置
wx_qy_corpid = ""
wx_qy_corpsecret = ""
wx_qy_agentid = ""

# 发送短信腾讯云配置 sdkappid 对应的 appkey，需要业务方高度保密
qcloud_app_id = ""
qcloud_app_key = ""
# 腾讯云短信签名
qcloud_sms_sign = ""

# cmsi支持的信息发送类型
msg_type = [
    {
        "type": "weixin",
        "label": u"微信",
        "label_en": "weixin",
        "active_icon": get_base64_icon("icons_v2/wechat_active.ico"),
        "unactive_icon": get_base64_icon("icons_v2/wechat_unactive.ico"),
    },
    {
        "type": "mail",
        "label": u"邮件",
        "label_en": "mail",
        "active_icon": get_base64_icon("icons_v2/mail_active.ico"),
        "unactive_icon": get_base64_icon("icons_v2/mail_unactive.ico"),
    },
    {
        "type": "sms",
        "label": u"短信",
        "label_en": "sms",
        "active_icon": get_base64_icon("icons_v2/sms_active.ico"),
        "unactive_icon": get_base64_icon("icons_v2/sms_unactive.ico"),
    },
    {
        "type": "voice",
        "label": u"语音",
        "label_en": "voice",
        "active_icon": get_base64_icon("icons_v2/voice_active.ico"),
        "unactive_icon": get_base64_icon("icons_v2/voice_unactive.ico"),
    },
]

msg_type_map = {"weixin": "send_weixin", "mail": "send_mail", "sms": "send_sms", "voice": "send_voice_msg"}
