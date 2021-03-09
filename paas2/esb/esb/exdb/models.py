# -*- coding: utf-8 -*-
from django.db import models


class App(models.Model):
    """
    应用基本信息表
    """

    name = models.CharField("name", max_length=20, unique=True)
    code = models.CharField("code", max_length=30, unique=True)
    auth_token = models.CharField("Token", max_length=36, blank=True, null=True)

    def __unicode__(self):
        return "%s(%s)" % (self.code, self.name)

    def __str__(self):
        return self.name

    class Meta:
        db_table = "paas_app"
