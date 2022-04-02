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

import datetime
import json
import re
import warnings

from django.db import models
from django.utils import timezone
from django.utils.deprecation import RemovedInDjango19Warning

from components.constants import BK_SYSTEMS
from esb.bkcore import managers

warnings.simplefilter("ignore", RemovedInDjango19Warning)


class ComponentSystem(models.Model):
    """组件系统"""

    name = models.CharField(u"系统名称", max_length=64)
    label = models.CharField(u"系统标签", max_length=128, help_text=u"系统简要说明")
    component_admin = models.CharField(u"组件开发负责人", max_length=128, default="", blank=True)
    interface_admin = models.CharField(
        u"系统接口负责人", max_length=128, default="", blank=True, help_text=u"记录系统接口负责人，以便进行消息通知或直接联系，长度为128字符以内"
    )
    system_link = models.CharField(u"系统链接", max_length=1024, default="", blank=True, help_text=u"标准的HTTP链接，多个以分号分隔")
    belong_to = models.CharField(u"系统所属组织", max_length=128, default="", blank=True)
    remark = models.TextField(u"备注", default="", blank=True)
    execute_timeout = models.IntegerField(u"执行类超时时长", null=True, blank=True, help_text=u"单位秒，未设置时超时时长为30秒")
    query_timeout = models.IntegerField(u"查询类超时时长", null=True, blank=True, help_text=u"单位秒，未设置时超时时长为30秒")
    doc_category_id = models.IntegerField(u"文档分类ID", null=True, blank=True)

    objects = managers.ComponentSystemManager()

    class Meta:
        ordering = ["name"]
        db_table = "esb_component_system"

    def __unicode__(self):
        return self.name

    @property
    def is_official(self):
        return self.name in BK_SYSTEMS


class ESBChannel(models.Model):
    """Channel for ESB

    One channel links a path to a component
    """

    TYPE_CHOICE = (
        (1, u"执行API"),
        (2, u"查询API"),
    )
    PERM_LEVEL_CHOICE = (
        (0, u"无限制"),
        (1, u"普通权限"),
        (2, u"敏感权限"),
        (3, u"特殊权限"),
    )

    name = models.CharField(u"通道名称", max_length=64, help_text=u'通道名称，长度限制为64字符，例如"查询服务器列表"')
    path = models.CharField(u"通道路径", max_length=255, help_text=u'通道请求路径，例如"/host/get_host_list/"')
    method = models.CharField(u"请求类型", max_length=32, null=True, default="", blank=True)
    component_system = models.ForeignKey(ComponentSystem, verbose_name=u"所属组件系统", null=True)
    component_codename = models.CharField(
        u"对应组件代号", max_length=255, help_text=u'对应的组件代号，该组件必须注册到ESB平台中，例如 "generic.host.get_host_list"'
    )
    component_name = models.CharField(u"组件英文名", max_length=64, default="", blank=True, null=True)
    is_active = models.BooleanField(u"是否开启", default=True)
    last_modified_time = models.DateTimeField(u"最后更新", auto_now=True)
    created_time = models.DateTimeField(u"创建时间", auto_now_add=True)
    timeout_time = models.IntegerField(u"超时时长", blank=True, null=True, help_text=u"单位秒，未设置时以所属组件系统超时时长为准")
    type = models.IntegerField(u"组件类型", choices=TYPE_CHOICE, default=2)
    comp_conf = models.TextField(u"组件配置", default="", null=True, blank=True)
    perm_level = models.IntegerField(u"权限级别", choices=PERM_LEVEL_CHOICE, default=0)
    is_hidden = models.BooleanField(u"组件是否隐藏", default=False, help_text=u"是否显示文档，及是否在权限申请中展示")
    rate_limit_required = models.BooleanField(u"是否校验访问频率", default=False)
    rate_limit_conf = models.TextField(
        u"请求频率配置",
        null=True,
        blank=True,
        help_text=(
            u"限制访问频率，允许多种规则，例如"
            u'{"app_ratelimit": {"__default": {"token":1000, "minute": 1}, "gcloud": {"token":1000, "minute": 1}}}'
        ),
    )  # noqa
    extra_info = models.TextField(u"额外信息", default="", blank=True, help_text=u"存储组件额外信息，用于文档展示等")

    objects = managers.ESBChannelManager()

    class Meta:
        db_table = "esb_channel"
        unique_together = ("path", "method")

    def __unicode__(self):
        return self.name

    @property
    def api_path(self):
        return "/api/c/compapi/%s/" % self.path.strip("/")

    @property
    def api_version(self):
        if self.component_codename.startswith("generic.v2."):
            return "v2"
        return ""

    @property
    def channel_conf(self):
        return {
            "id": self.id,
            "perm_level": self.perm_level,
            "rate_limit_required": self.rate_limit_required,
            "rate_limit_conf": json.loads(self.rate_limit_conf or "{}"),
        }

    @property
    def is_confapi(self):
        extra_info = self.extra_info_json()
        return extra_info.get("is_confapi", False)

    def extra_info_json(self):
        try:
            return json.loads(self.extra_info)
        except Exception:
            return {}

    @property
    def comp_conf_dict(self):
        try:
            return dict(json.loads(self.comp_conf))
        except Exception:
            return {}


class FunctionController(models.Model):
    """功能开关控制器"""

    func_code = models.CharField(u"功能code", max_length=64, unique=True)
    func_name = models.CharField(u"功能名称", max_length=64)
    switch_status = models.BooleanField(u"是否开启该功能", default=True, help_text=u"控制功能是否对外开放，若选择，则该功能将对外开放")
    wlist = models.TextField(
        u"功能测试白名单", null=True, default="", blank=True, help_text=u"支持两种格式数据，以逗号、分号分隔的字符串，及JSON格式字符串"
    )
    func_desc = models.TextField(u"功能描述", null=True, default="", blank=True)
    created_time = models.DateTimeField(u"创建时间", auto_now_add=True)

    class Meta:
        db_table = "esb_function_controller"

    def __unicode__(self):
        return self.func_code


class UserAuthToken(models.Model):
    """AuthToken"""

    app_code = models.CharField(u"蓝鲸智云应用编码", max_length=128)
    username = models.CharField(u"用户名", max_length=64)
    auth_token = models.CharField(u"token内容", max_length=255)
    expires = models.DateTimeField(u"token过期时间")
    last_accessed_time = models.DateTimeField(u"最后访问时间", auto_now_add=True)
    created_time = models.DateTimeField(u"创建时间", auto_now_add=True)

    def __unicode__(self):
        return self.auth_token

    class Meta:
        db_table = "esb_user_auth_token"

    def touch(self):
        self.last_accessed = timezone.now()

    def has_expired(self):
        return self.expires_in() < 300

    def expires_in(self):
        """返回该token还有多少秒过期"""
        return int((self.expires - timezone.now()).total_seconds())

    def get_info(self):
        return {
            "expires_in": self.expires_in(),
            "auth_token": self.auth_token,
            "username": self.username,
        }


######################################################################
# Models for ESB Buffet
######################################################################


class ESBBuffetComponent(models.Model):
    """ESB 组件自助接入"""

    HTTP_METHOD_CHOICES = [
        ("GET", "GET"),
        ("POST", "POST"),
        ("_ORIG", u"[所有] 透传原始请求类型(不建议使用)"),
    ]
    FAVOR_CTYPE_CHOICES = [
        ("json", "json"),
        ("form", "form"),
    ]
    TYPE_CHOICE = (
        (1, u"执行API"),
        (2, u"查询API"),
    )

    name = models.CharField(u"名称", max_length=256)
    system = models.ForeignKey(ComponentSystem, verbose_name=u"所属系统", null=True, blank=True)

    dest_url = models.CharField(u"目标接口地址", max_length=2048)
    dest_http_method = models.CharField(u"HTTP请求类型", max_length=8, choices=HTTP_METHOD_CHOICES)
    favor_post_ctype = models.CharField(u"编码POST参数方式", max_length=64, default="json", choices=FAVOR_CTYPE_CHOICES)
    extra_headers = models.CharField(u"额外请求头信息", max_length=2048, default="", blank=True)
    extra_params = models.CharField(u"额外请求参数", max_length=2048, default="", blank=True)

    registed_path = models.CharField(u"注册到的组件路径", max_length=255)
    registed_http_method = models.CharField(u"注册到的请求类型", max_length=8, choices=HTTP_METHOD_CHOICES)

    submitter = models.CharField(max_length=256, null=True, default="", blank=True)
    approver = models.CharField(max_length=256, null=True, default="", blank=True)
    approver_message = models.CharField(max_length=1024, null=True, default="", blank=True)
    status = models.IntegerField(u"状态", default=0)

    mappings_input = models.CharField(
        u"输入Mappings", null=True, default="", blank=True, max_length=1024, help_text=u"JSON格式数据"
    )
    mappings_output = models.CharField(
        u"输出Mappings", null=True, default="", blank=True, max_length=1024, help_text=u"JSON格式数据"
    )
    last_modified_time = models.DateTimeField(auto_now=True)
    created_time = models.DateTimeField(auto_now_add=True)
    timeout_time = models.IntegerField(u"超时时长", blank=True, null=True, help_text=u"单位秒，未设置时以所属组件系统超时时长为准")
    type = models.IntegerField(u"组件类型", choices=TYPE_CHOICE, default=2)

    def __unicode__(self):
        return self.name

    class Meta:
        db_table = "esb_buffet_component"

    def get_extra_headers(self):
        return json.loads(self.extra_headers or "{}")

    def get_extra_params(self):
        return json.loads(self.extra_params or "{}")

    @property
    def api_path(self):
        return "/api/c/self-service-api/%s/" % self.registed_path.strip("/")

    @property
    def api_name(self):
        path_2_name = re.findall(r"[a-zA-Z0-9]+", self.registed_path.lower())
        path_2_name.insert(0, self.registed_http_method.lower())
        return "_".join(path_2_name)


class ESBBuffetMapping(models.Model):
    """ESB 组件自助接入，参数mapping"""

    name = models.CharField(u"名称", max_length=40, unique=True)
    type = models.IntegerField(u"类型", null=True, blank=True)
    source_type = models.IntegerField(u"源码类型")
    source = models.TextField(u"源码", null=True, default="", blank=True)
    owner = models.CharField(max_length=256, null=True, default="", blank=True)
    is_active = models.BooleanField(default=True)
    last_modified_time = models.DateTimeField(auto_now=True)
    created_time = models.DateTimeField(auto_now_add=True)

    def __unicode__(self):
        return self.name

    class Meta:
        db_table = "esb_buffet_component_mapping"

    def get_info(self):
        return {"id": self.pk, "name": self.name, "source_type": self.source_type, "source": self.source}


class AppAccount(models.Model):
    """应用帐号"""

    app_code = models.CharField(u"应用编码", max_length=30, unique=True, help_text=u"此处请用英文字母")
    app_token = models.CharField(u"应用Token", max_length=128)
    introduction = models.TextField(u"应用简介", default="", blank=True)
    created_time = models.DateTimeField(u"创建时间", auto_now_add=True)

    def __unicode__(self):
        return self.app_code

    class Meta:
        db_table = "esb_app_account"


class ModelWithBoard(models.Model):
    """标记组件所属的board"""

    board = models.CharField(max_length=64, null=True, blank=True, db_index=True)

    class Meta:
        abstract = True


class ComponentAPIDoc(ModelWithBoard):
    """
    @summary: 组件API文档
    """

    component_id = models.IntegerField(u"组件ID", unique=True, help_text=u"对应 ESBChannel 中的组件ID")
    doc_md = models.TextField(u"组件文档（MD格式）", blank=True, null=True)
    doc_html = models.TextField(u"组件文档（HTML格式）", blank=True, null=True)
    doc_md_md5 = models.CharField(max_length=128, default="", blank=True)
    created_time = models.DateTimeField(u"创建时间", auto_now_add=True)
    updated_time = models.DateTimeField(u"创建时间", auto_now=True)

    def __unicode__(self):
        return "%s" % self.component_id

    class Meta:
        verbose_name = u"组件接口文档"
        verbose_name_plural = u"组件接口文档"
        db_table = "esb_api_doc"


class FeedbackForComponentDocs(ModelWithBoard):
    """针对指定接口的反馈"""

    operator = models.CharField(u"反馈者", max_length=32)
    component_id = models.IntegerField(u"组件ID", help_text=u"对应 ESBChannel 中的组件ID")
    content = models.TextField(u"反馈内容", default="", blank=True, null=True)
    created_time = models.DateTimeField(u"创建时间", auto_now_add=True)

    def __unicode__(self):
        return "<operator:%s-component_id:%s>" % (self.operator, self.component_id)

    class Meta:
        verbose_name = u"接口反馈"
        verbose_name_plural = u"接口反馈"
        db_table = "esb_api_doc_feedback"


def init_app_comp_perm_expires():
    return timezone.now() + datetime.timedelta(days=180)


class AppComponentPerm(models.Model):
    """APP申请的组件权限"""

    app_code = models.CharField(u"蓝鲸应用编码", max_length=64)
    component_id = models.IntegerField(u"组件ID")
    expires = models.DateTimeField(u"APP访问组件过期时间", default=init_app_comp_perm_expires)
    created_time = models.DateTimeField(u"创建时间", auto_now_add=True)
    last_accessed_time = models.DateTimeField(u"APP最后访问组件时间", default=timezone.now)

    def __unicode__(self):
        return "<app_code: %s, component_id: %s>" % (self.app_code, self.component_id)

    class Meta:
        verbose_name = u"APP组件权限"
        verbose_name_plural = u"APP组件权限"
        db_table = "esb_app_component_perm"
        unique_together = ("app_code", "component_id")

    def touch_expires(self):
        self.expires = init_app_comp_perm_expires()


class WxmpAccessToken(models.Model):
    """保存微信开放平台业务的 AccessToken"""

    wx_app_id = models.CharField(u"微信APPID", max_length=128)
    access_token = models.CharField(u"凭证", max_length=1024)
    expires = models.DateTimeField(u"凭证过期时间")
    last_updated_time = models.DateTimeField(u"最后访问时间", default=timezone.now)

    class Meta:
        db_table = "esb_wxmp_access_token"
        verbose_name = u"微信公众号AccessToken"
        verbose_name_plural = u"微信公众号AccessToken"

    def __unicode__(self):
        return self.wx_app_id

    def touch(self):
        self.last_updated_time = timezone.now()

    def has_expired(self):
        return self.expires_in() < 300

    def expires_in(self):
        """返回该token还有多少秒过期"""
        return int((self.expires - timezone.now()).total_seconds())

    def get_info(self):
        return {
            "access_token": self.access_token,
            "expires_in": self.expires_in(),
        }


class SystemDocCategory(models.Model):
    """系统文档分类"""

    name = models.CharField(u"分类名称", max_length=32, db_index=True)
    priority = models.IntegerField(u"优先级", default=1000, help_text=u"展示时，数字小的展示在前面")
    created_time = models.DateTimeField(u"创建时间", auto_now_add=True)

    def __unicode__(self):
        return self.name

    class Meta:
        verbose_name = u"系统文档分类"
        verbose_name_plural = u"系统文档分类"
        ordering = ["priority", "id"]
        db_table = "esb_system_doc_category"
