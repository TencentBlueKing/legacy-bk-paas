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

from django.db import transaction
from django.db.models import Q
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.utils.translation import ugettext as _

from account.decorators import login_exempt, developer_limit_exempt
from app_maker.decorators import signature_required
from common.log import logger
from app.models import App, AppTags
from app.constants import AppStateEnum
from app.validators import validate_app_name
from api.utils import InnerFeedback
from app_maker.validators import validate_app_url, check_request_valid
from app_maker.utils import generate_app_maker_code


@csrf_exempt
@login_exempt
@require_POST
@signature_required()
def create_app(request):
    """
    @api {POST} /paas/api/app_maker/app/create/ create_app
    @apiName create_app
    @apiGroup APP_MAKER
    @apiVersion 1.0.0
    @apiDescription 创建轻应用
    @apiParam (签名校验参数(GET参数)) {String} app_code 应用ID
    @apiParam (签名校验参数(GET参数)) {Number} Nonce 签名的随机数，{1-100000}
    @apiParam (签名校验参数(GET参数)) {Number} Timestamp 时间戳
    @apiParam (签名校验参数(GET参数)) {String} Signature 签名串，由app_code, Nonce, Timestamp, Data(Data值为request.body)的签名
    @apiParam (接口参数(POST参数)) {String} creator 轻应用创建者
    @apiParam (接口参数(POST参数)) {String} app_name 轻应用名称
    @apiParam (接口参数(POST参数)) {String} app_url 轻应用链接
    @apiParam (接口参数(POST参数)) {String} developer 轻应用开发者用户名，多个以分号';'分隔
    @apiParam (接口参数(POST参数)) {String} [app_tag] 轻应用分类，没有则默认为其它
    @apiParam (接口参数(POST参数)) {String} [introduction] 轻应用的简介，没有则默认为标准运维的简介
    @apiParam (接口参数(POST参数)) {Number} [width] 轻应用在桌面打开窗口宽度，没有则默认为标准运维的窗口宽度
    @apiParam (接口参数(POST参数)) {Number} [height] 轻应用在桌面打开窗口高度，没有则默认为标准运维的窗口高度
    @apiParamExample {python} 示例:
        # -*- coding: utf-8 -*-
        import json
        import time
        import base64
        import hashlib
        import hmac
        import random

        import requests


        def compute_signature(method, host, url, params, secret_key):
            params = '&'.join(['%s=%s' % (i, params[i]) for i in sorted(params)])
            message = '%s%s%s?%s' % (method, host, url, params)
            digest_make = hmac.new(str(secret_key), str(message), hashlib.sha1).digest()
            _signature = base64.b64encode(digest_make)
            return _signature


        if __name__ == '__main__':
            BASE_HOST = 'paas.bking.com'
            CREATE_APP_PATH = '/paas/api/app_maker/app/create/'
            CREATE_APP_URL = 'http://%s%s' % (BASE_HOST, CREATE_APP_PATH)
            app_code = 'test_app_code'
            app_secret = 'test_app_token'
            nonce = random.randint(1, 100000)
            timestamp = str(int(time.time()))
            # 接口参数
            data = {
                'creator': 'admin',
                'app_name': u"轻应用测试",
                'app_url': 'http://paas.bking.com/o/gcloud/xxx/',
                'developer': 'test1;test2',
                'introduction': 'introduction',
                'width': 1024,
                'height': 768
            }
            data = json.dumps(data)
            # 签名校验通用参数
            params = {
                'app_code': app_code,
                'Nonce': nonce,
                'Timestamp': timestamp,
                'Data': data
            }
            signature = compute_signature('POST', BASE_HOST, CREATE_APP_PATH, params, app_secret)
            params['Signature'] = signature
            params.pop('Data', None)
            # 发起请求
            result = requests.post(CREATE_APP_URL, params=params, data=data)
            print result
            print result.content
    @apiSuccessExample {json} Success-Response
        HTTP/1.1 200 OK
        {
            "result": true,
            "code": '00',
            "message": "",
            "data": {
                "app_code": "gcloud_fdfh2kl0k"
            }
        }
    """
    feedback = InnerFeedback()
    # 限制同域名下才能访问
    is_request_valid = check_request_valid(request)
    if not is_request_valid:
        feedback["result"] = True
        feedback["message"] = _(u"请在正式环境上操作该接口")
        return JsonResponse(feedback)
    # 获取参数
    parent_code = request.GET.get("app_code")
    # 获取参数
    request_data = request.POST
    app_name = request_data.get("app_name", "")
    app_url = request_data.get("app_url", "")
    creater = request_data.get("creator", "")
    developers = request_data.get("developer", "")
    logo = request_data.get("logo", "")
    width = request_data.get("width")
    height = request_data.get("height")
    app_tag = request_data.get("app_tag")
    introduction = request_data.get("introduction")

    # 参数合法性校验
    is_name_valid, name_msg = validate_app_name(app_name, "")
    if not is_name_valid:
        feedback["result"] = False
        feedback["message"] = name_msg
        return JsonResponse(feedback)

    is_app_url_valid, app_url_msg = validate_app_url(app_url)
    if not is_app_url_valid:
        feedback["result"] = False
        feedback["message"] = app_url_msg
        return JsonResponse(feedback)

    app_tag = AppTags.objects.get_tag_by_code(app_tag)

    # 生成 轻应用 APP_ID
    is_app_maker_code_valid, app_maker_code, app_maker_code_msg = generate_app_maker_code(parent_code)
    if not is_app_maker_code_valid:
        feedback["result"] = False
        feedback["message"] = app_maker_code_msg
        return JsonResponse(feedback)

    parent_app = App.objects.get(code=parent_code)

    # 保存应用信息到数据库
    try:
        with transaction.atomic():
            app = App.objects.create(
                name=app_name,
                code=app_maker_code,
                creater=creater,
                tags=app_tag,
                is_third=True,
                is_lapp=True,
                external_url=app_url,
                logo=logo,
                state=AppStateEnum.ONLINE,
                is_already_test=True,
                first_test_time=timezone.now(),
                is_already_online=True,
                first_online_time=timezone.now(),
                # 可修改参数 TODO
                width=width or parent_app.width,
                height=height or parent_app.height,
                introduction=introduction or parent_app.introduction,
                # 完全继承
                is_max=parent_app.is_max,
                is_setbar=parent_app.is_setbar,
                is_resize=parent_app.is_resize,
            )
            # 保存开发负责人信息
            developer_list = developers.split(";") if developers else []
            user_model = get_user_model()
            if developer_list:
                for dev in developer_list:
                    try:
                        d_user, _c = user_model.objects.get_or_create(username=dev)
                        app.developer.add(d_user)
                    except Exception as e:
                        # 获取用户[username:%s]异常:%s
                        logger.exception(u"get user[username:%s] fail:%s" % (dev, e))
        feedback["data"] = {"app_code": app.code}
    except Exception as e:
        # 创建应用时，保存应用基本信息出错:%s
        logger.exception(u"save app base info fail: %s" % e)
        feedback["result"] = False
        feedback["message"] = _(u"app maker创建失败,请联系平台开发者")
    return JsonResponse(feedback)


@csrf_exempt  # noqa
@login_exempt
@require_POST
@signature_required()
def edit_app(request):
    """
    @api {POST} /paas/api/app_maker/app/edit/ edit_app
    @apiName edit_app
    @apiGroup APP_MAKER
    @apiVersion 1.0.0
    @apiDescription 修改轻应用
    @apiParam (签名校验参数(GET参数)) {String} app_code 应用ID
    @apiParam (签名校验参数(GET参数)) {Number} Nonce 签名的随机数，{1-100000}
    @apiParam (签名校验参数(GET参数)) {Number} Timestamp 时间戳
    @apiParam (签名校验参数(GET参数)) {String} Signature 签名串，由app_code, Nonce, Timestamp, Data(Data值为request.body)的签名
    @apiParam (接口参数(POST参数)) {String} operator 操作者
    @apiParam (接口参数(POST参数)) {String} app_maker_code 轻应用的编码
    @apiParam (接口参数(POST参数)) {String} [app_name] 轻应用名称
    @apiParam (接口参数(POST参数)) {String} [app_url] 轻应用链接
    @apiParam (接口参数(POST参数)) {String} [developer] 轻应用开发者用户名，多个以分号';'分隔
    @apiParam (接口参数(POST参数)) {String} [app_tag] 轻应用分类
    @apiParam (接口参数(POST参数)) {String} [introduction] 轻应用的简介
    @apiParam (接口参数(POST参数)) {Number} [width] 轻应用在桌面打开窗口宽度
    @apiParam (接口参数(POST参数)) {Number} [height] 轻应用在桌面打开窗口高度
    @apiParamExample {json} 接口参数示例:
        {
            "operator": "admin",
            "app_maker_code": "gcloud_fdfh2kl0k",
            "app_name": "轻应用测试2",
            "app_url': "http://paas.bking.com/o/gcloud/xxx/",
            "developer': "test1;test2",
            "introduction": "introduction",
            "width": 1024,
            "height": 768
        }
    @apiSuccessExample {json} Success-Response
        HTTP/1.1 200 OK
        {
            "result": true,
            "code": '00',
            "message": "app maker 修改成功",
            "data": {}
        }
    """
    feedback = InnerFeedback()
    # 限制同域名下才能访问
    is_request_valid = check_request_valid(request)
    if not is_request_valid:
        feedback["result"] = True
        feedback["message"] = _(u"请在正式环境上操作该接口")
        return JsonResponse(feedback)

    # 获取参数
    request_data = request.POST
    app_maker_code = request_data.get("app_maker_code", "")
    try:
        app = App.objects.get(code=app_maker_code)
    except App.DoesNotExist:
        feedback["result"] = False
        feedback["message"] = _(u"应用[%s]不存在") % app_maker_code
        return JsonResponse(feedback)

    app_name = request_data.get("app_name", "")
    app_url = request_data.get("app_url", "")
    developers = request_data.get("developer", "")
    operator = request_data.get("operator")
    width = request_data.get("width")
    height = request_data.get("height")
    app_tag = request_data.get("app_tag")
    introduction = request_data.get("introduction")
    # try:
    #     user = user_model.objects.get(username=operator)
    # except user_model.DoesNotExist:
    #     feedback['result'] = False
    #     feedback['message'] = u"用户[username:%s]不存在" % operator
    #     return JsonResponse(feedback)
    # 判断用户权限
    app_count = App.objects.filter(
        Q(code=app_maker_code), Q(developer__username=operator) | Q(creater=operator)
    ).count()

    if not app_count:
        feedback["result"] = False
        feedback["message"] = _(u"您不是该maker app的开发者，没有操作该maker app的权限")
        return JsonResponse(feedback)
    # 保存应用基本信息
    try:
        with transaction.atomic():
            # 修改通用项
            if width:
                app.width = width
            if height:
                app.height = height
            if introduction:
                app.introduction = introduction
            # 修改分类
            app_tag = AppTags.objects.get_tag_by_code(app_tag, is_default=False)
            if app_tag:
                app.tags = app_tag
            # 修改名称
            if app_name:
                app_name_old = app.name
                is_name_valid, name_msg = validate_app_name(app_name, app_name_old)
                if not is_name_valid:
                    feedback["result"] = False
                    feedback["message"] = name_msg
                    return JsonResponse(feedback)
                app.name = app_name
            # 修改链接
            if app_url:
                is_app_url_valid, app_url_msg = validate_app_url(app_url)
                if not is_app_url_valid:
                    feedback["result"] = False
                    feedback["message"] = app_url_msg
                    return JsonResponse(feedback)
                app.external_url = app_url
            # 保存
            app.save()
            # 修改app开发者
            developer_list = developers.split(";") if developers else []
            # 不为空时才设置
            if len(developer_list) > 0:
                app.developer.clear()
            user_model = get_user_model()
            for dev in developer_list:
                try:
                    d_user, _c = user_model.objects.get_or_create(username=dev)
                    app.developer.add(d_user)
                except Exception as e:
                    # 获取用户[username:%s]异常:%s
                    logger.exception(u"get user [username:%s] fail:%s" % (dev, e))
        feedback["message"] = _(u"app maker 修改成功")
    except Exception as e:
        # 修改应用时，保存应用基本信息出错:%s
        logger.exception(u"save app base info fail: %s" % e)
        feedback["result"] = False
        feedback["message"] = _(u"app maker修改出错,请联系平台开发者")
    return JsonResponse(feedback)


@csrf_exempt
@developer_limit_exempt
@require_POST
def modify_app_logo(request):
    """
    @api {POST} /paas/api/app_maker/app_logo/modify/ modify_app_logo
    @apiName modify_app_logo
    @apiGroup APP_MAKER
    @apiVersion 1.0.0
    @apiDescription 修改轻应用LOGO，需带登录态，即前端上传
    @apiParam (接口参数(POST参数)) {String} app_maker_code 轻应用的编码
    @apiParam (接口参数(POST参数)) {File} logo 轻应用的LOGO文件
    @apiSuccessExample {json} Success-Response
        HTTP/1.1 200 OK
        {
            "result": true,
            "code": '00',
            "message": "app maker 删除成功",
            "data": {}
        }
    """
    feedback = InnerFeedback()
    # 限制同域名下才能访问
    is_request_valid = check_request_valid(request)
    if not is_request_valid:
        feedback["result"] = True
        feedback["message"] = _(u"请在正式环境上操作该接口")
        return JsonResponse(feedback)
    # 获取参数
    logo = request.FILES.get("logo", "")
    # 获取参数
    request_data = request.POST
    app_maker_code = request_data.get("app_maker_code", "")
    operator = request.user.username
    try:
        app = App.objects.get(code=app_maker_code)
    except App.DoesNotExist:
        feedback["result"] = False
        feedback["message"] = _(u"应用[%s]不存在") % app_maker_code
        return JsonResponse(feedback)
    # 判断用户权限
    app_count = App.objects.filter(
        Q(code=app_maker_code), Q(developer__username=operator) | Q(creater=operator)
    ).count()
    if not app_count:
        feedback["result"] = False
        feedback["message"] = _(u"您不是该maker app的开发者，没有操作该maker app的权限")
        return JsonResponse(feedback)
    if logo:
        app.logo = logo
        app.save()
    feedback["message"] = _(u"app maker logo修改成功")
    return JsonResponse(feedback)


@csrf_exempt
@login_exempt
@require_POST
@signature_required()
def del_app(request):
    """
    @api {POST} /paas/api/app_maker/app/del/ del_app
    @apiName del_app
    @apiGroup APP_MAKER
    @apiVersion 1.0.0
    @apiDescription 下架轻应用
    @apiParam (签名校验参数(GET参数)) {String} app_code 应用ID
    @apiParam (签名校验参数(GET参数)) {Number} Nonce 签名的随机数，{1-100000}
    @apiParam (签名校验参数(GET参数)) {Number} Timestamp 时间戳
    @apiParam (签名校验参数(GET参数)) {String} Signature 签名串，由app_code, Nonce, Timestamp, Data(Data值为request.body)的签名
    @apiParam (接口参数(POST参数)) {String} operator 操作者
    @apiParam (接口参数(POST参数)) {String} app_maker_code 轻应用的编码
    @apiParamExample {json} 接口参数示例:
        {
            "operator": "admin",
            "app_maker_code": "gcloud_fdfh2kl0k",
        }
    @apiSuccessExample {json} Success-Response
        HTTP/1.1 200 OK
        {
            "result": true,
            "code": '00',
            "message": "app maker 下架成功",
            "data": {}
        }
    """
    feedback = InnerFeedback()
    # 限制同域名下才能访问
    is_request_valid = check_request_valid(request)
    if not is_request_valid:
        feedback["result"] = True
        feedback["message"] = _(u"请在正式环境上操作该接口")
        return JsonResponse(feedback)
    # 获取参数
    request_data = request.POST
    app_maker_code = request_data.get("app_maker_code", "")
    operator = request_data.get("operator")
    try:
        app = App.objects.get(code=app_maker_code)
    except App.DoesNotExist:
        feedback["result"] = False
        feedback["message"] = _(u"应用[%s]s不存在") % app_maker_code
        return JsonResponse(feedback)
    # 判断用户权限
    app_count = App.objects.filter(
        Q(code=app_maker_code), Q(developer__username=operator) | Q(creater=operator)
    ).count()
    if not app_count:
        feedback["result"] = False
        feedback["message"] = _(u"您不是该maker app的开发者，没有操作该maker app的权限")
        return JsonResponse(feedback)
    # 将app状态标记为下架
    app.state = AppStateEnum.OUTLINE
    app.is_already_test = False
    app.is_already_online = False
    app.save()
    feedback["message"] = _(u"app maker 下架成功")
    return JsonResponse(feedback)
