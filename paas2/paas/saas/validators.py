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

import yaml
import tarfile

from django.utils.translation import ugettext as _

from common.log import logger
from app.constants import LANGUAGE_VALID_VALUES, LanguageEnum
from saas.models import SaaSApp
from common.constants import SAAS_APP_CODE_CHECK_PATTERN


def validate_upload_file(file):
    if not file or not file.name:
        return False, _(u"上传文件失败!")

    if not file.name.endswith(".tar.gz"):
        return False, _(u"错误的文件! SaaS应用为.tar.gz格式")

    return True, "VALID"


def validate_app_config(saas_file_name, app_code, app_config):
    app_name = app_config.get("app_name")
    version = app_config.get("version")
    if not (app_code and app_name and version):
        message = ("upload file: %s, app.yml settings error: required" "[app_code=%s, app_name=%s, version=%s]") % (
            saas_file_name,
            app_code,
            app_name,
            version,
        )
        logger.info(message)
        return False, message

    # validate language
    language = app_config.get("language")
    if not language:
        message = ("upload file: %s, app.yml fields: language " "required and should not be empty") % saas_file_name
        logger.info(message)
        return False, message

    if language.lower() not in LANGUAGE_VALID_VALUES:
        message = ("upload file: %s, app.yml language must be one of %s, " "current value is %s") % (
            saas_file_name,
            LANGUAGE_VALID_VALUES,
            language,
        )
        logger.info(message)
        return False, message

    return True, "success"


def validate_upload_page(app_code, saas_app_code):
    # 校验app_code
    if app_code == "0":
        app_code = saas_app_code

        # NOTE: 从上传新应用入口进来的, 判定下是否上传的老的包
        if SaaSApp.objects.is_already_exist(app_code):
            message = (
                "Upload package application:%s. The application already exists, "
                "so only new apps can be deployed via this access "
            ) % app_code
            logger.info(message)

            message = _(u"上传包应用: %s. 应用已存在, 非新应用无法从此入口部署. 请从S-mart应用列表找到该应用, 进入部署页面部署") % app_code
            return False, message
    else:
        if app_code != saas_app_code:
            message = (
                "The current application:%s, upload package application:%s. "
                "They are not the same application, so deployment cannot be achieved"
                "Please upload the deployment as a new application or find the deployment page of "
                "the application %s to upload deployment"
            ) % (app_code, saas_app_code, saas_app_code)
            logger.info(message)
            message = _(u"当前应用: %s, 上传包应用: %s. 不是同一个应用, 无法部署. 请作为新应用上传部署或找到应用%s的部署页面上传部署") % (
                app_code,
                saas_app_code,
                saas_app_code,
            )
            return False, message
    return True, "VALID"


def validate_and_extract_tar_file(filename, path):
    """
    校验tar.gz文件, 并解压获取app.yml
    """
    # check if a tar file
    try:
        tar_file = tarfile.open(path)
        tar_file_members = tar_file.getmembers()
    except Exception:
        message = u"file %s format error, can't be opened, please check again then re-upload" % filename
        logger.exception(message)
        message = _(u"%s 文件格式错误, 无法正常打开, 请确认后重新上传") % filename
        return False, message, None

    app_yml_path_list = [m.name for m in tar_file_members if m.name.endswith("app.yml") and len(m.name.split("/")) == 2]
    if not app_yml_path_list:
        message = u"There is no app.yml in %s" % filename
        logger.error(message)
        message = _(u"%s 包中缺少配置文件 app.yml") % filename
        return False, message, None

    app_yml_path = app_yml_path_list[0]
    try:
        app_yml_file = tar_file.extractfile(app_yml_path)
        app_yml_content = app_yml_file.read()
    except Exception:
        message = u"extract %s to get app.yml fail" % filename
        logger.exception(message)
        message = _(u"%s 解压获取 app.yml 失败") % filename
        return False, message, None

    try:
        tar_file.close()
    except Exception:
        logger.exception("tar file close fail")
    # FIXME: if the app.yml end without any line breaker, the load will fail

    try:
        app_config = yaml.load(app_yml_content)
    except Exception:
        # 无法正确加载%s包中的yml文件
        message = u"The yml file in the %s package cannot be loaded properly" % filename
        logger.exception(message)

        message = _(u"无法正确加载%s包中的yml文件") % filename
        return False, message, None

    language = app_config.get("language")
    if language and language.lower() == LanguageEnum.JAVA:
        jar_or_war_files = [m.name for m in tar_file_members if m.name.endswith(".war") or m.name.endswith(".war")]
        if len(jar_or_war_files) == 0:
            message = u"The language field in app.yml is java, but there got no .war or .jar files in the package"
            logger.error(message)
            return False, message, None

    return True, _(u"处理成功"), app_config


def validate_saas_app_code(app_code):
    if SAAS_APP_CODE_CHECK_PATTERN.match(app_code):
        return True, u""
    return False, u"只允许小写字母,下划线,连字符"
