# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

初始化默认应用信息

利用migration的原理来初始化并维护默认应用信息，保证以下三个规则：
1. 每个应用生成一个migration文件，如：0002_framework.py,0003_iwork.py
2. 每个migration文件维护当前应用的最新版本号，保证新安装PaaS的用户都是安装最新版本的应用包，老的用户的应用版本保持不变
   如 0002_PaaS V2.0.0.py文件中：
   PaaS V1.0.0 中 app 的 version为 1.0.0
   PaaS V2.0.0 中 app 的 version为 2.0.0
3. 每个发布的PaaS包中需要包含默认应用的所有版本，如 PaaS V2.0.0 需包含：framework_v1.0.0 和 framework_v2.0.0

即:
- 每个应用更新, 需增加版本号, 发布包中会保留其所有历史版本

""" # noqa

from __future__ import unicode_literals

from common.constants import LogoImgRelatedDirEnum
from common.log import logger
from saas.models import SaaSApp, SaaSUploadFile
from saas.utils import save_saas_app_info


def init_saas_app_db_info(app_code, config_info, file_info):
    """
    初始化SaaS应用的 db 信息
    """

    # 保存安装文件信息
    try:
        saas_upload_file = SaaSUploadFile.objects.create(
            name=file_info.get('name'),
            size=file_info.get('size'),
            md5=file_info.get('md5'),
            file=file_info.get('file'),
        )
    except Exception:
        message = "初始化应用[{}]出错，保存应用版本信息出错".format(app_code)
        logger.exception(message)
        return False, message

    try:
        save_saas_app_info(config_info, saas_upload_file)
        # 保存应用 logo
        logo = '{}/{}.png'.format(LogoImgRelatedDirEnum.APP.value, app_code)
        SaaSApp.objects.update_logo(app_code, logo)
    except Exception:
        message = "初始化应用[{}]出错".format(app_code)
        logger.exception(message)
        return False, message

    message = "初始化应用[{}]成功".format(app_code)
    logger.info(message)
    return True, message
