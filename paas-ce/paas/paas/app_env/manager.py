# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

from django.db import models

from common.constants import ModeEnum
from common.log import logger
from app_env.utils import validate_env_var


class AppEnvVarManager(models.Manager):
    def get_env_vars(self, app_code, mode):
        modes = [mode, ModeEnum.ALL.value]
        env_vars = self.filter(app_code=app_code)\
                       .filter(mode__in=modes)\
                       .all()
        if not env_vars:
            return {}
        return {env_var.name: env_var.value for env_var in env_vars}

    def add_env_vars(self, app_code, env_var_list):
        """
        for ModeEnum.All.value only
        env_var_list = [{key: hello, value: world}]
        """
        if not env_var_list:
            return

        for env in env_var_list:
            key = env.get("key")
            value = env.get("value")
            if not (key and value):
                continue

            is_valid, message = validate_env_var(key, value)
            if not is_valid:
                logger.error("App: %s [key=%s, value=%s] invalid, %s", app_code, key, value, message)
                continue

            self._add_or_update_env_var_mode_all(app_code, key, value)

    def _add_or_update_env_var_mode_all(self, app_code, name, value):
        if self.filter(app_code=app_code, mode=ModeEnum.ALL, name=name).exists():
            env_var = self.get(app_code=app_code, mode=ModeEnum.ALL, name=name)
            env_var.value = value
            env_var.save()
        else:
            self.filter(app_code=app_code, mode__in=(ModeEnum.PROD, ModeEnum.TEST), name=name).delete()
            env_var = self.create(app_code=app_code, mode=ModeEnum.ALL, name=name,
                                  value=value, intro="set by S-mart App")

    def _gen_extra_modes(self, mode):
        extra_modes = ([mode, ModeEnum.ALL.value] if mode in (ModeEnum.TEST.value, ModeEnum.PROD.value)
                       else [ModeEnum.ALL.value, ModeEnum.TEST.value, ModeEnum.PROD.value])
        return extra_modes

    def exists(self, app_code, mode, name):
        extra_modes = self._gen_extra_modes(mode)
        return self.filter(app_code=app_code, mode__in=extra_modes, name=name).exists()

    def update_target_exists(self, app_code, mode, name, var_id):
        extra_modes = self._gen_extra_modes(mode)
        return self.filter(app_code=app_code, mode__in=extra_modes, name=name)\
            .exclude(id=var_id)\
            .exists()

    def update(self, var_id, name, value, intro, mode):
        env_var = self.get(id=var_id)
        env_var.name = name
        env_var.value = value
        env_var.intro = intro
        env_var.mode = mode
        env_var.save()
