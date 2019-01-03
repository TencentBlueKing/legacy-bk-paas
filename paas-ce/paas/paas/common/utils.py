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
import hashlib

from django.conf import settings

from common.constants import LogoImgRelatedDirEnum
from common.log import logger


def file_size_bytes_to_m(file_size):
    if not file_size:
        return file_size

    try:
        return round(file_size / 1024 / 1024.0, 2)
    except TypeError:
        logger.exception("文件大小转换出错")
    return file_size

######################################
#  app and saas logo file operation  #
######################################


def should_update_logo(app_code, app_logo_name):
    # 修改图片名称
    logo_ext = '.png'
    # 判断logo名称
    if app_logo_name.find('\\') >= 0:
        logo_name = LogoImgRelatedDirEnum.APP.value + '\\' + str(app_code) + logo_ext
    else:
        logo_name = LogoImgRelatedDirEnum.APP.value + '/' + str(app_code) + logo_ext

    # 判断图片路径与旧图路径名称是否相同
    # if cmp(logo_name, app_logo_name):
    if logo_name != app_logo_name:
        # logo_name = LogoImgRelatedDirEnum.APP.value + '/' + str(app_code) + logo_ext
        _delete_exist_logo_file(logo_name)
        # 指定图片名称
        # self.logo.name = LogoImgRelatedDirEnum.APP.value + '/' + str(app_code) + logo_ext
        return True, logo_name
    return False, None


def _delete_exist_logo_file(name):
    _file = os.path.join(settings.MEDIA_ROOT, name)
    if os.path.exists(_file):
        os.remove(_file)


def get_app_logo(app_code):
    # 判断 以 app_code 命名的 logo 图片是否存在
    logo_name = '{}/{}.png'.format(LogoImgRelatedDirEnum.APP.value, app_code)
    logo_path = os.path.join(settings.MEDIA_ROOT, logo_name)
    if os.path.exists(logo_path):
        return '{}{}'.format(settings.MEDIA_URL, logo_name)

    # 判断是否是上传saas解压生成的文件, 存在的话使用之(saas内置应用上传包中带的logo)
    logo_name = '{}/{}.png'.format(LogoImgRelatedDirEnum.SAAS.value, app_code)
    logo_path = os.path.join(settings.MEDIA_ROOT, logo_name)
    if os.path.exists(logo_path):
        return '{}{}'.format(settings.MEDIA_URL, logo_name)

    return ""


def setup_view(view, request, *args, **kwargs):
    """
    for unittest
    Mimic ``as_view()``, but returns view instance.
    Use this function to get view instances on which you can run unit tests,
    by testing specific methods.
    """

    view.request = request
    view.args = args
    view.kwargs = kwargs
    return view


def first_error_message(form):
    error_data = form.errors.as_data()
    field = error_data.items()[0][0]
    error_message = error_data.items()[0][1][0].message
    message = "{}: {}".format(field, error_message)

    return message


def md5_for_file(chunks):
    """
    计算文件的md5
    """
    md5 = hashlib.md5()
    for data in chunks:
        md5.update(data)
    return md5.hexdigest()
