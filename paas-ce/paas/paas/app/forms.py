# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

from __future__ import unicode_literals

from django import forms

from app.models import App, AppTags
from app.utils import validate_app_name
from common.constants import (APP_CODE_CHECK_MSG, APP_CODE_CHECK_PATTERN,
                              GIT_URL_CHECK_PATTERN, SVN_URL_CHENK_PATTREN)
from app.constants import VCS_TYPE_CHOICES, VCSTypeEnum


class CheckAppCodeForm(forms.Form):
    app_code = forms.CharField(max_length=16, min_length=3, error_messages={"required": '应用ID不能为空',
                                                                            "max_length": "应用ID长度不能超过16个字符",
                                                                            'min_length': "应用ID长度不能少于3个字符",
                                                                            }
                               )

    def clean_app_code(self):
        app_code = self.cleaned_data["app_code"]

        if not APP_CODE_CHECK_PATTERN.match(app_code):
            self.add_error('app_code', APP_CODE_CHECK_MSG)

        is_exists = App.objects.filter(code=app_code).exists()
        if is_exists:
            self.add_error('app_code', "应用 ID[{}]已存在".format(app_code))

        return app_code


class BaseInfoForm(forms.Form):
    name = forms.CharField(max_length=20)
    app_tags = forms.CharField(required=False)
    developer = forms.CharField(required=False)

    def clean_name(self):
        name = self.cleaned_data["name"]
        return name.replace('&nbsp;', ' ').strip()

    def clean_developer(self):
        developer = self.cleaned_data["developer"]
        if not developer:
            self.add_error('developer', "负责人不能为空")
        return developer

    def clean_app_tags(self):
        app_tags = self.cleaned_data["app_tags"]
        if app_tags:
            tag = AppTags.objects.filter(code=app_tags)
            if not tag:
                self.add_error('app_tags', "标签不存在")
            return tag[0]
        return None


class DBInfoForm(forms.Form):
    db_host = forms.CharField(error_messages={"required": "数据库信息不能为空"})
    db_username = forms.CharField(error_messages={"required": "数据库信息不能为空"})
    db_port = forms.IntegerField(error_messages={"required": "数据库信息不能为空", "invalid": "数据库端口必须为整数"})
    db_password = forms.CharField()


class VCSInfoForm(forms.Form):
    vcs_type = forms.ChoiceField(choices=VCS_TYPE_CHOICES,
                                 error_messages={"required": "代码仓库类型不能为空",
                                                 "invalid_choice": "代码仓库类型不合法, 目前只支持svn 或 git"})
    vcs_url = forms.CharField(error_messages={"required": "代码仓库地址不能为空"})
    vcs_username = forms.CharField(error_messages={"required": "用户名不能为空"})
    vcs_password = forms.CharField(error_messages={"required": "密码不能为空"})

    def clean_vcs_url(self):
        vcs_url = self.cleaned_data["vcs_url"]

        vcs_url = vcs_url.replace('&nbsp;', ' ').strip()

        vcs_type = self.cleaned_data["vcs_type"]
        pattern = GIT_URL_CHECK_PATTERN if vcs_type == str(VCSTypeEnum.GIT.value) else SVN_URL_CHENK_PATTREN

        if not pattern.match(vcs_url):
            self.add_error("vcs_url", "请填写正确的仓库地址")

        return vcs_url

    def clean_vcs_username(self):
        vcs_username = self.cleaned_data["vcs_username"]
        return vcs_username.replace('&nbsp;', ' ').strip()

    def clean_vcs_password(self):
        vcs_password = self.cleaned_data["vcs_password"]
        return vcs_password.replace('&nbsp;', ' ').strip()


class AppQueryForm(forms.Form):
    keyword = forms.CharField(required=False)
    hide_offline = forms.IntegerField(initial=0)
    page = forms.IntegerField(required=False, initial=1)
    page_size = forms.IntegerField(required=False)

    def clean_keyword(self):
        keyword = self.cleaned_data["keyword"]
        return keyword.replace('&nbsp;', ' ').strip()

    def clean_page_size(self):
        page_size = self.cleaned_data["page_size"]
        if not page_size:
            return 8
        return page_size


class AppCreateForm(VCSInfoForm):
    code = forms.CharField(max_length=16, min_length=3, error_messages={"required": '应用ID不能为空',
                                                                        "max_length": "应用ID长度不能超过16个字符",
                                                                        'min_length': "应用ID长度不能少于3个字符",
                                                                        }
                           )
    name = forms.CharField(max_length=20)
    introduction = forms.CharField()
    app_tags = forms.CharField(required=False)
    language = forms.CharField(required=False)
    deploy_token = forms.CharField(required=False)
    developer = forms.CharField(required=False)

    def clean_code(self):
        code = self.cleaned_data["code"]
        code = code.replace('&nbsp;', ' ').strip()

        if not APP_CODE_CHECK_PATTERN.match(code):
            self.add_error('code', APP_CODE_CHECK_MSG)

        is_exists = App.objects.filter(code=code).exists()
        if is_exists:
            self.add_error('code', "应用 ID[{}]已存在".format(code))

        return code

    def clean_name(self):
        name = self.cleaned_data["name"]
        name = name.replace('&nbsp;', ' ').strip()
        # for create, the old_name is ''
        valid, message = validate_app_name(name, '')
        if not valid:
            self.add_error('name', message)

        return name

    def clean_introduction(self):
        introduction = self.cleaned_data["introduction"]
        return introduction.replace('&nbsp;', ' ').strip()

    def clean_app_tags(self):
        app_tags = self.cleaned_data["app_tags"]
        if app_tags:
            tag = AppTags.objects.filter(code=app_tags)
            if not tag:
                self.add_error('app_tags', "标签不存在")
            return tag[0]
        return None

    def clean_deploy_token(self):
        deploy_token = self.cleaned_data["deploy_token"]
        return deploy_token.replace('&nbsp;', ' ').strip()

    def clean_vcs_username(self):
        vcs_username = self.cleaned_data["vcs_username"]
        return vcs_username.replace('&nbsp;', ' ').strip()

    def clean_vcs_password(self):
        vcs_password = self.cleaned_data["vcs_password"]
        return vcs_password.replace('&nbsp;', ' ').strip()
