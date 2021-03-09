# -*- coding: utf-8 -*-
from django.utils.translation import ugettext as _

from api.signature import Sign
from app.models import App
from api.models import ApiWhiteList


class AppMakerSign(Sign):
    """
    App maker的 api签名与认证
    """

    def _clean_app_code(self):
        app_code = self.request.GET.get("app_code")
        if not app_code:
            raise ValueError(_(u"app_code不存在"))
        # 校验白名单
        if not ApiWhiteList.objects.filter(api_name="app_maker", app_code=app_code).exists():
            raise ValueError(_(u"app[%s]不在白名单内，不可调用app_maker相关接口") % app_code)
        try:
            app = App.objects.get(code=app_code)
        except App.DoesNotExist:
            raise ValueError(_(u"app[%s]不存在") % app_code)
        return app
