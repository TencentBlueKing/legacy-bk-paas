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
from __future__ import division


from past.utils import old_div
import hashlib
from common.log import logger


def file_size_bytes_to_m(size):
    if not size:
        logger.exception(u"文件大小转换出错")
        return None

    file_size = None
    try:
        file_size = round(old_div(size, 1024 / 1024.0), 2)
    except TypeError:
        logger.exception(u"文件大小转换出错")
    return file_size


def md5_for_file(chunks):
    """
    计算文件的md5
    """
    md5 = hashlib.md5()
    for data in chunks:
        md5.update(data)
    return md5.hexdigest()
