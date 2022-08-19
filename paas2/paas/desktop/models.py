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

from builtins import object

from app.models import App
from desktop.constants import MARKET_NAV_CHOICES, MarketNavEnum
from django.conf import settings
from django.db import models
from django.utils.translation import ugettext_lazy as _l


class Wallpaper(models.Model):
    """
    桌面壁纸
    """

    name = models.CharField(_l("壁纸名称"), max_length=40, blank=True, null=True)
    number = models.IntegerField(_l("壁纸编号"), default=0, help_text=_l("非0值，则必须保证唯一"))
    width = models.IntegerField(_l("壁纸宽度"), blank=True, null=True)
    height = models.IntegerField(_l("壁纸高度"), blank=True, null=True)
    is_default = models.BooleanField(_l("是否为默认壁纸"), default=False)

    def __unicode__(self):
        return self.name

    class Meta(object):
        db_table = "console_desktop_wallpaper"
        verbose_name = _l("壁纸管理")
        verbose_name_plural = _l("壁纸管理")


class UserSettings(models.Model):
    """
    用户桌面设置
    """

    APPXY_CHOICES = [("x", _l("横排列")), ("y", _l("竖排列"))]
    DOCKPOS_CHOICES = [("top", _l("上边")), ("left", _l("左边")), ("right", _l("右边"))]
    SKIN_CHOICES = [
        ("chrome", _l("Chrome皮肤")),
        ("default", _l("默认")),
        ("ext", _l("Ext皮肤")),
        ("mac", _l("Mac皮肤")),
        ("qq", _l("QQ皮肤")),
    ]
    WALLPAPER_TYPE_CHOICES = [
        ("tianchong", _l("填充")),
        ("shiying", _l("适应")),
        ("pingpu", _l("平铺")),
        ("lashen", _l("拉伸")),
        ("juzhong", _l("居中")),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, verbose_name=_l("用户"), unique=True)
    appxy = models.CharField(_l("APP图标排列方式"), choices=APPXY_CHOICES, max_length=10, default="y")
    dockpos = models.CharField(_l("应用码头位置"), choices=DOCKPOS_CHOICES, max_length=20, default="left")
    skin = models.CharField(_l("窗口皮肤"), choices=SKIN_CHOICES, max_length=20, default="mac")
    wallpaper_id = models.IntegerField(_l("壁纸ID"), default=1)
    wallpaper_type = models.CharField(_l("壁纸显示方式"), choices=WALLPAPER_TYPE_CHOICES, max_length=20, default="lashen")
    dock = models.TextField(_l("[应用码头]应用id"), default="", blank=True, null=True, help_text=_l("用“,”相连"))  # 应用拖动的时候需要用
    desk1 = models.TextField(_l("[桌面1]应用id"), default="", blank=True, null=True, help_text=_l("用“,”相连"))  # 应用拖动的时候需要用
    desk2 = models.TextField(_l("[桌面2]应用id"), default="", blank=True, null=True, help_text=_l("用“,”相连"))  # 应用拖动的时候需要用
    desk3 = models.TextField(_l("[桌面3]应用id"), default="", blank=True, null=True, help_text=_l("用“,”相连"))  # 应用拖动的时候需要用
    desk4 = models.TextField(_l("[桌面4]应用id"), default="", blank=True, null=True, help_text=_l("用“,”相连"))  # 应用拖动的时候需要用
    desk5 = models.TextField(_l("[桌面5]应用id"), default="", blank=True, null=True, help_text=_l("用“,”相连"))  # 应用拖动的时候需要用

    market_nav = models.IntegerField(_l("应用市场左侧导航类别"), choices=MARKET_NAV_CHOICES, default=MarketNavEnum.APPTAG)

    def __unicode__(self):
        return self.user.username

    class Meta(object):
        db_table = "console_desktop_usersettings"
        verbose_name = _l("用户桌面设置")
        verbose_name_plural = _l("用户桌面设置")


class UserApp(models.Model):
    """
    用户桌面应用、文件夹
    """

    DESK_APP_TYPE_CHOICES = [(0, _l("应用")), (1, _l("文件夹"))]
    APP_POSITION_CHOICES = [
        ("dock", _l("应用码头")),
        ("desk1", _l("桌面1")),
        ("desk2", _l("桌面2")),
        ("desk3", _l("桌面3")),
        ("desk4", _l("桌面4")),
        ("desk5", _l("桌面5")),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, verbose_name=_l("用户"))
    app = models.ForeignKey(App, verbose_name=_l("应用"), null=True, help_text=_l("文件夹则此字段为空"))
    add_time = models.DateTimeField(_l("添加时间"), auto_now_add=True, blank=True, null=True, help_text=_l("添加时间"))
    # 文件夹功能 字段
    desk_app_type = models.IntegerField(_l("桌面应用类型"), choices=DESK_APP_TYPE_CHOICES, default=0)
    folder_name = models.CharField(
        _l("文件夹名"), max_length=127, null=True, blank=True, help_text=_l("如果desk_app_type为0,则该字段不用填写;反之,则必填")
    )
    parent = models.ForeignKey("self", null=True, blank=True, verbose_name=_l("APP所在的文件夹"))
    # 应用相关
    app_position = models.CharField(_l("用户APP所在位置"), choices=APP_POSITION_CHOICES, max_length=20, default="desk1")

    def __unicode__(self):
        return "%s-%s" % (self.user, self.app)

    class Meta(object):
        db_table = "console_desktop_userapp"
        unique_together = ("user", "app")
        ordering = ["id"]
        verbose_name = _l("用户桌面应用")
        verbose_name_plural = _l("用户桌面应用")
