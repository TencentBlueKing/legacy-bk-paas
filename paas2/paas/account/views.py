# -*- coding: utf-8 -*-

from django.http import HttpResponseForbidden

from account.accounts import Account
from account.decorators import login_exempt
from common.mymako import render_mako_tostring_context


@login_exempt
def logout(request):
    account = Account()
    return account.logout(request)


def csrf_failure(request, reason=""):
    return HttpResponseForbidden(render_mako_tostring_context(request, "csrf_failure.html"), content_type="text/html")
