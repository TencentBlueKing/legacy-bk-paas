# -*- coding: utf-8 -*-
from common.constants import enum

# 微信类型
WxTypeEnum = enum(MP="mp", QY="qy", QYWX="qywx")

# 微信公众号API相关URL
WEIXIN_MP_API_URL = {
    "get_access_token": "https://api.weixin.qq.com/cgi-bin/token",
    "create_qrcode": "https://api.weixin.qq.com/cgi-bin/qrcode/create",
    "show_qrcode_url": "https://mp.weixin.qq.com/cgi-bin/showqrcode",
}

# 微信企业号/企业微信API相关URL
WEIXIN_QY_API_URL = {
    WxTypeEnum.QY: {
        "get_access_token": "https://qyapi.weixin.qq.com/cgi-bin/gettoken",
        "login_url": "https://qy.weixin.qq.com/cgi-bin/loginpage",
        "get_login_info": "https://qyapi.weixin.qq.com/cgi-bin/service/get_login_info",
    },
    WxTypeEnum.QYWX: {
        "get_access_token": "https://qyapi.weixin.qq.com/cgi-bin/gettoken",
        "login_url": "https://open.work.weixin.qq.com/wwopen/sso/qrConnect",
        "get_user_info": "https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo",
    },
}

# 微信公众号临时二维码过期时长
WEIXIN_MP_QRCODE_EXPIRE_SECONDS = 7200
