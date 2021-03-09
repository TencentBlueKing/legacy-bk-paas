# -*- coding: utf-8 -*-

from django.db import models

from app_env.constants import ENV_MODE_TYPE_CHOICES
from app_env.manager import AppEnvVarManager


class AppEnvVar(models.Model):
    """
    应用的环境变量
    """

    app_code = models.CharField(u"对应的appcode", max_length=30, unique=False)

    mode = models.CharField(
        u"生效环境", choices=ENV_MODE_TYPE_CHOICES, default="all", max_length=20, blank=False, null=False
    )
    name = models.CharField("变量名", max_length=50)
    value = models.CharField(u"变量值", max_length=1024)
    intro = models.TextField(u"变量介绍", blank=True, null=True)

    objects = AppEnvVarManager()

    def __unicode__(self):
        return "ENV:%s=%s" % (self.name, self.value)

    class Meta:
        db_table = "paas_app_envvars"
        unique_together = ("app_code", "mode", "name")
        verbose_name = u"应用环境变量"
        verbose_name_plural = u"应用环境变量"
