# -*- coding: utf-8 -*-
import os
import tempfile
from distutils.dir_util import copy_tree

from django.conf import settings

from sourcectl.utils import open_tarfile, generate_temp_path


class BaseTemplater(object):
    TEMPLATE_PATH = "/tmp/"

    def generate_framework(self):
        """uncompress framework"""
        local_path = tempfile.mkdtemp()
        with generate_temp_path() as working_path:
            with open_tarfile(self.TEMPLATE_PATH) as tar:
                tar.extractall(path=working_path)
            framework_path = os.path.join(working_path, os.listdir(working_path)[0])
            copy_tree(framework_path, local_path)
        return local_path

    def handle(self, framework_path, init_info):
        """generate app code"""
        for file_relative_path, modify_content in init_info.iteritems():
            file_path = os.path.join(framework_path, file_relative_path)
            with open(file_path, "r") as sources:
                lines = sources.readlines()
            with open(file_path, "w") as sources:
                # rewrite each line by find init_info
                for line in lines:
                    current_line = ""
                    for modify_key, replace_value in modify_content.iteritems():
                        if line.find(modify_key) >= 0:
                            current_line = line.replace(modify_key, replace_value)
                    current_line = line if current_line == "" else current_line
                    sources.write(current_line)

    def create_project(self):
        """
        Initialize codes  with blueking base func
        """
        # generate init info

        local_path = self.generate_framework()
        self.handle(local_path, self.modify_info)
        return local_path


class AppDjangoTemplater(BaseTemplater):
    TEMPLATE_PATH = os.path.join(settings.DOWNLOAD_ROOT, "framework_py.tar.gz")

    def __init__(self, app_code, app_secret, bk_paas_host):
        self.app_code = app_code
        self.app_secret = app_secret
        self.bk_paas_host = bk_paas_host
        self.modify_info = {
            "config/__init__.py": {
                "APP_CODE = ''": "APP_CODE = '%s'" % self.app_code,
                "SECRET_KEY = ''": "SECRET_KEY = '%s'" % self.app_secret,
                "BK_URL = None": "BK_URL = '%s'" % self.bk_paas_host,
            }
        }


class AppSpringBootTemplater(BaseTemplater):
    TEMPLATE_PATH = os.path.join(settings.DOWNLOAD_ROOT, "framework_java.tar.gz")

    def __init__(self, app_code, app_secret, bk_paas_host, app_dev_server_host_port):
        self.app_code = app_code
        self.app_secret = app_secret
        self.bk_paas_host = bk_paas_host
        self.app_dev_server_host_port = app_dev_server_host_port
        self.modify_info = {
            "webproject/src/main/resources/application-development.properties": {
                "app.id=${APP_ID}": "app.id=%s" % self.app_code,
                "app.token=${APP_TOKEN}": "app.token=%s" % self.app_secret,
                "bk.paas.host=http://paas-dev.blueking.com": "bk.paas.host=%s" % self.bk_paas_host,
                "app.server.host=http://bkjavadev.blueking.com/": (
                    "app.server.host=%s" % self.app_dev_server_host_port
                ),
            },
            "webproject/pom.xml": {"<pkg.app.id>bkjava</pkg.app.id>": "<pkg.app.id>%s</pkg.app.id>" % self.app_code},
        }
