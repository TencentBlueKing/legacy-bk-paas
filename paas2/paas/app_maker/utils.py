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
from __future__ import print_function

from builtins import str
from builtins import range
import random
import base64
import uuid

from django.core.files.base import ContentFile
from django.utils.translation import ugettext as _
from django.contrib.auth import get_user_model

from app_maker.constants import APP_MAKER_CODE_CONNECTOR
from app_maker.validators import validate_app_code


def _salt(length=2):
    """
    生成长度为length 的随机字符串
    """
    ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz"  # noqa
    return "".join([random.choice(ALPHABET) for _ in range(length)])


def generate_app_maker_code(parent_code):
    """
    生成轻应用 ID
    """
    # 计算app随机数长度，长度需要大于或等于2，保证后续创建的轻应用可以足够多（至少36*36）
    slat_len = 15 - len(parent_code)
    if slat_len < 2:
        return False, "", _(u"应用ID(%s)长度大于13，无法创建轻应用") % parent_code

    app_maker_code = ""
    # 验证appcode，防止死循环
    cnt = 0
    while cnt < 10:
        app_maker_code = "%s%s%s" % (parent_code, APP_MAKER_CODE_CONNECTOR, _salt(slat_len))
        print(app_maker_code)
        is_app_code_valid, app_code_msg = validate_app_code(app_maker_code)
        if is_app_code_valid:
            break
        cnt += 1
    if cnt >= 10 or app_maker_code == "":
        return False, "", _(u"应用ID创建重复，请重试")
    return True, app_maker_code, ""


def generate_file_by_base64(value):
    image_data = base64.b64decode(value)
    image_name = "".join(["data:image/png;base64,", str(uuid.uuid4()), ".png"])
    return ContentFile(image_data, image_name)


def save_developers(app, developers):
    developer_list = developers.split(";") if developers else []
    user_model = get_user_model()
    errors_msg_list = []
    if developer_list:
        app.developer.clear()
        for dev in developer_list:
            try:
                d_user, _c = user_model.objects.get_or_create(username=dev)
                app.developer.add(d_user)
            except Exception as e:
                # 获取用户[username:%s]异常:%s
                errors_msg_list.append(u"get user[username:%s] fail:%s" % (dev, e))
    if developer_list and errors_msg_list:
        return False, ";".join(errors_msg_list)
    else:
        return True, u""
