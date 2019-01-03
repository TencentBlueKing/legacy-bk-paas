# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

from __future__ import unicode_literals

import os
import time
import json

from django.db import models
from django.conf import settings
from django.core.files.storage import FileSystemStorage

from common.log import logger
from common.constants import LogoImgRelatedDirEnum
from common.utils import should_update_logo, get_app_logo, file_size_bytes_to_m
from app.models import App
from app.constants import STATE_CHOICES_DISPALY_DICT, AppStateEnum
from saas.manager import SaaSAppManager, SaaSAppVersionManager


class SaaSApp(models.Model):

    code = models.CharField("应用编码", max_length=30, unique=True, help_text="此处请用英文字母")
    name = models.CharField("应用名称", max_length=20)

    # 对应的paas app, 一旦绑定, 不会解绑
    app = models.ForeignKey(to=App, blank=True, null=True, on_delete=models.CASCADE)

    # 正在执行上线的版本, 可能上线失败
    current_version = models.ForeignKey(to="SaaSAppVersion", related_name="current_versions", blank=True, null=True)

    # 在线上运行的版本
    online_version = models.ForeignKey(to="SaaSAppVersion", related_name="online_versions", blank=True, null=True)

    # 应用创建时间
    created_time = models.DateTimeField("创建时间", auto_now_add=True, blank=True, null=True)
    # 应用图标
    logo = models.ImageField(upload_to=LogoImgRelatedDirEnum.APP.value, blank=True, null=True)

    objects = SaaSAppManager()

    def save(self, *args, **kwargs):
        """
        保存前修改 logo 存放路径
        """
        if not self.logo:
            return super(SaaSApp, self).save(*args, **kwargs)

        should_update, logo_name = should_update_logo(self.code, self.logo.name)
        if should_update:
            self.logo.name = logo_name

        # save操作
        super(SaaSApp, self).save(*args, **kwargs)

    @property
    def logo_url(self):
        if self.logo:
            return '{}?v={}'.format(self.logo.url, time.time())

        logo = get_app_logo(self.code)
        if logo:
            return logo

        return '{}img/app_logo/default.png'.format(settings.STATIC_URL)

    @property
    def version(self):
        """
        应用的版本信息，如果无线上版本，则以当前版本为准
        """
        saas_version = self.online_version or self.current_version
        return saas_version.version if saas_version else ''

    @property
    def creater(self):
        saas_version = self.online_version or self.current_version
        if not saas_version:
            return '--'
        else:
            return saas_version.get_settings().get("author", '--')

    @property
    def app_prod_url(self):
        return settings.APP_PROD_URL.format(app_code=self.code)

    @property
    def is_already_online(self):
        """
        应用是否已经上线
        """
        if self.app:
            return self.app.is_already_online
        return False

    @property
    def created_date_display(self):
        if not self.created_time:
            return self.created_time
        return self.created_time.strftime('%Y-%m-%d')

    @property
    def state(self):
        if not self.app:
            return AppStateEnum.DEVELOPMENT.value
        return self.app.state

    @property
    def saas_state_display(self):
        if self.state == AppStateEnum.DEVELOPMENT.value:
            return "未部署"
        return STATE_CHOICES_DISPALY_DICT.get(self.state)

    def get_current_version_info(self, is_offline=False):
        """获取应用的版本信息

        下架（is_offline＝True）则获取 online_version 信息
        其他：先获取 online_versions 信息，无则获取 current_version
        """
        app_version = self.online_version
        # 线上版本不存在 且 不是下架页面，则获取 current_version 的信息
        if not app_version and not is_offline:
            app_version = self.current_version

        if not app_version:
            return False, {}

        # 版本配置信息
        try:
            settings = json.loads(app_version.settings)
            introduction = settings.get('introduction', '--')
            settings = json.dumps(settings, indent=4, ensure_ascii=False)
        except Exception:
            settings = '--'
            introduction = '--'
            logger.exception("解析应用(%s)的配置信息出错", self.code)

        app_file = app_version.upload_file if app_version else None
        # 文件大小：byte 转换为M，保留2位小数
        file_size = app_file.size if app_file else ''

        file_size = file_size_bytes_to_m(file_size)

        file_name = app_file.name if app_file else ''
        version = app_version.version
        # for: 部署时展示线上版本/当前版本信息给用户
        file_version_display = "{} (V{})".format(file_name, version)

        version_info = {
            'id': app_version.id,
            'version': version,
            'settings': settings,
            'introduction': introduction,
            'file_name': file_name,
            'file_version_display': file_version_display,
            'file_size': file_size,
            'md5': app_file.md5 if app_file else ''
        }
        return True, version_info

    def __unicode__(self):
        return self.code

    def __str__(self):
        return self.code

    class Meta:
        ordering = ('-code',)
        db_table = 'paas_saas_app'
        verbose_name = "SaaS 应用"
        verbose_name_plural = "SaaS 应用"


class SaaSAppVersion(models.Model):
    """
    SaaSVersion
    """
    version = models.CharField("版本", max_length=20)
    # 配置json串
    settings = models.TextField("包配置", blank=True, null=True)

    # 所属的saas app, 当saas app被删除, 级联删除
    saas_app = models.ForeignKey(to="SaaSApp", blank=False, null=False, on_delete=models.CASCADE)
    # 对应文件
    upload_file = models.ForeignKey(to="SaaSUploadFile", blank=False, null=False)

    objects = SaaSAppVersionManager()

    def __unicode__(self):
        return '%s %s %s' % (self.id, self.version, self.upload_file)

    def __str__(self):
        return '%s %s %s' % (self.id, self.version, self.upload_file)

    class Meta:
        db_table = 'paas_saas_app_version'
        verbose_name = "SaaS 应用版本"
        verbose_name_plural = "SaaS 应用版本"

    def get_settings(self):
        try:
            settings = json.loads(self.settings)
        except Exception:
            settings = {}
            logger.exception("应用配置信息解析异常")
        return settings

    def gen_app_info_from_settings(self, app_code):
        """
        从配置中解析得到app_info
        """
        settings = self.get_settings()
        if not settings:
            message = "应用(code:{})配置信息解析异常".format(app_code)
            return False, message, None

        introduction = settings.get("introduction", '')
        language = settings.get("language", 'python')
        is_use_celery = settings.get("is_use_celery", False)
        author = settings.get("author", '')
        category = settings.get("category", u'其它')
        desktop = settings.get("desktop") or {}

        # 1. 判断app_code是否重复了, 重复则报错
        app_info = {
            'introduction': introduction,
            'language': language,
            'author': author,
            'is_use_celery': is_use_celery,
            'is_use_celery_beat': is_use_celery,
            'category': category,
            'desktop': desktop
        }

        return True, 'success', app_info

    def gen_saas_settings_for_deploy(self):
        """for deploy
        """
        settings = self.get_settings()
        upload_file = self.upload_file

        saas_settings = {}
        saas_settings.update(settings)
        saas_settings["url"] = upload_file.url
        saas_settings["md5"] = upload_file.md5

        return saas_settings


class OverwriteStorage(FileSystemStorage):
    """
    overwrite the file on disk if the name is the same
    """
    def get_available_name(self, name):
        """Returns a filename that's free on the target storage system, and
        available for new content to be written to.

        Found at http://djangosnippets.org/snippets/976/
        """
        # If the filename already exists, remove it as if it was a true file system
        if self.exists(name):
            os.remove(os.path.join(settings.MEDIA_ROOT, name))
        return name


class SaaSUploadFile(models.Model):
    """
    SaaS上传安装包
    """
    name = models.CharField("文件名", max_length=100)
    size = models.IntegerField("文件大小", default=0, blank=True, null=True)
    md5 = models.CharField("md5", max_length=32, blank=False, null=False)
    # file = models.FileField("文件", upload_to="saas_files")
    file = models.FileField("文件", upload_to="saas_files", storage=OverwriteStorage())

    uploaded_at = models.DateTimeField("上传时间", auto_now_add=True, db_index=True)

    @property
    def url(self):
        return self.file.url

    def __unicode__(self):
        return self.name

    def __str__(self):
        return self.name

    class Meta:
        ordering = ('-uploaded_at',)
        db_table = 'paas_saas_upload_file'
        verbose_name = "SaaS上传安装包"
        verbose_name_plural = "SaaS上传安装包"
