# -*- coding: utf-8 -*-
from enum import Enum
from django.conf import settings
from django.db import models
from django.utils import timezone
from django.utils.http import urlquote
from django.utils.translation import ugettext as _, ugettext_lazy as _l
from django.core.mail import send_mail
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager


# 用户角色
class RoleCodeEnum(Enum):
    # 普通用户
    STAFF = 0
    # 超级管理员
    SUPERUSER = 1
    # 开发者
    DEVELOPER = 2
    # OPERATOR = 3


class BkUserManager(BaseUserManager):
    """
    BK user manager
    """

    def _create_user(self, username, password, is_staff, is_superuser, **extra_fields):
        """
        Create and saves a User with the given username and password
        """
        if not username:
            raise ValueError(u"'The given username must be set")

        now = timezone.now()
        user = self.model(
            username=username,
            is_staff=is_staff,
            is_superuser=is_superuser,
            last_login=now,
            date_joined=now,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, username, password=None, **extra_fields):
        return self._create_user(username, password, False, False, **extra_fields)

    def create_superuser(self, username, password, **extra_fields):
        return self._create_user(username, password, True, True, **extra_fields)


class BkUser(AbstractBaseUser, PermissionsMixin):
    """
    BK user

    username and password are required. Other fields are optional.
    """

    username = models.CharField(_l(u"用户名"), max_length=128, unique=True)
    chname = models.CharField(_l(u"中文名"), max_length=254, blank=True)
    company = models.CharField(_l(u"公司"), max_length=128, blank=True)
    qq = models.CharField(_l(u"QQ号"), max_length=32, blank=True)
    phone = models.CharField(_l(u"手机号"), max_length=64, blank=True)
    email = models.EmailField(_l(u"邮箱"), max_length=254, blank=True)

    is_staff = models.BooleanField(_l(u"普通管理员"), default=False, help_text=_l(u"普通管理员可以登录到admin"))
    date_joined = models.DateTimeField(_l("date joined"), default=timezone.now)

    role = models.CharField(_l(u"用户角色"), max_length=32, default="0", help_text=_l(u"用户角色表示字符串"))

    objects = BkUserManager()

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = _("user")
        verbose_name_plural = _("users")

    def check_password(self, raw_password):
        """
        支持数据库明文存储密码
        """
        if raw_password == self.password:
            return True

        def setter(raw_password):
            self.set_password(raw_password)
            self.save(update_fields=["password"])

        from django.contrib.auth.hashers import check_password

        return check_password(raw_password, self.password, setter)

    def get_absolute_url(self):
        return "/users/%s/" % urlquote(self.email)

    def get_full_name(self):
        """
        Return the username plus the chinese name, with a space in between
        """
        full_name = "%s %s" % (self.username, self.chname)
        return full_name.strip()

    def get_short_name(self):
        """
        Return the chinese name for the user
        """
        return self.chname

    def email_user(self, subject, message, from_email=None):
        """
        Send an email to this User
        """
        send_mail(subject, message, from_email, [self.email])


class LoginLogManager(models.Manager):
    """
    User login log manager
    """

    def record_login(self, _user, _login_browser, _login_ip, host, app_id):
        try:
            self.model(
                user=_user,
                login_browser=_login_browser,
                login_ip=_login_ip,
                login_host=host,
                login_time=timezone.now(),
                app_id=app_id,
            ).save()
            return (True, u"记录成功")
        except Exception:
            return (False, u"用户登录记录失败")


class Loignlog(models.Model):
    """
    User login log
    """

    user = models.ForeignKey(settings.AUTH_USER_MODEL, verbose_name=_l(u"用户"))
    login_time = models.DateTimeField(_l(u"登录时间"))
    login_browser = models.CharField(_l(u"登录浏览器"), max_length=200, blank=True, null=True)
    login_ip = models.CharField(_l(u"用户登录ip"), max_length=50, blank=True, null=True)
    login_host = models.CharField(_l(u"登录HOST"), max_length=100, blank=True, null=True)
    app_id = models.CharField("APP_ID", max_length=30, blank=True, null=True)

    objects = LoginLogManager()

    def __unicode__(self):
        return "%s(%s)" % (self.user.chname, self.user.username)

    class Meta:
        verbose_name = _l(u"用户登录日志")
        verbose_name_plural = _l(u"用户登录日志")


class BkToken(models.Model):
    """
    登录票据
    """

    token = models.CharField(_l(u"登录票据"), max_length=255, unique=True, db_index=True)
    # 是否已经退出登录
    is_logout = models.BooleanField(_l(u"票据是否已经执行过退出登录操作"), default=False)

    def __uincode__(self):
        return self.token

    class Meta:
        verbose_name = _l(u"登录票据")
        verbose_name_plural = _l(u"登录票据")
