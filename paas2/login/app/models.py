# -*- coding: utf-8 -*-
"""
Copyright © 2012-2017 Tencent BlueKing. All Rights Reserved. 蓝鲸智云 版权所有
"""
from django.db import models
from django.conf import settings
from django.utils.translation import ugettext as _
from django.db.models.deletion import SET_NULL

from app.constants import STATE_CHOICES, LANGUAGE_CHOICES, OPENMODE_CHOICES


APP_LOGO_IMG_RELATED = "applogo"


class AppTags(models.Model):
    """
    应用所属分类
    """

    name = models.CharField(u"分类名称", max_length=20, unique=True)
    code = models.CharField(u"分类英文ID", max_length=30, unique=True)
    index = models.IntegerField(u"排序", default=0, help_text=u"降序排序，即 9 在 0 之前")

    @property
    def name_display(self):
        if not self.name:
            return self.name
        return _(self.name)

    def __unicode__(self):
        return "%s(%s)" % (self.code, self.name)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ("index",)
        db_table = "paas_apptags"
        verbose_name = u"应用分类信息"
        verbose_name_plural = u"应用分类信息"


class App(models.Model):
    """
    应用基本信息表
    """

    name = models.CharField(u"应用名称", max_length=20, unique=True)
    code = models.CharField(u"应用编码", max_length=30, unique=True, help_text=u"此处请用英文字母")
    introduction = models.TextField(u"应用简介")

    name_en = models.CharField(u"英文应用名称", max_length=30, blank=True, null=True)
    introduction_en = models.TextField(u"英文应用简介", blank=True, null=True)

    creater = models.CharField(u"创建者", max_length=20)
    # 等于, 新增记录的时间
    created_date = models.DateTimeField(u"创建时间", auto_now_add=True, blank=True, null=True, db_index=True)

    state = models.SmallIntegerField(u"应用开发状态", choices=STATE_CHOICES, help_text=u"app的开发状态", default=1)
    tags = models.ForeignKey(AppTags, help_text=u"应用分类", blank=True, null=True, on_delete=SET_NULL)
    is_already_test = models.BooleanField(u"是否已经提测", default=False, help_text=u"app在测试环境下架或者开发中状态，修改该字段为False。")
    is_already_online = models.BooleanField(u"是否已经上线", default=False, help_text=u"app正式环境未下架，该字段为True。")

    first_test_time = models.DateTimeField(u"应用首次提测时间", help_text=u"记录应用首次提测时间", blank=True, null=True, db_index=True)
    first_online_time = models.DateTimeField(
        u"应用首次上线时间", help_text=u"记录应用首次上线时间", blank=True, null=True, db_index=True
    )
    # 开发者信息
    developer = models.ManyToManyField(settings.AUTH_USER_MODEL, verbose_name=u"开发者", related_name="developers")
    # APP语言
    language = models.CharField(
        u"语言", choices=LANGUAGE_CHOICES, default="python", max_length=50, blank=True, null=True
    )

    # celery
    is_use_celery = models.BooleanField(u"app是否使用celery", default=False, help_text=u"选项: true(是)，false(否)")
    is_use_celery_beat = models.BooleanField(u"app是否使用定时任务", default=False, help_text=u"选项: true(是)，false(否)")

    auth_token = models.CharField("Token", max_length=36, blank=True, null=True)
    # 部署的激活码,暂时不用，默认值为null
    deploy_token = models.TextField("deploy_token", blank=True, null=True)
    # 是否作为SaaS服务，即通过直接上传包部署
    is_saas = models.BooleanField("是否为SaaS服务", default=False, help_text=u"SaaS服务，即通过直接上传包部署")
    # 应用图标
    # logo = models.ImageField(upload_to=APP_LOGO_IMG_RELATED, blank=True, null=True)
    # 桌面应用基本属性
    width = models.IntegerField(u"app页面宽度", blank=True, null=True, help_text=u"应用页面宽度，必须为整数，单位为px")
    height = models.IntegerField(u"app页面高度", blank=True, null=True, help_text=u"应用页面高度，必须为整数，单位为px")
    is_max = models.BooleanField(u"是否默认窗口最大化", default=False)
    is_setbar = models.BooleanField(u"窗口是否详情等按钮", default=True, help_text=u"选项: true(有)，false(无)")
    is_resize = models.BooleanField(u"是否能对窗口进行拉伸", default=True, help_text=u"选项：true(可以拉伸)，false(不可以拉伸)")
    use_count = models.IntegerField(u"使用人数", default=0, help_text=u"添加了该应用的人数，note：用户卸载应用后，要相应的减1")
    is_default = models.BooleanField(u"是否为默认应用", default=False, help_text=u"默认应用将在用户首次进入工作台时自动到用户桌面")
    is_display = models.BooleanField(u"是否在桌面展示", default=True, help_text=u"选项: true(有)，false(无)")
    open_mode = models.CharField(u"应用打开方式", max_length=20, choices=OPENMODE_CHOICES, default="desktop")

    # 第三方应用
    is_third = models.BooleanField("是否为第三方应用", default=False, help_text=u"第三方应用，即外部应用，不走自动部署")
    external_url = models.CharField(u"第三方应用URL", max_length=255, help_text=u"当且仅当应用类型为第三方应用时必填", blank=True, null=True)
    # 默认内部应用, 为了获取esb鉴权(esb加白)而生成securt_key的给其他系统调用esb使用 而生成的应用
    is_sysapp = models.BooleanField(
        "是否为系统间应用", default=False, help_text=u"为了获取esb鉴权(esb加白)而生成securt_key的给其他系统调用esb使用 而生成的应用"
    )
    # 平台级别应用(cc, ijobs等)
    is_platform = models.BooleanField("是否为平台级应用", default=False, help_text=u"平台应用（配置平台、作业平台等）")
    # 轻应用
    is_lapp = models.BooleanField(u"是否为轻应用", default=False, help_text=u"标准运维创建的应用")

    # NOTE: should be visiable_labels, without _
    visiable_labels = models.CharField(u"可见范围标签", max_length=1024, blank=True, null=True)

    def __unicode__(self):
        return "%s(%s)" % (self.code, self.name)

    def __str__(self):
        return self.name

    class Meta:
        db_table = "paas_app"
        verbose_name = u"应用基本信息"
        verbose_name_plural = u"应用基本信息"
