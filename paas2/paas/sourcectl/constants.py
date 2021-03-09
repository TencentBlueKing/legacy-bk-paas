# -*- coding: utf-8 -*-
from common.constants import enum


# 应用代码初始化模板
SourceInitTemplateEnum = enum(
    DJANGO_APP_FRAMEWORK="django_app_framework",  # django应用开发框架
    DJANGO_APP_FRAMEWORK_WITH_SAMPLE="django_app_framework_with_sample",  # django应用开发样例
    SPRING_BOOT_APP_FRAMEWORK="spring_boot_app_framework",  # spring-boot应用开发框架
    SPRING_BOOT_APP_FRAMEWORK_WITH_SAMPLE="spring_boot_app_framework_with_sample",  # spring-boot应用开发样例
)
