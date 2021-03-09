# -*- coding: utf-8 -*-

from django.db import models


class AppEnvVarManager(models.Manager):
    def get_env_vars(self, app_code, mode):
        modes = [mode, "all"]
        env_vars = self.filter(app_code=app_code).filter(mode__in=modes).all()
        if not env_vars:
            return {}
        return {env_var.name: env_var.value for env_var in env_vars}
