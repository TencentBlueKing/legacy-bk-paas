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

from past.builtins import cmp
from builtins import str
from builtins import object
import os
import time
import json

from django.db import models
from django.conf import settings
from django.core.files.storage import FileSystemStorage
from django.utils import timezone
from django.utils.translation import ugettext as _, ugettext_lazy as _l

from common.constants import (
    ModeEnum,
    DESKTOP_DEFAULT_APP_WIDTH,
    DESKTOP_DEFAULT_APP_HEIGHT,
    DESKTOP_DEFAULT_APP_IS_MAX,
    BLUEKING_CREATER_DICT,
)
from common.log import logger
from app.models import App
from app.constants import STATE_CHOICES_DISPALY_DICT
from common.utils.file import file_size_bytes_to_m
from saas.manager import SaaSAppManager, SaaSUploadFileManager, SaaSVersionManager
from common.constants import APP_LOGO_IMG_RELATED, SAAS_APP_LOGO_IMG_RELATED


class SaaSApp(models.Model):

    code = models.CharField(_l(u"应用编码"), max_length=30, unique=True, help_text=_l(u"此处请用英文字母"))
    name = models.CharField(_l(u"应用名称"), max_length=20)

    # 对应的paas app, 一旦绑定, 不会解绑
    app = models.ForeignKey(to=App, blank=True, null=True, on_delete=models.CASCADE)

    # 正在执行上线的版本, 可能上线失败
    current_version = models.ForeignKey(to="SaaSAppVersion", related_name="current_versions", blank=True, null=True)

    # 在线上运行的版本
    online_version = models.ForeignKey(to="SaaSAppVersion", related_name="online_versions", blank=True, null=True)

    # NOTE: 测试环境, 正在执行发布测试环境的版本 / 当前测试环境版本及
    current_test_version = models.ForeignKey(
        to="SaaSAppVersion", related_name="current_test_version", blank=True, null=True
    )
    test_version = models.ForeignKey(to="SaaSAppVersion", related_name="test_versions", blank=True, null=True)

    # 应用创建时间
    created_time = models.DateTimeField(_l(u"创建时间"), auto_now_add=True, blank=True, null=True)
    # 应用图标
    logo = models.ImageField(upload_to=APP_LOGO_IMG_RELATED, blank=True, null=True)

    objects = SaaSAppManager()

    @property
    def logo_url(self):
        if self.logo:
            return "%s?v=%s" % (self.logo.url, time.time())
        else:
            # 判断 以 app_code 命名的 logo 图片是否存在
            logo_name = "%s/%s.png" % (APP_LOGO_IMG_RELATED, self.code)
            logo_path = os.path.join(settings.MEDIA_ROOT, logo_name)
            if os.path.exists(logo_path):
                return "%s%s" % (settings.MEDIA_URL, logo_name)

            # 判断是否是上传saas解压生成的文件, 存在的话使用之(saas内置应用上传包中带的logo)
            logo_name = "%s/%s.png" % (SAAS_APP_LOGO_IMG_RELATED, self.code)
            logo_path = os.path.join(settings.MEDIA_ROOT, logo_name)
            if os.path.exists(logo_path):
                return "%s%s" % (settings.MEDIA_URL, logo_name)

            return "%simg/app_logo/default.png" % settings.STATIC_URL

    @property
    def version(self):
        """
        应用的版本信息，如果无线上版本，则以当前版本为准
        """
        # TODO: maybe need to remove current_version
        saas_version = self.online_version or self.current_version
        return saas_version.version if saas_version else ""

    @property
    def creater(self):
        saas_version = self.online_version or self.current_version
        if not saas_version:
            return "--"
        else:
            creater = saas_version.get_settings().get("author", "--")
            if creater not in BLUEKING_CREATER_DICT:
                return creater
            return _(creater)

    @property
    def app_test_url(self):
        return settings.APP_TEST_URL.format(app_code=self.code)

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
    def is_already_test(self):
        """
        应用是否已经提测
        """
        if self.app:
            return self.app.is_already_test
        return False

    @property
    def created_date_display(self):
        if not self.created_time:
            return self.created_time
        t = timezone.localtime(self.created_time)
        return t.strftime("%Y-%m-%d")
        # return self.created_time.strftime('%Y-%m-%d')

    @property
    def name_display(self):
        if self.app:
            return self.app.name_display
        return _(self.name)

    @property
    def state(self):
        if not self.app:
            return 1
        return self.app.state

    @property
    def saas_state_display(self):
        if self.state == 1:
            return _(u"未部署")
        return _(STATE_CHOICES_DISPALY_DICT.get(self.state))

    def is_already_deployed(self, mode):
        return self.is_already_test if mode == ModeEnum.TEST else self.is_already_online

    def get_saas_version(self, mode):
        return self.test_version if mode == ModeEnum.TEST else self.online_version

    def get_deployable_version(self):
        """
        内置应用只初始化了current_version, 自动部署时需要确保部署最新版本
        """
        saas_version = self.online_version or self.current_version
        return saas_version

    def _del_exist_file(self, name):
        _file = os.path.join(settings.MEDIA_ROOT, name)
        if os.path.exists(_file):
            os.remove(_file)

    def save(self, *args, **kwargs):
        """
        TODO: 发布到正式才改logo生效?
        保存前修改 logo 存放路径
        """
        if not self.logo:
            return super(SaaSApp, self).save(*args, **kwargs)
        # 修改图片名称
        logo_ext = ".png"
        # 判断logo名称
        if self.logo.name.find("\\") >= 0:
            logo_name = APP_LOGO_IMG_RELATED + "\\" + str(self.code) + logo_ext
        elif self.logo.name.find("/") >= 0:
            logo_name = APP_LOGO_IMG_RELATED + "/" + str(self.code) + logo_ext
        else:
            logo_name = APP_LOGO_IMG_RELATED + "/" + str(self.code) + logo_ext
        # 判断图片路径与旧图路径名称是否相同
        if cmp(logo_name, self.logo.name):
            logo_name = APP_LOGO_IMG_RELATED + "/" + str(self.code) + logo_ext
            self._del_exist_file(logo_name)
            # 指定图片名称
            self.logo.name = APP_LOGO_IMG_RELATED + "/" + str(self.code) + logo_ext
        # save操作
        super(SaaSApp, self).save(*args, **kwargs)

    def __unicode__(self):
        return self.code

    def __str__(self):
        return self.code

    class Meta(object):
        ordering = ("-code",)
        db_table = "paas_saas_app"
        verbose_name = _l(u"SaaS 应用")
        verbose_name_plural = _l(u"SaaS 应用")


class SaaSAppVersion(models.Model):
    """
    SaaSVersion

    逻辑上限制了: 一个version, 一个saas_app
    """

    version = models.CharField(_l(u"版本"), max_length=20)
    # 配置json串
    settings = models.TextField(_l(u"包配置"), blank=True, null=True)

    # 所属的saas app, 当saas app被删除, 级联删除
    saas_app = models.ForeignKey(to="SaaSApp", blank=False, null=False, on_delete=models.CASCADE)
    # 对应文件
    upload_file = models.ForeignKey(to="SaaSUploadFile", blank=False, null=False)

    updated_at = models.DateTimeField(_l(u"更新时间"), auto_now=True, blank=True, null=True)

    objects = SaaSVersionManager()

    def get_settings(self):
        try:
            settings = json.loads(self.settings)
        except Exception:
            settings = {}
            logger.exception(u"应用配置信息解析异常")
        return settings

    def get_desk_info(self):
        settings = self.get_settings()
        info = settings.get("desktop") or {
            "width": DESKTOP_DEFAULT_APP_WIDTH,
            "height": DESKTOP_DEFAULT_APP_HEIGHT,
            "is_max": DESKTOP_DEFAULT_APP_IS_MAX,
        }

        # saas uploaded but not deployed yet
        if "width" not in info:
            info["width"] = DESKTOP_DEFAULT_APP_WIDTH
        if "height" not in info:
            info["height"] = DESKTOP_DEFAULT_APP_HEIGHT
        if "is_max" not in info:
            info["is_max"] = DESKTOP_DEFAULT_APP_IS_MAX

        return info

    def get_settings_for_deploy(self):
        """
        engine/deploy.py 部署时需要的配置
        """
        saas_settings = {}

        settings = self.get_settings()
        saas_settings.update(settings)

        upload_file = self.upload_file
        saas_settings["url"] = upload_file.url
        saas_settings["md5"] = upload_file.md5

        return saas_settings

    def get_version_info(self):
        settings = self.get_settings()

        settings_str = json.dumps(settings, indent=4, ensure_ascii=False)

        file_size = file_name = file_md5 = ""
        app_file = self.upload_file
        if app_file:
            # 文件大小：byte 转换为M，保留2位小数
            file_size = app_file.size
            file_size = file_size_bytes_to_m(file_size)

            file_name = app_file.name
            file_md5 = app_file.md5

        return {
            "version": self.version,
            "settings": settings_str.replace("\n", "<br>").replace(" ", "&nbsp;"),
            "file_name": file_name,
            "file_size": file_size,
            "file_md5": file_md5,
        }

    def __unicode__(self):
        return "%s %s %s" % (self.id, self.version, self.upload_file)

    def __str__(self):
        return "%s %s %s" % (self.id, self.version, self.upload_file)

    class Meta(object):
        db_table = "paas_saas_app_version"
        verbose_name = _l(u"SaaS 应用版本")
        verbose_name_plural = _l(u"SaaS 应用版本")


class SaaSUploadFile(models.Model):
    """
    SaaS上传安装包
    """

    name = models.CharField(_l(u"文件名"), max_length=100)
    size = models.IntegerField(_l(u"文件大小"), default=0, blank=True, null=True)
    md5 = models.CharField(u"md5", max_length=32, blank=False, null=False)

    # 重命名, 不要覆盖原来的文件, 即使越来越多也没关系.
    # 保证在数据库里面根据版本寻址能找到
    file = models.FileField(_l(u"文件"), upload_to="saas_files")
    # file = models.FileField(u"文件", upload_to="saas_files", storage=OverwriteStorage())

    uploaded_at = models.DateTimeField(_l(u"上传时间"), auto_now_add=True, db_index=True)

    objects = SaaSUploadFileManager()

    @property
    def url(self):
        return self.file.url

    @property
    def uploaded_at_display(self):
        if not self.uploaded_at:
            return self.uploaded_at
        t = timezone.localtime(self.uploaded_at)
        return t.strftime("%Y-%m-%d %H:%M:%S %z")

    def __unicode__(self):
        return self.name

    def __str__(self):
        return self.name

    class Meta(object):
        ordering = ("-uploaded_at",)
        db_table = "paas_saas_upload_file"
        verbose_name = _l(u"SaaS上传安装包")
        verbose_name_plural = _l(u"SaaS上传安装包")


class OverwriteStorage(FileSystemStorage):
    """
    overwrite the file on disk if the name is the same
    """

    def get_available_name(self, name):
        """Returns a filename that's free on the target storage system, and
        available for new content to be written to.

        Found at http://djangosnippets.org/snippets/976/
        """
        # TODO: 文件不覆盖, 文件重命名为 xxx_V版本号
        # If the filename already exists, remove it as if it was a true file system
        if self.exists(name):
            os.remove(os.path.join(settings.MEDIA_ROOT, name))
        return name
