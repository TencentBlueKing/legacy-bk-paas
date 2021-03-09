# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

from bkauth.decorators import login_exempt


class CsrfExemptMixin(object):
    """
    Mixin allows you to request without `csrftoken`.
    """

    @method_decorator(csrf_exempt)
    def dispatch(self, *args, **kwargs):
        return super(CsrfExemptMixin, self).dispatch(*args, **kwargs)


class LoginExemptMixin(object):
    """
    Mixin allows you to request without `login`.
    """

    @method_decorator(login_exempt)
    def dispatch(self, *args, **kwargs):
        return super(LoginExemptMixin, self).dispatch(*args, **kwargs)


class CsrfAndLoginExemptMixin(object):
    """
    Mixin allows you to request without `login` and `csrftoken`.
    """

    @method_decorator(csrf_exempt)
    @method_decorator(login_exempt)
    def dispatch(self, *args, **kwargs):
        return super(CsrfAndLoginExemptMixin, self).dispatch(*args, **kwargs)
