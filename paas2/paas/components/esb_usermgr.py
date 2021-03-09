# -*- coding: utf-8 -*-
from django.conf import settings

from components.http import http_get


BK_PAAS_HOST = "%s://%s" % ("http", settings.PAAS_INNER_DOMAIN)
APP_CODE = settings.PAAS_APP_ID
# # SECRET_KEY from settings_*.py, production is __ESB_TOKEN__
APP_SECRET = settings.ESB_TOKEN


def _call_esb_api(http_func, path, data, bk_token, bk_username, timeout=None):
    headers = {}
    data.update(
        {
            "bk_app_code": APP_CODE,
            "bk_app_secret": APP_SECRET,
            "bk_token": bk_token,
            "bk_username": bk_username,
        }
    )
    url = "{host}{path}".format(host=BK_PAAS_HOST, path=path)

    ok, _data = http_func(url, data, headers=headers, timeout=timeout)

    if not ok:
        return False, "_call_esb_api fail", None

    if _data.get("code") != 0:
        return False, _data.get("message", "esb api fail"), None

    _d = _data.get("data")

    return True, "ok", _d


def fetch_user_names(user_ids):
    path = "/api/c/compapi/v2/usermanage/list_users/"
    params = {
        "no_page": True,
        "lookup_field": "id",
        "exact_lookups": ",".join([str(i) for i in user_ids]),
        "fields": "id,username",
    }
    ok, message, data = _call_esb_api(http_get, path, params, bk_token=None, bk_username="paas")
    if not ok:
        return False, None

    user_names = {str(i["id"]): i["username"] for i in data}
    return True, user_names


def fetch_department_names(department_ids):
    path = "/api/c/compapi/v2/usermanage/list_departments/"
    params = {
        "no_page": True,
        "lookup_field": "id",
        "exact_lookups": ",".join([str(i) for i in department_ids]),
        "fields": "id,name",
    }
    ok, message, data = _call_esb_api(http_get, path, params, bk_token=None, bk_username="paas")
    if not ok:
        return False, None

    department_names = {str(i["id"]): i["name"] for i in data}
    return True, department_names


if __name__ == "__main__":
    a = fetch_user_names([1, 42422])
    print(a)
    b = fetch_department_names([86477, 44487])
    print(b)
