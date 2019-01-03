# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

from __future__ import unicode_literals

from django.conf import settings
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.utils.translation import ugettext as _
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from account.decorators import login_exempt
from common.constants import ConsoleErrorCodes
from common.log import logger
from components import login
from user_center.decorators import is_unbound_weixin
from user_center.models import WxBkUserTmpRecord
from user_center.weixin.core import WeiXinMpApi, WeiXinQyApi
from user_center.weixin.utils import get_wx_userid


def get_bind_status(request):
    """
    【公众号/企业号/企业微信】查询绑定状态
    """
    wx_userid = get_wx_userid(request)
    is_bind = True if wx_userid else False
    return JsonResponse({'result': is_bind})


@require_POST
def unbind_wx_user_info(request):
    """
    【公众号/企业号/企业微信】解绑微信
    """
    bk_token = request.COOKIES.get(settings.BK_COOKIE_NAME)
    ok, message = login.unbind_wx_user_info(bk_token)
    return JsonResponse({'result': ok, 'message': message})


@is_unbound_weixin
def get_qrcode_by_mp(request):
    """
    【公众号】获取临时唯一二维码
    """
    # 创建二维码
    wxapi = WeiXinMpApi()
    ticket = wxapi.create_qrcode_with_scene()
    if not ticket:
        return JsonResponse({'result': False, 'message': _("后台获取公众号二维码失败，请联系系统管理员检查微信配置")})
    # 记录username, bk_token, 与 ticket的关系
    ok = WxBkUserTmpRecord.objects.create_tmp_record(request, ticket)
    if not ok:
        return JsonResponse({'result': False, 'message': _("创建记录失败，请联系系统管理员处理")})
    # 组装页面需展示的二维码URL
    url = wxapi.gen_qrcode_url(ticket)
    return JsonResponse({'result': True, 'url': url})


@csrf_exempt
@login_exempt
def weixin_mp_callback(request):
    """
    【公众号】接收微信事件的推送
    """
    signature = request.GET.get('signature')
    timestamp = request.GET.get('timestamp')
    nonce = request.GET.get('nonce')
    # 校验签名
    wxapi = WeiXinMpApi()
    is_vaild, message = wxapi.check_sign(signature, timestamp, nonce)
    if not is_vaild:
        return HttpResponse(message)

    # GET请求，微信服务器确实开发服务配置是否正确
    if request.method == 'GET':
        return HttpResponse(request.GET.get('echostr'))

    try:
        # POST请求，处理微信推送
        message = wxapi.handle_weixin_push(request.body)
    except Exception as error:
        error_message = '{} weixin_mp_callback error: {}'.format(ConsoleErrorCodes.E1303202_WEIXIN_MP_EVENT_PUSH_RESPONSE_ERROR.value,  # noqa
                                                                 error)
        logger.error(error_message)
        message = _("API请求异常，请联系管理员处理")
    return HttpResponse(message)


@is_unbound_weixin
def get_login_url_by_qy(request):
    """
    【企业号/企业微信】获取扫描登录的URL
    """
    # 生成企业号/企业微信登录链接
    wxapi = WeiXinQyApi()
    url, state = wxapi.gen_login_url()
    # 记录username, bk_token, 与 ticket的关系
    ok = WxBkUserTmpRecord.objects.create_tmp_record(request, state)
    if not ok:
        return JsonResponse({'result': False, 'message': _("创建记录失败，请联系系统管理员处理")})
    return JsonResponse({'result': True, 'url': url})


def weixin_qy_login_callback(request):
    """
    【企业号/企业微信】企业号/企业微信登录后回调
    """
    state = request.GET.get('state')
    bk_token = request.COOKIES.get(settings.BK_COOKIE_NAME)
    # 企业号为auth_code, 企业微信为 code
    auth_code = request.GET.get('auth_code') or request.GET.get('code')
    # 检查state，防止跨域攻击
    if not WxBkUserTmpRecord.objects.filter(bk_token=bk_token, wx_ticket=state).exists():
        return render(request, 'user_center/weixin_bind_error.html',
                      {'error_message': _("您没有权限，请联系系统管理员")})
    # 获取登录用户的wx_userid
    wxapi = WeiXinQyApi()
    wx_userid = wxapi.get_login_user_info(auth_code)
    if not wx_userid:
        return render(request, 'user_center/weixin_bind_error.html',
                      {'error_message': _("绑定失败，请联系系统管理员")})
    # 绑定
    ok, message = login.bind_wx_user_info(bk_token, wx_userid)
    if not ok:
        return render(request, 'user_center/weixin_bind_error.html',
                      {'error_message': _("绑定出错，请联系系统管理员")})

    return render(request, 'user_center/weixin_qy_bind_success.html')
