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

import os
import shutil
import tempfile
import tarfile
from contextlib import contextmanager

from common.log import logger


def push_template_to_file_storage(templater_class, context, filename, app_code):
    """
    推送APP模板代码到文件存储中
    """
    project_path = None
    try:
        project_path = templater_class(**context).create_project()
        # 打包项目代码
        generate_tarfile(filename, project_path, app_code)
        return True, ""
    except Exception as error:
        logger.exception("push_template_to_file_storage error: %s" % error)
        result = (False, u"init app code error")
    finally:
        if project_path and os.path.exists(project_path):
            # Clean up temp directory
            shutil.rmtree(project_path)
    return result


@contextmanager
def generate_temp_path():
    try:
        path = tempfile.mkdtemp()
        logger.debug("Generating temp path: %s", path)
        yield path
    finally:
        if os.path.exists(path):
            shutil.rmtree(path)


@contextmanager
def open_tarfile(tarfile_path):
    try:
        tar = tarfile.open(tarfile_path)
        logger.debug("Open tarfile: %s" % tarfile_path)
        yield tar
    finally:
        tar.close()


def generate_tarfile(output_filename, source_dir, arcname):
    with tarfile.open(output_filename, "w:gz") as tar:
        tar.add(source_dir, arcname=arcname)
