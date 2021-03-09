# -*- coding: utf-8 -*-
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
