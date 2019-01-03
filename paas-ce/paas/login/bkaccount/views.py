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
from django.db import transaction
from django.http import HttpResponseForbidden, HttpResponseRedirect, HttpResponse, QueryDict
from django.shortcuts import render
from django.utils.module_loading import import_string
from django.utils.translation import ugettext as _
from django.views.generic import View, TemplateView

from common.log import logger
from common.mixins.base import SuperuserRequiredMixin, SuperuserOrPutOwnerRequiredMixin
from common.mixins.exempt import LoginExemptMixin
from common.responses import FailJsonResponse, OKJsonResponse
from common.utils.basic import first_error_message
from bkaccount.accounts import Account
from bkaccount.forms import UserInfoForm, SetPasswordForm, UserQueryForm, ImportUserForm
from bkaccount.models import BkUser
from bkaccount.utils import (read_user_import_xls, write_excel, get_page_info, get_role_name_by_role_code)


class LoginView(LoginExemptMixin, View):
    """
    登录
    """
    def _login(self, request):
        account = Account()
        # 判断调用方式
        if settings.LOGIN_TYPE != 'custom_login':
            return account.login(request)
        # 调用自定义login view
        custom_login_view = import_string(settings.CUSTOM_LOGIN_VIEW)
        return custom_login_view(request)

    def get(self, request):
        return self._login(request)

    def post(self, request):
        return self._login(request)


class LogoutView(LoginExemptMixin, View):
    """
    登出
    """
    def get(self, request):
        account = Account()
        return account.logout(request)


class UserPageView(TemplateView):
    """
    用户管理页面
    """
    template_name = "bkaccount/users.html"

    def get_context_data(self, **kwargs):
        context = super(UserPageView, self).get_context_data(**kwargs)
        request = self.request

        context.update({
            'default_paasword': settings.PASSWORD,
            'error_msg': request.GET.get('error_msg') or '',
            'success_msg': request.GET.get('success_msg') or ''
        })
        return context


class UserListPage(TemplateView):
    """
    用户信息列表页面
    """
    template_name = "bkaccount/user_table.part"

    def get_context_data(self, **kwargs):
        context = super(UserListPage, self).get_context_data(**kwargs)
        request = self.request

        form = UserQueryForm(request.GET)
        form.is_valid()

        page = form.cleaned_data["page"]
        page_size = form.cleaned_data["page_size"]
        page, page_size = get_page_info(page, page_size)

        # 管理员查看所有用户，无需过滤
        search_username = '' if request.user.is_superuser else request.user.username
        # 根据查询条件过滤
        search_data = form.cleaned_data["search_data"]
        search_role = form.cleaned_data["search_role"]

        # 获取分页数据
        records = BkUser.objects.get_batch_user_with_paginator(page, page_size, search_username,
                                                               search_data, search_role)

        # 前端分页临近页数，默认设置为 3
        adjacent_pages = 3
        start_page = max(records.number - adjacent_pages, 1)
        start_page = 1 if start_page < adjacent_pages else start_page
        end_page = records.number + adjacent_pages + 1
        if end_page > records.paginator.num_pages - adjacent_pages + 2:
            end_page = records.paginator.num_pages + 1
        page_numbers = [n for n in range(start_page, end_page)]
        show_first = 1 not in page_numbers
        show_last = records.paginator.num_pages not in page_numbers
        context.update({
            'records': records,
            'page_numbers': page_numbers,
            'show_first': show_first,
            'show_last': show_last,
        })
        return context


class UserView(SuperuserOrPutOwnerRequiredMixin, View):
    """
    CUD User
    """
    def _add_or_update(self, request, user_id=None):
        request_param = request.POST if user_id is None else QueryDict(request.body)
        form = UserInfoForm(request_param)

        if not form.is_valid():
            message = first_error_message(form)
            return FailJsonResponse(message)

        # 创建用户
        result, user_id, message = BkUser.objects.modify_or_create_user_by_userid(
            user_id,
            form.cleaned_data["username"],
            form.cleaned_data["chname"],
            form.cleaned_data["phone"],
            form.cleaned_data["email"],
            form.cleaned_data["role"]
        )

        if not result:
            return FailJsonResponse(message)
        return OKJsonResponse(_("保存用户信息成功"), data={"user_id": user_id})

    def post(self, request):
        return self._add_or_update(request, None)

    def put(self, request, user_id):
        return self._add_or_update(request, user_id)

    def delete(self, request, user_id):
        result, message = BkUser.objects.delete_user(user_id)
        if not result:
            return FailJsonResponse(message)
        return OKJsonResponse(_("用户删除成功"))


class UserPasswordView(SuperuserOrPutOwnerRequiredMixin, View):
    def put(self, request, user_id):
        request_param = QueryDict(request.body)
        form = SetPasswordForm(request_param)

        if not form.is_valid():
            message = first_error_message(form)
            return FailJsonResponse(message)

        # 修改密码
        result, message = BkUser.objects.modify_password_by_userid(user_id, form.cleaned_data['new_password1'])
        if not result:
            return FailJsonResponse(message)
        return OKJsonResponse(_("修改密码成功"))


class UserImportView(SuperuserRequiredMixin, View):
    def post(self, request):
        # 鉴权
        error_url_format = "{}accounts/user/list/?error_msg={}".format(settings.SITE_URL, {})
        if not request.user.is_superuser:
            return HttpResponseRedirect(error_url_format.format(_("非管理员, 没有权限进行操作, 请找管理员申请权限!")))
        # 校验文件格式
        xls_file = request.FILES['data_files']
        form = ImportUserForm({"file_name": xls_file.name})
        if not form.is_valid():
            message = first_error_message(form)
            return HttpResponseRedirect(error_url_format.format(message))

        # 读取excel数据
        try:
            user_list = read_user_import_xls(xls_file)
        except Exception as error:
            logger.exception("Error parsing user import data, error: {}".format(error))
            return HttpResponseRedirect(error_url_format.format(_("文件解析出错，请下载 EXCEL模板文件 填写用户数据")))

        if not user_list:
            return HttpResponseRedirect(error_url_format.format(_("导入数据不能为空")))

        error_message = ""
        try:
            with transaction.atomic():
                for _u in user_list:
                    form = UserInfoForm(_u)
                    if not form.is_valid():
                        error_message = first_error_message(form)
                        raise ValueError(error_message)
                    # 创建或者保存用户
                    BkUser.objects.modify_or_create_user_by_username(
                        form.cleaned_data["username"],
                        form.cleaned_data["chname"],
                        form.cleaned_data["phone"],
                        form.cleaned_data["email"],
                        form.cleaned_data["role"]
                    )
        except Exception as error:
            logger.error(error)
            error_message = _("用户导入出现异常 {}").format(error if not error_message else error_message)
        return HttpResponseRedirect(error_url_format.format(error_message))


class UserExportView(SuperuserRequiredMixin, View):
    def get(self, request):
        response = HttpResponse()
        # 文件名，gbk编码，防止中文名出现乱码
        response['Content-Disposition'] = 'attachment; filename="bk_user_export.xls'

        # 设置 excel 文件头
        head_list = [_("用户名"), _("中文名"), _("联系电话"), _("常用邮箱"), _("角色")]

        users = BkUser.objects.all().order_by('-id').order_by('-is_superuser')
        records = [(
            u.username,
            u.chname,
            u.phone,
            u.email,
            get_role_name_by_role_code(u.role_code)
        ) for u in users]

        is_success, message, wbk = write_excel(head_list, records)
        if not is_success:
            return FailJsonResponse(message)
        wbk.save(response)
        return response


# TODO: move to some where
def csrf_failure(request, reason=""):
    return HttpResponseForbidden(render(request, 'csrf_failure.html'), content_type='text/html')
