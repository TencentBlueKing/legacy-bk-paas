# -*- coding: utf-8 -*-
from django.utils.translation import ugettext as _


# 此配置用于在 migrations 中向 DB 同步数据，此方案已不推荐，不要通过更新此配置同步数据
# 目前，同步数据采用在 esb 项目中开发 django command 的方案
FUNCTION_CONTROLLERS = [
    {
        "func_code": "user_auth::skip_user_auth",
        "func_name": _(u"是否跳过用户身份验证"),
        "wlist": "bk_paas_log_alert",
    }
]


DEFAULT_DOC_CATEGORY = _(u"默认分类")
