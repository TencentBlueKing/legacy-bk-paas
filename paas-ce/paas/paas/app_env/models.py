# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

from __future__ import unicode_literals

from django.db import models

from app_env.constants import ENV_MODE_TYPE_CHOICES
from app_env.manager import AppEnvVarManager


class AppEnvVar(models.Model):
    """应用的环境变量
    """
    app_code = models.CharField("对应的appcode", max_length=30, unique=False)

    mode = models.CharField("生效环境", choices=ENV_MODE_TYPE_CHOICES, default='all',
                            max_length=20, blank=False, null=False)
    name = models.CharField("变量名", max_length=50)
    value = models.CharField("变量值", max_length=1024)
    intro = models.TextField("变量介绍", blank=True, null=True)

    objects = AppEnvVarManager()

    def __unicode__(self):
        return 'ENV:{}:{}={}'.format(self.id, self.name, self.value)

    class Meta:
        db_table = 'paas_app_envvars'
        unique_together = ("app_code", "mode", 'name')
        verbose_name = "应用环境变量"
        verbose_name_plural = "应用环境变量"
