# -*- coding: utf-8 -*-
from django.db import models

from .constants import ApiTypeEnum

# just for remove django warning
import warnings
from django.utils.deprecation import RemovedInDjango19Warning

warnings.simplefilter("ignore", RemovedInDjango19Warning)


class API(models.Model):
    """API Info"""

    api_name = models.CharField(u"API 英文名", max_length=64, unique=True)
    api_name_slug = models.CharField(u"API 用于 domain 的名称", max_length=64, unique=True, blank=True, default="")
    description = models.TextField(u"API描述", blank=True, default="")
    app_code_white = models.TextField(u"APP Code白名单", blank=True, default="", help_text=u"允许访问的蓝鲸应用，先保留")
    user_type = models.IntegerField(u"用户身份类型", default=0)

    enable_hard_throttle = models.BooleanField(r"是否开启强制流控", default=True)
    throttle_strategy = models.TextField(
        u"流控策略", blank=True, default="", help_text=u'仅支持一种规则，例如{"tokens": 100, "period": {"second": 1}}'
    )

    extra_headers = models.TextField(u"请求头信息", blank=True, default="")
    creator = models.CharField(u"创建者", max_length=100)
    maintainers = models.TextField(u"维护者", blank=True, default="")
    created_time = models.DateTimeField(u"创建时间", auto_now_add=True)
    updated_time = models.DateTimeField(u"修改时间", auto_now=True)
    # RSA公钥，私钥
    private_key = models.TextField(u"API网关私钥", blank=True, default="", help_text=u"网关使用，请注意保密")
    public_key = models.TextField(u"API网关公钥", blank=True, default="", help_text=u"开发者使用，显示到基本信息")
    key_updated_time = models.DateTimeField(u"密钥修改时间", blank=True, null=True)
    bind_app = models.CharField(u"绑定的蓝鲸应用", max_length=512, blank=True, default="")
    # API分类
    api_type = models.IntegerField(u"API分类", default=10, choices=ApiTypeEnum.get_choices())
    # 网关下资源的数量限制
    max_resource_count = models.IntegerField(u"最大允许的资源数量", default=30)
    # 网关层针对蓝鲸应用的访问频率
    rate_limit_required = models.BooleanField(u"是否校验访问频率", default=False)
    rate_limit_conf = models.TextField(
        u"请求频率配置",
        null=True,
        blank=True,
        help_text=u'限制访问频率，允许多种规则，例如{"app_ratelimit": {"__default": {"token":1000, "minute": 1}, "gcloud": {"token":1000, "minute": 1}}}',  # noqa
    )
    unfiltered_params = models.CharField(
        u"不过滤的参数",
        max_length=512,
        default="",
        blank=True,
        help_text=u"多个以逗号分隔，敏感参数将在API Gateway被过滤，不向后端传递，但是网关指定不过滤的参数，将会被向后传递",
    )

    def __unicode__(self):
        return "<API: %s>" % self.api_name

    class Meta:
        verbose_name = u"API信息"
        verbose_name_plural = u"API信息"
        db_table = "apigw_api"


class Stage(models.Model):
    """用户选择的部署环境"""

    api_id = models.IntegerField(u"API ID")
    stage_name = models.CharField(u"部署环境", max_length=64)
    description = models.TextField(u"部署环境描述", blank=True, default="")
    stage_variables = models.TextField(
        u"stage参数", blank=True, default="", help_text=u'现阶段stage参数用于对应不同域名，如{"domain": "bk.domain.com"}，以json串存储'
    )

    def __unicode__(self):
        return "<Stage: %s>" % self.stage_name

    class Meta:
        verbose_name = u"Stage部署环境"
        verbose_name_plural = u"Stage部署环境"
        unique_together = ("api_id", "stage_name")
        db_table = "apigw_stage"


class Resource(models.Model):
    """资源信息"""

    api_id = models.IntegerField(u"API ID", db_index=True)
    path = models.CharField(u"注册路径", max_length=2048)
    registed_http_method = models.CharField(u"注册的请求方法", max_length=64)
    resource_name = models.CharField(u"资源名称", max_length=256, blank=True, default="", help_text="注册的资源名称，允许为空")
    description = models.TextField(u"资源描述", blank=True, default="")

    dest_http_method = models.CharField(u"目的请求方法", max_length=64)
    dest_url = models.CharField(u"目标地址", max_length=2048)
    extra_headers = models.TextField(u"请求头信息", blank=True, default="")
    verify_params = models.TextField(u"校验参数", blank=True, default="")
    timeout = models.IntegerField(u"请求目标地址超时时间", blank=True, null=True)

    skip_auth_verification = models.BooleanField(u"跳过用户验证", default=False)
    auth_verified_required = models.BooleanField(u"用户通过校验", default=True)

    app_verified_required = models.BooleanField(u"APP通过校验", default=True)
    # 在校验蓝鲸应用的基础上，选择是否需要申请资源访问权限
    # 只允许选择是否需要访问权限，不允许用户自己限制蓝鲸应用白名单
    resource_perm_required = models.BooleanField(u"是否需要申请资源访问权限", default=False)
    is_hide = models.BooleanField(u"是否隐藏", default=False, help_text=u"帮助用户")
    app_code_white = models.TextField(u"蓝鲸应用白名单", blank=True, default="", help_text=u"蓝鲸应用白名单")

    app_verified_type = models.IntegerField(u"APP校验方式", default=0)
    rate_limit_required = models.BooleanField(u"是否校验访问频率", default=False)
    rate_limit_conf = models.TextField(
        u"请求频率配置", blank=True, default="", help_text=u'限制访问频率，允许多种规则，例如[{"token":1000, "minute": 1}]'
    )

    is_deleted = models.BooleanField(u"是否删除", default=False)
    # 资源分类
    resource_classification_id = models.IntegerField(u"资源分类")
    creator = models.CharField(u"创建者", max_length=100)
    created_time = models.DateTimeField(u"创建时间", auto_now_add=True)
    updated_time = models.DateTimeField(u"修改时间", auto_now=True)

    def __unicode__(self):
        return "<path: %s>" % self.path

    class Meta:
        verbose_name = u"Resource接口信息"
        verbose_name_plural = u"Resource接口信息"
        db_table = "apigw_resource"


class StageRelatedResouece(models.Model):
    """存储stage和resource关联"""

    api_id = models.IntegerField(u"网关 ID")
    stage_id = models.IntegerField(u"网关环境 ID")
    resource_id = models.IntegerField(u"资源 ID")
    created_time = models.DateTimeField(u"创建时间", auto_now_add=True)
    updated_time = models.DateTimeField(u"修改时间", auto_now=True)
    status = models.BooleanField(u"开放状态", default=True)
    operator = models.CharField(u"操作者", max_length=32, blank=True, default="")

    def __unicode__(self):
        return "<api_id: %s, stage_id: %s, resource_id: %s>" % (self.api_id, self.stage_id, self.resource_id)

    class Meta:
        verbose_name = u"管理Stage和Resource关系"
        verbose_name_plural = u"管理Stage和Resource关系"
        db_table = "apigw_stage_related_resource"
        unique_together = ("api_id", "stage_id", "resource_id")
