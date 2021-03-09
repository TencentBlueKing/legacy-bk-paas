# -*- coding: utf-8 -*-
from functools import wraps

from django.utils.translation import ugettext as _
from django.http import JsonResponse
from django.utils.decorators import available_attrs

from user_center.wx_utils import get_user_wx_info


def is_unbound_weixin(view_func):
    """
    检查是否未绑定
    """

    @wraps(view_func, assigned=available_attrs(view_func))
    def _wrapped_view(request, *args, **kwargs):
        wx_type, wx_userid = get_user_wx_info(request)
        if not wx_type:
            return JsonResponse({"result": False, "message": _(u"系统管理员未启用微信通知组件")})
        if wx_userid:
            return JsonResponse({"result": False, "message": _(u"您已绑定微信，无需再绑定")})
        return view_func(request, *args, **kwargs)

    return _wrapped_view
