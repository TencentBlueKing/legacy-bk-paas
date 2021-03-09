# -*- coding: utf-8 -*-
import os
import random
import string

from django.conf import settings
from django.utils.translation import ugettext as _

from common.log import logger
from common.constants import APP_INIT_PROJECT_FILES
from account.models import BkUser
from app.constants import LanguageEnum
from sourcectl.constants import SourceInitTemplateEnum
from sourcectl.templaters import AppDjangoTemplater, AppSpringBootTemplater
from sourcectl.utils import push_template_to_file_storage


class AppInitializeCodeError(Exception):
    pass


class AppInitializer(object):
    """
    Initializer for new app initialize
    """

    template_config_dict = {
        SourceInitTemplateEnum.DJANGO_APP_FRAMEWORK: {
            "templater": AppDjangoTemplater,
            "need_dev_host_port_context": False,
        },
        SourceInitTemplateEnum.SPRING_BOOT_APP_FRAMEWORK: {
            "templater": AppSpringBootTemplater,
            "need_dev_host_port_context": True,
        },
    }

    def __init__(self, app, secure_info):
        self.app = app
        self.secure_info = secure_info
        self.user = BkUser.objects.get(username=app.creater)
        # 根据不同语言获取初始化应用代码模板类型
        source_init_template = SourceInitTemplateEnum.DJANGO_APP_FRAMEWORK
        if app.language == LanguageEnum.JAVA:
            source_init_template = SourceInitTemplateEnum.SPRING_BOOT_APP_FRAMEWORK
        # 选择对应初始化开发框架的模板配置
        self.template_config = self.template_config_dict[source_init_template]

    def generate_filename_with_path(self):
        """
        生成开发框架存储的文件地址: {app_code}_{random_str}_{time}.tar.gz
        """
        random_str = "".join(map(lambda _: random.choice(string.lowercase), range(10)))
        create_time = self.app.created_date.strftime("%Y%m%d%H%M%S")
        filtname = "{}_{}_{}.tar.gz".format(self.app.code, random_str, create_time)
        return os.path.join(settings.MEDIA_ROOT, APP_INIT_PROJECT_FILES, filtname)

    def initialize_with_template(self):
        """
        初始化应用代码
        """
        context = {
            "app_code": self.app.code,
            "app_secret": self.app.auth_token,
            "bk_paas_host": "%s://%s" % (settings.HTTP_SCHEMA, settings.PAAS_DOMAIN),
        }
        if self.template_config["need_dev_host_port_context"]:
            context.update(
                {
                    "app_dev_server_host_port": "http://appdev.%s:8080" % settings.PAAS_DOMAIN.split(":")[0],
                }
            )

        try:
            source_init_result = push_template_to_file_storage(
                self.template_config["templater"],
                context,
                self.generate_filename_with_path(),
                self.app.code,
            )
        except Exception as error:
            logger.error(u"nitialize the application code failed, Error message: %s" % error)
            source_init_result = (False, _(u"初始化应用代码异常，请求联系管理员处理！"))
        return source_init_result
