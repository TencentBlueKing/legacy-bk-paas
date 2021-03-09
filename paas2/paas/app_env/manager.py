# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS
Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License.
You may obtain a copy of the License at http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
specific language governing permissions and limitations under the License.
"""


from django.db import models


class AppEnvVarManager(models.Manager):
    def get_env_vars(self, app_code, mode):
        modes = [mode, "all"]
        env_vars = self.filter(app_code=app_code).filter(mode__in=modes).all()
        if not env_vars:
            return {}
        return {env_var.name: env_var.value for env_var in env_vars}
