# -*- coding: utf-8 -*-

import hashlib
from common.log import logger


def file_size_bytes_to_m(size):
    if not size:
        logger.exception(u"文件大小转换出错")
        return None

    file_size = None
    try:
        file_size = round(size / 1024 / 1024.0, 2)
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
