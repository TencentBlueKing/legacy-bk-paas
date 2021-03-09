# -*- coding: utf-8 -*-

from django.contrib.auth.models import BaseUserManager
from django.utils import timezone


class BkUserManager(BaseUserManager):
    """BK user manager"""

    def create_user(self, username, password=None):
        """
        Create and saves a User with the given username and password
        """
        if not username:
            raise ValueError("'The given username must be set")

        now = timezone.now()
        user = self.model(username=username, last_login=now)
        user.set_password(password)
        user.save(using=self._db)

        return user
