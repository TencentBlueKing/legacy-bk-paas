# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

from __future__ import unicode_literals

import time

from django.conf import settings
from django.db import models
from django.db.models.deletion import SET_NULL

from app.constants import (DB_TYPE_CHOICES, LANGUAGE_CHOICES, STATE_CHOICES,
                           STATE_CHOICES_DISPALY_DICT, VCS_TYPE_CHOICES,
                           AppStateEnum, LanguageEnum, VCSTypeEnum, DBTypeEnum)
from app.manager import AppManager, SecureInfoManager
from common.utils import should_update_logo, get_app_logo
from common.constants import LogoImgRelatedDirEnum

# just for remove django warning
import warnings
from django.utils.deprecation import RemovedInDjango19Warning
warnings.simplefilter('ignore', RemovedInDjango19Warning)


class AppTags(models.Model):
    """
    应用所属分类
    """
    name = models.CharField("分类名称", max_length=20, unique=True)
    code = models.CharField("分类英文ID", max_length=30, unique=True)
    index = models.IntegerField("排序", default=0, help_text="降序排序，即 9 在 0 之前")

    def __unicode__(self):
        return '%s(%s)' % (self.code, self.name)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ('-index',)
        db_table = 'paas_apptags'
        verbose_name = "应用分类信息"
        verbose_name_plural = "应用分类信息"


class App(models.Model):
    """
    应用基本信息表
    """
    name = models.CharField("应用名称", max_length=20, unique=True)
    code = models.CharField("应用编码", max_length=30, unique=True, help_text="此处请用英文字母")
    introduction = models.TextField("应用简介")

    creater = models.CharField("创建者", max_length=20)
    # 等于, 新增记录的时间
    created_date = models.DateTimeField("创建时间", auto_now_add=True, blank=True, null=True, db_index=True)

    state = models.SmallIntegerField("应用开发状态", choices=STATE_CHOICES, help_text="app的开发状态",
                                     default=AppStateEnum.DEVELOPMENT.value)
    tags = models.ForeignKey(AppTags, help_text="应用分类", blank=True, null=True, on_delete=SET_NULL)
    is_already_test = models.BooleanField("是否已经提测", default=False, help_text="app在测试环境下架或者开发中状态，修改该字段为False。")
    is_already_online = models.BooleanField("是否已经上线", default=False, help_text="app正式环境未下架，该字段为True。")

    first_test_time = models.DateTimeField("应用首次提测时间", help_text="记录应用首次提测时间", blank=True, null=True, db_index=True)
    first_online_time = models.DateTimeField("应用首次上线时间", help_text="记录应用首次上线时间", blank=True, null=True, db_index=True)
    # 开发者信息
    developer = models.ManyToManyField(settings.AUTH_USER_MODEL, verbose_name="开发者", related_name='developers')
    # APP语言
    language = models.CharField("语言", choices=LANGUAGE_CHOICES, default=LanguageEnum.PYTHON.value,
                                max_length=50, blank=True, null=True)

    # celery
    is_use_celery = models.BooleanField("app是否使用celery", default=False, help_text="选项: true(是)，false(否)")
    is_use_celery_beat = models.BooleanField("app是否使用定时任务", default=False, help_text="选项: true(是)，false(否)")

    auth_token = models.CharField('Token', max_length=36, blank=True, null=True)
    # 部署的激活码,暂时不用，默认值为null
    deploy_token = models.TextField('deploy_token', blank=True, null=True)
    # 是否作为SaaS服务，即通过直接上传包部署
    is_saas = models.BooleanField('是否为SaaS服务', default=False, help_text="SaaS服务，即通过直接上传包部署")
    # 应用图标
    logo = models.ImageField(upload_to=LogoImgRelatedDirEnum.APP.value, blank=True, null=True)

    objects = AppManager()

    def save(self, *args, **kwargs):
        """
        保存前修改 logo 存放路径
        """
        if not self.logo:
            return super(App, self).save(*args, **kwargs)
        should_update, logo_name = should_update_logo(self.code, self.logo.name)
        if should_update:
            self.logo.name = logo_name
        # save操作
        super(App, self).save(*args, **kwargs)

    @property
    def logo_url(self):
        if self.logo:
            return '{}?v={}'.format(self.logo.url, time.time())

        logo = get_app_logo(self.code)
        if logo:
            return logo

        return '{}img/app_logo/default.png'.format(settings.STATIC_URL)

    @property
    def state_display(self):
        return STATE_CHOICES_DISPALY_DICT.get(self.state)

    @property
    def saas_state_display(self):
        if self.state == AppStateEnum.DEVELOPMENT.value:
            return "未部署"
        return STATE_CHOICES_DISPALY_DICT.get(self.state)

    @property
    def created_date_display(self):
        if not self.created_date:
            return self.created_date
        return self.created_date.strftime('%Y-%m-%d')

    @property
    def first_test_time_display(self):
        if not self.first_test_time:
            return self.first_test_time
        return self.first_test_time.strftime('%Y-%m-%d %H:%M:%S')

    @property
    def first_online_time_display(self):
        if not self.first_online_time:
            return self.first_online_time
        return self.first_online_time.strftime('%Y-%m-%d %H:%M:%S')

    @property
    def introduction_display(self):
        if not self.introduction:
            return self.introduction
        return self.introduction.replace('\n', '<br/>')

    @property
    def app_test_url(self):
        return settings.APP_TEST_URL.format(app_code=self.code)

    @property
    def app_prod_url(self):
        return settings.APP_PROD_URL.format(app_code=self.code)

    @property
    def developer_str(self):
        return ';'.join([item.username for item in self.developer.all()])

    def gen_dashboard_dict(self, is_online):
        """将应用转换为前台展示的列表数据
        """
        logo = self.logo_url
        if self.is_saas:
            from saas.models import SaaSApp
            saas_app = SaaSApp.objects.filter(app=self)
            if saas_app.exists():
                logo = saas_app[0].logo_url

        return {
            'code': self.code,
            'name': self.name,
            'introduction': self.introduction,
            'logo': logo,
            'link': self.app_prod_url,
            'is_online': is_online
        }

    def can_be_test(self):
        # 只有[下架/开发/测试/上线]状态可操作 部署测试
        if self.state not in [AppStateEnum.OFFLINE.value, AppStateEnum.DEVELOPMENT.value,
                              AppStateEnum.TEST.value, AppStateEnum.ONLINE.value]:
            return False, "应用当前状态为：{}，不能进行提测操作！".format(self.get_state_display())
        return True, "OK"

    def can_be_online(self):
        if self.state not in [AppStateEnum.OFFLINE.value, AppStateEnum.TEST.value]:
            return False, "应用当前状态：{}，APP需要重新测试部署后，才可以进行正式部署操作！".format(self.get_state_display())
        return True, "OK"

    def can_be_offline(self, mode):
        if self.state not in [AppStateEnum.OFFLINE.value, AppStateEnum.TEST.value, AppStateEnum.ONLINE.value]:
            return False, "应用当前状态为：{}，不能进行下架操作！".format(self.get_state_display())
        elif mode in ["test", "all"] and not self.is_already_test:
            return False, "应用测试环境已经下架！"
        elif mode in ["prod", "all"] and not self.is_already_online:
            return False, "应用正式环境已经下架！"
        return True, "OK"

    def can_be_deleted(self, username):
        if self.creater != username:
            return False, "非应用创建者，不能删除！"

        if self.state not in [AppStateEnum.DEVELOPMENT.value]:
            return False, "应用已经部署过，不能删除！"
        return True, "OK"

    def trigger_celery(self, is_use_celery, is_use_celery_beat):
        self.is_use_celery = is_use_celery
        self.is_use_celery_beat = is_use_celery_beat
        self.save()

    def __unicode__(self):
        return '%s(%s)' % (self.code, self.name)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'paas_app'
        verbose_name = "应用基本信息"
        verbose_name_plural = "应用基本信息"


class SecureInfo(models.Model):
    """
    APP 安全验证相关信息
    """
    app_code = models.CharField("对应的appcode", max_length=30, unique=True)

    # 源代码版本信息
    vcs_type = models.SmallIntegerField("版本控制类型", choices=VCS_TYPE_CHOICES, help_text="版本仓库类型",
                                        default=VCSTypeEnum.SVN.value)
    vcs_url = models.CharField("版本库URL", max_length=1024, blank=True, null=True)
    vcs_username = models.CharField("版本库用户名", max_length=50, blank=True, null=True)
    vcs_password = models.CharField("版本库密码", max_length=50, blank=True, null=True)

    # App数据库信息
    db_type = models.CharField("数据库类型", choices=DB_TYPE_CHOICES, default=DBTypeEnum.MYSQL.value,
                               max_length=20, blank=True, null=True)
    db_host = models.CharField("数据库HOST", max_length=1024, blank=True, null=True)
    db_port = models.IntegerField("数据库PORT", default=3306, blank=True, null=True)
    db_name = models.CharField("数据库名称", max_length=30, blank=True, null=True)
    db_username = models.CharField("数据库用户名", max_length=50, blank=True, null=True)
    db_password = models.CharField("数据库密码", max_length=50, blank=True, null=True)

    objects = SecureInfoManager()

    @property
    def vcs_type_text(self):
        text = dict(VCS_TYPE_CHOICES).get(self.vcs_type)
        return text.lower() if text else 'unknow'

    def __unicode__(self):
        return self.app_code

    class Meta:
        db_table = 'paas_app_secureinfo'
        verbose_name = "应用安全相关信息"
        verbose_name_plural = "应用安全相关信息"
