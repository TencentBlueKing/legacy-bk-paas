# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

from __future__ import unicode_literals

import hashlib
import json
import random
import time
import uuid
import xml.etree.cElementTree as ET

from django.conf import settings
from django.utils.http import urlencode
from django.utils.translation import ugettext as _

import requests
from blueking.component.shortcuts import get_client_by_user
from common.constants import ConsoleErrorCodes
from common.log import logger
from user_center.constants import (WEIXIN_MP_API_URL,
                                   WEIXIN_MP_QRCODE_EXPIRE_SECONDS,
                                   WEIXIN_QY_API_URL, WxTypeEnum)
from user_center.weixin.utils import (bind_user_wx_info, get_smart_paas_domain,
                                      get_wx_config)

# Use connection pool
rpool = requests.Session()


class WeiXinApiBase(object):
    """
    Api 请求的基础类型
    """

    def __init__(self):
        self.timeout = 10
        self.ssl_verify = False

    def get(self, url, **kwargs):
        """
        GET方法，编码问题解决
        """
        try:
            resp = rpool.get(url, params=kwargs, timeout=self.timeout, verify=self.ssl_verify)
            resp.encoding = 'utf-8'
            result = resp.json()
        except Exception as error:
            error_message = '%s requests get url:%s error: %s'.format(ConsoleErrorCodes.E1303200_WEIXIN_HTTP_GET_REQUEST_ERROR.value, # noqa
                                                                      url,
                                                                      error)
            logger.error(error_message)
            result = {}
        return result

    def post(self, url, params={}, data={}, json_data={}):
        """
        POST方法
        """
        try:
            resp = rpool.post(
                url, params=params, json=json_data, data=data, timeout=self.timeout, verify=self.ssl_verify)
            resp.encoding = 'utf-8'
            result = resp.json()
        except Exception as error:
            error_message = '{} requests post url:{} error: {}'.format(ConsoleErrorCodes.E1303201_WEIXIN_HTTP_POST_REQUEST_ERROR.value, # noqa
                                                                       url,
                                                                       error)
            logger.error(error_message)
            result = {}
        return result

    def get_access_token_from_esb(self):
        """
        从ESB获取access_token
        """
        client = get_client_by_user('admin')
        esb_result = client.esb.get_weixin_access_token({})
        return esb_result


class WeiXinMpApi(WeiXinApiBase):
    """
    微信公众号相关API请求
    """
    def __init__(self):
        super(WeiXinMpApi, self).__init__()
        comp_conf = get_wx_config()
        self.appid = comp_conf.get('wx_app_id')
        self.secret = comp_conf.get('wx_secret')
        self.token = comp_conf.get('wx_token')
        self.event = None

    @property
    def access_token(self):
        """
        使用ESB提供的token
        """
        if settings.ENVIRONMENT == 'development':
            import redis
            rd = redis.Redis('127.0.0.1', 6379)
            cache_token = rd.get('WEIXIN_MP_ACCESS_TOKEN')
            if cache_token:
                token = json.loads(cache_token)['ACCESS_TOKEN']
                return token
            token = self._get_access_token()
            return token

        result = self.get_access_token_from_esb()
        if not result.get('result'):
            logger.error('esb get_access_token error: %s', result)
        token = result['data'].get('access_token')
        return token

    def _get_access_token(self):
        """
        获取access_token
        """
        url = WEIXIN_MP_API_URL['get_access_token']
        param = {'appid': self.appid, 'secret': self.secret, 'grant_type': 'client_credential'}
        resp = self.get(url, **param)
        token = resp.get('access_token')
        expires_in = resp.get('expires_in', 7200)
        data = {'ACCESS_TOKEN': token, 'expires_in': expires_in}
        if token and expires_in:
            import redis
            rd = redis.Redis('127.0.0.1', 6379)
            rd.set('WEIXIN_MP_ACCESS_TOKEN', json.dumps(data))
        return token

    def create_qrcode_with_scene(self):
        """
        创建临时二维码
        :return ok, ticket
        """
        url = WEIXIN_MP_API_URL['create_qrcode']
        params = {'access_token': self.access_token}
        scene_id = random.randint(1, 2**31)
        data = {'action_name': 'QR_SCENE',
                'expire_seconds': WEIXIN_MP_QRCODE_EXPIRE_SECONDS,
                'action_info': {'scene': {'scene_id': scene_id}}}
        resp = self.post(url, params=params, json_data=data)
        if resp.get('errcode'):
            logger.error('create qrcode failed %s', resp)
            return None
        return resp.get('ticket')

    def gen_qrcode_url(self, ticket):
        """
        生成可展示的二维码图片URL
        """
        param = {'ticket': ticket}
        url = "{}?{}".format(WEIXIN_MP_API_URL['show_qrcode_url'], urlencode(param))
        return url

    def check_sign(self, signature, timestamp, nonce):
        """
        微信服务器回调后的签名认证
        """
        if not signature:
            return False, _("验证失败：signature参数不能为空")
        if not timestamp:
            return False, _("验证失败：timestamp参数不能为空")
        if not nonce:
            return False, _("验证失败：nonce参数不能为空")
        raw = ''.join(sorted([self.token, timestamp, nonce]))
        _sign = hashlib.sha1(raw).hexdigest()
        if _sign != signature:
            return False, _("验证失败：signature错误")
        return True, ''

    def parse(self, raw_data):
        """
        解析微信推送的事件或消息内容
        """
        logger.info('weixin push raw_data is: %s', raw_data)
        try:
            doc = ET.fromstring(raw_data)
            data = dict((i.tag, i.text) for i in doc)
        except Exception as error:
            logger.info('parse raw_data: error: %s', error)
            data = {}
        return data

    def render_msg(self, from_user, to_user, content):
        """
        组装渲染响应消息
        """
        tpl = '''<xml>
                <ToUserName><![CDATA[%s]]></ToUserName>
                <FromUserName><![CDATA[%s]]></FromUserName>
                <CreateTime>%s</CreateTime>
                <MsgType><![CDATA[%s]]></MsgType>
                <Content><![CDATA[%s]]></Content>
                <FuncFlag>0</FuncFlag>
                </xml>'''
        return tpl % (to_user, from_user, int(time.time()), 'text', content)

    def handle_weixin_push(self, raw_data):
        """
        处理微信推送（包括：普通消息，消息事件，菜单事件推送），暂时只处理消息事件中事件为：SCAN和subscribe
        """
        event = self.parse(raw_data)
        # 非法消息，直接回复空字符串
        if not event.get('MsgType') or not event.get('ToUserName') or not event.get('FromUserName'):
            return ''
        # 只处理消息事件中事件为：SCAN和subscribe，其他回复空字符串
        if event['MsgType'] != 'event' or (event['Event'] != 'SCAN' and event['Event'] != 'subscribe'):
            return ''

        from_user = event['FromUserName']
        to_user = event['ToUserName']
        ticket = event['Ticket']
        # 绑定用户
        ok, message = bind_user_wx_info(ticket, from_user)
        if not ok:
            return self.render_msg(to_user, from_user, message)
        return self.render_msg(to_user, from_user, _("绑定成功"))


class WeiXinQyApi(WeiXinApiBase):
    """
    微信企业号/企业微信相关API请求
    """
    def __init__(self):
        super(WeiXinQyApi, self).__init__()
        comp_conf = get_wx_config()
        self.wx_type = comp_conf.get('wx_type')
        self.corpid = comp_conf.get('wx_qy_corpid')
        self.secret = comp_conf.get('wx_qy_corpsecret')
        self.agentid = comp_conf.get('wx_qy_agentid')
        self.api_url = WEIXIN_QY_API_URL[self.wx_type]
        self.login_callback_url = 'http://{}/console/user_center/weixin/qy/login_callback/'.format(get_smart_paas_domain()) # noqa

    @property
    def access_token(self):
        """
        使用ESB提供的token
        """
        if settings.ENVIRONMENT == 'development':
            import redis
            rd = redis.Redis('127.0.0.1', 6379)
            token_rd_key = 'WEIXIN_{}_ACCESS_TOKEN'.format(self.wx_type.upper())
            cache_token = rd.get(token_rd_key)
            if cache_token:
                token = json.loads(cache_token)['ACCESS_TOKEN']
                return token
            token = self._get_access_token()
            return token

        result = self.get_access_token_from_esb()
        if not result.get('result'):
            logger.error('esb get_access_token error: %s', result)
        token = result['data'].get('access_token')
        return token

    def _get_access_token(self):
        """
        获取access_token
        """
        url = self.api_url['get_access_token']
        param = {'corpid': self.corpid, 'corpsecret': self.secret}
        resp = self.get(url, **param)
        token = resp.get('access_token')
        expires_in = resp.get('expires_in', 7200)
        data = {'ACCESS_TOKEN': token, 'expires_in': expires_in}
        if token and expires_in:
            import redis
            rd = redis.Redis('127.0.0.1', 6379)
            token_rd_key = 'WEIXIN_{}_ACCESS_TOKEN'.format(self.wx_type.upper())
            rd.set(token_rd_key, json.dumps(data))
        return token

    def gen_login_url(self):
        """
        生成企业号/企业微信的登录链接
        """
        param_dict = {
            WxTypeEnum.QY.value: {
                'corp_id': self.corpid,
                'usertype': 'all'
            },
            WxTypeEnum.QYWX.value: {
                'appid': self.corpid,
                'agentid': self.agentid
            }
        }
        param = param_dict[self.wx_type]
        state = str(uuid.uuid4())
        param['state'] = state
        param['redirect_uri'] = self.login_callback_url
        url = "{}?{}".format(self.api_url['login_url'], urlencode(param))
        return url, state

    def _get_login_user_info_by_qy(self, auth_code):
        """
        【企业号】通过auth_code 获取登录的用户信息
        """
        url = self.api_url['get_login_info']
        params = {'access_token': self.access_token}
        data = {'auth_code': auth_code}
        resp = self.post(url, params=params, json_data=data)
        if resp.get('errcode'):
            logger.error('get login user info failed %s', resp)
            return None
        if not resp.get('user_info').get('userid'):
            logger.error('get login userid error %s', resp)
            return None
        return resp.get('user_info').get('userid')

    def _get_login_user_info_by_qywx(self, code):
        """
        【企业微信】通过code 获取登录的用户信息
        """
        url = self.api_url['get_user_info']
        params = {'access_token': self.access_token, 'code': code}
        resp = self.get(url, **params)
        if resp.get('errcode'):
            logger.error('get login user info failed %s', resp)
            return None
        if not resp.get('UserId'):
            logger.error('get login userid error %s', resp)
            return None
        return resp.get('UserId')

    def get_login_user_info(self, auth_code):
        """
        通过登录的code获取用户信息
        """
        if self.wx_type == WxTypeEnum.QYWX.value:
            return self._get_login_user_info_by_qywx(auth_code)
        return self._get_login_user_info_by_qy(auth_code)
