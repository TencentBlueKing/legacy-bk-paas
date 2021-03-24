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


from __future__ import unicode_literals

from builtins import str
from builtins import object
from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.utils.encoding import python_2_unicode_compatible
from django.conf import settings

from oauth2_provider.validators import validate_uris
from oauth2_provider.compat import parse_qsl, reverse, urlparse

from app.models import App

# NOTE 结论:
# 1. 只支持 saas/外链应用/smart应用 这三类在开发者中心存在的实体应用接入oauth2, 不支持后台应用(加白授权的不存在于开发者中心的应用)
# 2. 如何注册 redirect_uris, 空格分隔的字符串?


class ApplicationManager(models.Manager):
    def get(self, client_id):
        application = self.filter(app__code=client_id).first()
        if not application:
            raise Exception("client_id invalid")
        return application


@python_2_unicode_compatible
class Application(models.Model):
    """
    An Application instance represents a Client on the Authorization server.
    Usually an Application is created manually by client's developers after
    logging in on an Authorization Server.

    Fields:

    * :attr:`client_id` The client identifier issued to the client during the
                        registration process as described in :rfc:`2.2`
    * :attr:`user` ref to a Django user
    * :attr:`redirect_uris` The list of allowed redirect uri. The string
                            consists of valid URLs separated by space
    * :attr:`client_type` Client type as described in :rfc:`2.1`
    * :attr:`authorization_grant_type` Authorization flows available to the
                                       Application
    * :attr:`client_secret` Confidential secret issued to the client during
                            the registration process as described in :rfc:`2.2`
    * :attr:`name` Friendly name for the Application
    """

    CLIENT_CONFIDENTIAL = "confidential"
    CLIENT_PUBLIC = "public"
    CLIENT_TYPES = (
        (CLIENT_CONFIDENTIAL, _("Confidential")),
        (CLIENT_PUBLIC, _("Public")),
    )

    GRANT_AUTHORIZATION_CODE = "authorization-code"
    GRANT_IMPLICIT = "implicit"
    GRANT_PASSWORD = "password"
    GRANT_CLIENT_CREDENTIALS = "client-credentials"
    GRANT_TYPES = (
        (GRANT_AUTHORIZATION_CODE, _("Authorization code")),
        (GRANT_IMPLICIT, _("Implicit")),
        (GRANT_PASSWORD, _("Resource owner password-based")),
        (GRANT_CLIENT_CREDENTIALS, _("Client credentials")),
    )

    # client_id = models.CharField(max_length=100, unique=True,
    #                              default=generate_client_id, db_index=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="%(app_label)s_%(class)s",
        null=True,
        blank=True,
        on_delete=models.CASCADE,
    )
    # user = ForeignKey(User, on_delete=CASCADE)
    # app = models.ForeignKey(App, unique=True)
    app = models.ForeignKey(App)

    help_text = _("Allowed URIs list, space separated")
    redirect_uris = models.TextField(help_text=help_text, validators=[validate_uris], blank=True)
    client_type = models.CharField(max_length=32, choices=CLIENT_TYPES)
    authorization_grant_type = models.CharField(max_length=32, choices=GRANT_TYPES)
    # client_secret = models.CharField(max_length=255, blank=True,
    #                                  default=generate_client_secret, db_index=True)
    name = models.CharField(max_length=255, blank=True)
    skip_authorization = models.BooleanField(default=False)

    objects = ApplicationManager()

    class Meta(object):
        db_table = "login_bk_oauth2_application"

    @property
    def client_id(self):
        return self.app.code

    @property
    def client_secret(self):
        return self.app.auth_token

    @property
    def default_redirect_uri(self):
        """
        Returns the default redirect_uri extracting the first item from
        the :attr:`redirect_uris` string
        """
        if self.redirect_uris:
            return self.redirect_uris.split().pop(0)

        assert False, (
            "If you are using implicit, authorization_code"
            "or all-in-one grant_type, you must define "
            "redirect_uris field in your Application model"
        )

    def redirect_uri_allowed(self, uri):
        """
        Checks if given url is one of the items in :attr:`redirect_uris` string

        :param uri: Url to check
        """
        for allowed_uri in self.redirect_uris.split():
            parsed_allowed_uri = urlparse(allowed_uri)
            parsed_uri = urlparse(uri)

            if (
                parsed_allowed_uri.scheme == parsed_uri.scheme
                and parsed_allowed_uri.netloc == parsed_uri.netloc
                and parsed_allowed_uri.path == parsed_uri.path
            ):

                aqs_set = set(parse_qsl(parsed_allowed_uri.query))
                uqs_set = set(parse_qsl(parsed_uri.query))

                if aqs_set.issubset(uqs_set):
                    return True

        return False

    def clean(self):
        from django.core.exceptions import ValidationError

        if not self.redirect_uris and self.authorization_grant_type in (
            Application.GRANT_AUTHORIZATION_CODE,
            Application.GRANT_IMPLICIT,
        ):
            error = _("Redirect_uris could not be empty with {0} grant_type")
            raise ValidationError(error.format(self.authorization_grant_type))

    def get_absolute_url(self):
        return reverse("oauth2_provider:detail", args=[str(self.id)])

    def __str__(self):
        return self.name or self.client_id

    def allows_grant_type(self, *grant_types):
        return self.authorization_grant_type in grant_types

    def is_usable(self, request):
        """
        Determines whether the application can be used.

        :param request: The HTTP request being processed.
        """
        return True
