# -*- coding: utf-8 -*-
from django.db import models
from django.utils.translation import ugettext_lazy as _


class ApiWhiteList(models.Model):
    """
    api 的白名单
    """

    API_NAME_CHOICES = [("app_maker", _(u"轻应用相关接口"))]

    api_name = models.CharField(_(u"接口类别"), max_length=20, choices=API_NAME_CHOICES)
    app_code = models.CharField(_(u"可调用接口的应用编码"), max_length=20)

    def __unicode__(self):
        return "%s(%s)" % (self.api_name, self.app_code)

    def __str__(self):
        return self.api_name

    class Meta:
        db_table = "paas_apiwhitelist"
        verbose_name = _(u"PaaS提供的接口白名单")
        verbose_name_plural = _(u"PaaS提供的接口白名单")
