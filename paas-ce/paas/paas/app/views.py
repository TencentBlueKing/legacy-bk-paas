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
from django.contrib.auth import get_user_model
from django.db import transaction
from django.http import HttpResponseRedirect, JsonResponse
from django.views.generic import View

from app.constants import (DB_TYPE_CHOICES, VCS_TYPE_CHOICES, AppOpenEnum,
                           AppStateEnum)
from app.forms import (AppCreateForm, AppQueryForm, BaseInfoForm,
                       CheckAppCodeForm, DBInfoForm, VCSInfoForm)
from app.models import App, AppTags, SecureInfo
from app.utils import validate_app_name
from common.exceptions import BadRequestException
from common.log import logger
from common.mixins.base import AppDeveloperRequiredMixin
from common.mymako import render_mako_tostring_context
from common.responses import FailJsonResponse, OKJsonResponse
from common.utils import first_error_message
from common.views.mako import JsonView, MakoTemplateView
from components.engine import register_app
from components.login import get_all_users
from release.utils import sync_app_state


class CheckAppCodeView(JsonView):
    """检查新的app_code是否已经存在
    """
    def get_context_data(self, **kwargs):
        context = super(CheckAppCodeView, self).get_context_data(**kwargs)
        request = self.request

        form = CheckAppCodeForm(request.GET)
        if not form.is_valid():
            message = first_error_message(form)
            context.update({'result': False, 'message': message})
            return context

        context.update({'result': True, 'message': "校验通过"})
        return context


class CheckAppNameView(JsonView):
    """检查app名称
    """
    def get_context_data(self, **kwargs):
        context = super(CheckAppNameView, self).get_context_data(**kwargs)
        request = self.request

        name = request.GET.get('name', '')
        old_name = request.GET.get('old_name', '')
        is_valid, message = validate_app_name(name, old_name)

        context.update({'result': is_valid, 'message': message})
        return context


class CreateAppView(MakoTemplateView):
    """创建应用.

    Get请求到创建页面，post页面则保存应用信息后到基本信息页面
    """
    template_name = 'app/create.html'

    def get_context_data(self, **kwargs):
        context = super(CreateAppView, self).get_context_data(**kwargs)
        request = self.request
        # app_code = self.kwargs["app_code"]

        user_model = get_user_model()
        # users = user_model.objects.all().values('username', 'chname')
        # 用户信息从统一登录接口获取
        bk_token = request.COOKIES.get(settings.BK_COOKIE_NAME, None)
        ok, users = get_all_users(bk_token)
        # 接口返回出错则直接从数据库获取
        if not ok:
            users = user_model.objects.all().values('username')

        error = request.GET.get('error', '')
        data = dict(
            error=error,
            db_type_choices=DB_TYPE_CHOICES,
            vcs_type_choices=VCS_TYPE_CHOICES,
            users=users,
        )
        context.update(data)
        return context

    def post(self, request):
        """新建应用
        """
        creater = request.user.username
        # validate
        error_url = "%sapp/error/?error={error}" % settings.SITE_URL
        form = AppCreateForm(request.POST)
        if not form.is_valid():
            message = first_error_message(form)
            return HttpResponseRedirect(error_url.format(error=message))

        # get params
        code = form.cleaned_data["code"]
        name = form.cleaned_data["name"]
        introduction = form.cleaned_data["introduction"]
        app_tags = form.cleaned_data["app_tags"]
        language = form.cleaned_data["language"]
        if not language:
            language = 'python'
        deploy_token = form.cleaned_data["deploy_token"]

        vcs_type = form.cleaned_data["vcs_type"]
        vcs_url = form.cleaned_data["vcs_url"]
        vcs_username = form.cleaned_data["vcs_username"]
        vcs_password = form.cleaned_data["vcs_password"]

        developer = form.cleaned_data["developer"]
        if not developer:
            developer = creater
        developer_list = developer.split(';') if developer else []

        # 注册应用信息
        ok, message, token = register_app(code, name, language)
        if not ok:
            return HttpResponseRedirect(error_url.format(error=message))

        # 保存应用信息到数据库
        try:
            with transaction.atomic():
                app = App.objects.create(
                    name=name,
                    code=code,
                    introduction=introduction,
                    creater=creater,
                    language=language,
                    auth_token=token,
                    deploy_token=deploy_token,
                    tags=app_tags,
                )
                # 保存开发负责人信息
                if developer_list:
                    user_model = get_user_model()
                    for dev in developer_list:
                        try:
                            d_user = user_model.objects.get(username=dev)
                            app.developer.add(d_user)
                        except Exception as e:
                            logger.exception("获取用户[username:%s]异常:%s", dev, e)
                # 保存源码等需要跟App Engine交互的信息
                SecureInfo.objects.create(
                    app_code=code,
                    vcs_type=vcs_type,
                    vcs_url=vcs_url,
                    vcs_username=vcs_username,
                    vcs_password=vcs_password,
                )
        except Exception as e:
            logger.exception("创建应用时，保存应用基本信息出错:%s", e)
            return HttpResponseRedirect(error_url.format(error="保存应用基本信息出错"))
        url = '{}app/{}/info/'.format(settings.SITE_URL, code)
        return HttpResponseRedirect(url)


class ModifyAppView(AppDeveloperRequiredMixin, View):
    """编辑应用基本信息
    """
    def post(self, request, *args, **kwargs):
        app_code = self.kwargs["app_code"]

        operate = request.POST.get('operate', '')
        if not operate:
            raise BadRequestException("参数异常")

        # 保存基本信息
        try:
            if operate == 'base':
                self._update_base_info(request, app_code)
            elif operate == 'introduction':
                self._update_introduction(request, app_code)
            elif operate == 'vcs':
                self._update_vsc_info(request, app_code)
            elif operate == 'db':
                self._update_db_info(request, app_code)
        except BadRequestException as e:
            raise e
        except Exception as e:
            logger.exception("保存用户基本信息异常:%s", e)
            return FailJsonResponse("编辑失败")

        return OKJsonResponse("编辑成功")

    def _update_db_info(self, request, app_code):
        form = DBInfoForm(request.POST)
        if not form.is_valid():
            message = first_error_message(form)
            raise BadRequestException(message)

        db_host = form.cleaned_data["db_host"]
        db_port = form.cleaned_data["db_port"]
        db_username = form.cleaned_data["db_username"]
        db_password = form.cleaned_data["db_password"]

        SecureInfo.objects.filter(app_code=app_code).update(
            db_host=db_host,
            db_port=db_port,
            db_username=db_username,
            db_password=db_password,
            )

    def _update_vsc_info(self, request, app_code):
        vcs_info_form = VCSInfoForm(request.POST)
        if not vcs_info_form.is_valid():
            message = first_error_message(vcs_info_form)
            raise BadRequestException(message)

        vcs_url = vcs_info_form.cleaned_data["vcs_url"]
        vcs_username = vcs_info_form.cleaned_data["vcs_username"]
        vcs_password = vcs_info_form.cleaned_data["vcs_password"]

        SecureInfo.objects.filter(app_code=app_code).update(
            vcs_url=vcs_url,
            vcs_username=vcs_username,
            vcs_password=vcs_password
        )

    def _update_base_info(self, request, app_code):
        app = App.objects.get(code=app_code)

        form = BaseInfoForm(request.POST)
        if not form.is_valid():
            message = first_error_message(form)
            raise BadRequestException(message)

        name = form.cleaned_data["name"]
        developer = form.cleaned_data["developer"]
        app_tags = form.cleaned_data["app_tags"]

        old_name = app.name
        is_valid, message = validate_app_name(name, old_name)
        if not is_valid:
            raise BadRequestException(message)
        developer_list = developer.split(';') if developer else []
        # 保存用户基本信息
        with transaction.atomic():
            app.name = name
            app.tags = app_tags
            app.save()

            # 保存开发负责人信息
            if developer_list:
                app.developer.clear()
                user_model = get_user_model()
                for dev in developer_list:
                    d_user = user_model.objects.get(username=dev)
                    app.developer.add(d_user)

    def _update_introduction(self, request, app_code):
        app = App.objects.get(code=app_code)
        introduction = request.POST.get('introduction', '').replace('&nbsp;', ' ').strip()
        if not introduction:
            raise BadRequestException("应用简介不能为空")

        app.introduction = introduction
        app.save()


class AppListPageView(MakoTemplateView):
    """应用列表页
    """
    template_name = 'app/list.html'


class AppListView(View):
    """查询获得app列表
    """
    def get(self, request):
        username = request.user.username

        form = AppQueryForm(request.GET)
        if not form.is_valid():
            message = first_error_message(form)
            logger.exception("应用列表页面参数异常:%s", message)
            return JsonResponse({
                'data': "请求参数异常",
                'total_num': 0,
                'extend_fun': ''
            })

        keyword = form.cleaned_data["keyword"]
        hide_offline = form.cleaned_data["hide_offline"]
        page = form.cleaned_data["page"]
        page_size = form.cleaned_data["page_size"]

        start = (page - 1) * page_size
        end = page * page_size

        # 超级管理员可以查看所有的应用
        is_superuser = request.user.is_superuser
        has_app, total, app_list = App.objects.query_app_list(is_superuser, username, keyword, hide_offline, start, end)

        # 判断应用状态是否需要刷新
        refresh_app_list = []
        app_refresh_states = [AppStateEnum.IN_TEST.value, AppStateEnum.IN_ONLINE.value, AppStateEnum.IN_OFFLINE.value]
        for _app in app_list:
            if _app.state in app_refresh_states:
                _app_code = _app.code
                try:
                    sync_app_state(_app_code)
                    # 获取更新后的应用信息
                    _app = App.objects.get(code=_app_code)
                except Exception:
                    logger.exception("更新应用[%s]状态失败", _app_code)

            refresh_app_list.append(_app)

        result = {
            'total': total,
            'app_list': refresh_app_list,
            'has_app': has_app,
        }
        template_name = 'app/list_table.part' if has_app else 'app/list_tip.part'
        html_data = render_mako_tostring_context(request, template_name, result)
        return JsonResponse({
            'data': html_data,
            'total_num': total,
            'extend_fun': ''
        })


class AppInfoView(AppDeveloperRequiredMixin, MakoTemplateView):
    """应用基本信息
    """
    template_name = 'app/info.html'

    def get_context_data(self, **kwargs):
        context = super(AppInfoView, self).get_context_data(**kwargs)
        request = self.request
        app_code = self.kwargs["app_code"]

        try:
            app_secure_info = SecureInfo.objects.get(app_code=app_code)
        except Exception:
            logger.info("应用[ID:%s]的源码信息不存在", app_code)
            app_secure_info = None

        # 获取所有的用户信息
        user_model = get_user_model()
        # 用户信息从统一登录接口获取
        bk_token = request.COOKIES.get(settings.BK_COOKIE_NAME, None)
        # FIXME: do not get all user now, get from frontend
        ok, users = get_all_users(bk_token)
        # 接口返回出错则直接从数据库获取
        if not ok:
            users = user_model.objects.all().values('username')

        # 获取应用分类列表
        tags = AppTags.objects.all()
        tags = [[t.code, t.name] for t in tags if t]

        # 获取开发者信息
        app = App.objects.get(code=app_code)

        developers_value_name_list = app.developer.all().values_list('username', flat=True)
        developers_value_name = ';'.join(developers_value_name_list)
        # 解析APP信息
        vcs_type = app_secure_info.vcs_type if app_secure_info else ''
        app_info = {
            'code': app.code,
            'auth_token': app.auth_token,
            'creater': app.creater or '',
            'name': app.name or '',
            'state': app.state,
            'tags': app.tags.name if app.tags else '',
            'tags_code': app.tags.code if app.tags else '',
            'app_test_url': app.app_test_url,
            'app_prod_url': app.app_prod_url,
            'first_test_time': app.first_test_time_display or '',
            'first_online_time': app.first_online_time_display or '',
            'introduction': app.introduction_display or '',
            'deploy_token': app.deploy_token or '',
            'vcs_type': vcs_type,
            'vcs_type_name': dict(VCS_TYPE_CHOICES).get(vcs_type, ''),
            'vcs_url': app_secure_info.vcs_url if app_secure_info else '',
            'vcs_username': app_secure_info.vcs_username if app_secure_info else '',
            'vcs_password': app_secure_info.vcs_password if app_secure_info else '',
            'developers_value_name': developers_value_name,
            'developers_value_name_list': developers_value_name_list or [],
            'users': users,
        }

        context.update({
            'app_info': app_info,
            'app_code': app_code,
            'tags': tags,
        })
        return context


class AppStatusView(JsonView):
    """应用状态

    res值:
    1    正式环境，测试环境都打开
    2    只有测试环境
    3    只有正式环境
    4    正式环境，测试环境都关闭
    """
    def get_context_data(self, **kwargs):
        context = super(AppStatusView, self).get_context_data(**kwargs)
        app_code = self.kwargs["app_code"]

        try:
            app = App.objects.get(code=app_code)
        except Exception:
            message = "app status 应用[id:{}]不存在".format(app_code)
            logger.exception(message)
            context.update({
                "result": False,
                "message": message,
                "data": {
                    "status": 0,
                    "app_test_url": "###",
                    "app_prod_url": "###",
                    "app_name": ""
                }
            })
            return context

        # 判断应用在那些环境下可以打开
        is_test = (app.state not in [AppStateEnum.DEVELOPMENT.value] and app.is_already_test)
        is_prod = (app.state not in [AppStateEnum.OFFLINE.value, AppStateEnum.DEVELOPMENT.value]
                   and app.is_already_online)

        if is_prod and is_test:
            status = AppOpenEnum.OPEN_IN_ALL.value
        elif is_prod:
            status = AppOpenEnum.OPEN_IN_PROD.value
        elif is_test:
            status = AppOpenEnum.OPEN_IN_TEST.value
        else:
            status = AppOpenEnum.OPEN_NONE.value

        context.update({
            "result": True,
            "message": "success",
            "data": {
                "status": status,
                "app_test_url": app.app_test_url,
                "app_prod_url": app.app_prod_url,
                "app_name": app.name,
                "app_logo_url": app.logo_url,
            }
        })
        return context


class VCSPasswordView(AppDeveloperRequiredMixin, JsonView):
    """
    获取代码仓库密码
    """
    def get_context_data(self, **kwargs):
        context = super(VCSPasswordView, self).get_context_data(**kwargs)
        app_code = self.kwargs["app_code"]

        try:
            app_secure_info = SecureInfo.objects.get(app_code=app_code)
        except Exception:
            context.update({
                "result": False,
                "message": "应用[ID:{}]的源码信息不存在".format(app_code),
                "data": {}
            })
            return context

        context.update({
            "result": True,
            "message": "success",
            "data": {
                "password": app_secure_info.vcs_password
            }
        })
        return context


class ModifyAppLogoView(AppDeveloperRequiredMixin, View):
    """修改应用图标
    """
    def post(self, request, *args, **kwargs):
        app_code = self.kwargs["app_code"]

        app = App.objects.get(code=app_code)
        logo = request.FILES.get('logo_m', '')
        if not (logo and logo.content_type and logo.content_type.lower() == 'image/png'):
            error = "更换logo失败, logo必须为png格式"
            url = '{}app/list/?error={}'.format(settings.SITE_URL, error)
            return HttpResponseRedirect(url)

        try:
            app.logo = logo
            app.save()
        except Exception as e:
            logger.exception("应用logo[%s]更换失败, %s", app_code, e)

        url = '{}app/list/'.format(settings.SITE_URL)
        return HttpResponseRedirect(url)


class ErrorView(MakoTemplateView):
    """错误提示信息
    """
    def get_template_names(self):
        error_id = self.kwargs["error_id"]
        template_name = 'error/app_error_dialog{}.html'.format(error_id)

        return [template_name]

    def get_context_data(self, **kwargs):
        context = super(ErrorView, self).get_context_data(**kwargs)

        app_code = self.kwargs["app_code"]
        context.update({
            "app_code": app_code
        })

        return context
