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

import json

from django.conf import settings
from django.db import transaction
from django.utils.translation import ugettext as _

from common.http import http_get
from common.log import logger
from app.constants import AppStateEnum, OPENMODE_DICT, OpenModeEnum
from app.models import App, SecureInfo
from app.validators import validate_vcs_url, validate_app_name, validate_app_tags, validate_external_url
from release.utils import update_app_state
from components.esb_usermgr import fetch_user_names, fetch_department_names


def _get_users_from_login_service(bk_token):
    """
    获取所有用户的信息
    """
    param = {"bk_token": bk_token}
    if settings.LOGIN_DOMAIN:
        get_user_url = "http://%s/login/accounts/get_all_user/" % settings.LOGIN_DOMAIN
    else:
        get_user_url = "%s/login/accounts/get_all_user/" % settings.LOGIN_HOST

    result, resp = http_get(get_user_url, param)
    resp = resp if result and resp else {}
    ret = resp.get("result", False) if result and resp else False
    # 获取用户信息失败
    if not ret:
        # 请求平台接口获取用户信息失败
        msg = resp.get("message", "")
        logger.error(u"access api %s to get_all_use fail: %s" % (get_user_url, msg))
        return False, []
    return True, resp.get("data", [])


def update_all_app_state(app_list):
    # refresh_app_list = []
    app_refresh_states = [AppStateEnum.IN_TEST, AppStateEnum.IN_ONLINE, AppStateEnum.IN_OUTLINE]
    for _app in app_list:
        if _app.state in app_refresh_states:
            _app_code = _app.code
            try:
                update_app_state(_app_code)
                # 获取更新后的应用信息
                _app = App.objects.get(code=_app_code)
            except Exception:
                # 更新应用[%s]状态失败
                logger.exception(u"Update app [%s]'s status fail" % _app_code)
        # refresh_app_list.append(_app)
    # return refresh_app_list


def modify_app_base_info(app_code, request):
    app = App.objects.get(code=app_code)
    name = request.POST.get("name", "").replace("&nbsp;", " ").strip()
    old_name = app.name
    is_valid, message = validate_app_name(name, old_name)
    if not is_valid:
        return False, message

    app_tags = request.POST.get("app_tags", "")
    is_tags_valid, tags_msg, app_tags = validate_app_tags(app_tags)
    if not is_tags_valid:
        return False, tags_msg

    # 集成应用（第三方应用）
    if app.is_third:
        external_url = request.POST.get("external_url", "").replace("&nbsp;", " ").strip()
        is_external_url_valid, external_url_msg = validate_external_url(external_url)
        if not is_external_url_valid:
            return False, external_url_msg

    try:
        # 保存用户基本信息
        with transaction.atomic():
            app.name = name
            app.tags = app_tags
            app.save()

            # 集成应用（第三方应用）
            if app.is_third:
                app.external_url = external_url
                app.save()
    except Exception as e:
        # 保存用户基本信息异常
        logger.exception(u"save user base info fail: %s" % e)
        return False, _(u"编辑失败")

    return True, "SUCCESS"


def modify_app_desktop_info(app_code, request):
    app = App.objects.get(code=app_code)
    width = int(request.POST.get("width"))
    height = int(request.POST.get("height"))
    open_mode = request.POST.get("open_mode")
    if width <= 0 or height <= 0:
        return False, _(u"宽度和高度必须为正整数")
    if open_mode not in OPENMODE_DICT.keys():
        return False, _(u"打开方式选择配置不正确")
    app.width = width
    app.height = height
    app.open_mode = open_mode
    app.save()
    return True, "SUCCESS"


def modify_app_introduction(app_code, request):
    app = App.objects.get(code=app_code)
    introduction = request.POST.get("introduction", "").replace("&nbsp;", " ").strip()
    if not introduction:
        return False, _(u"应用简介不能为空")

    app.introduction = introduction
    app.save()
    return True, "SUCCESS"


def modify_app_vcs_info(app_code, request):
    vcs_type = request.POST.get("vcs_type")
    vcs_url = request.POST.get("vcs_url", "").replace("&nbsp;", " ").strip()
    vcs_username = request.POST.get("vcs_username", "").replace("&nbsp;", " ").strip()
    vcs_password = request.POST.get("vcs_password", "").replace("&nbsp;", " ").strip()

    if not all([vcs_url, vcs_username, vcs_password]):
        return False, _(u"代码URL,用户名,密码不能为空")

    is_vcs_valid, vcs_msg = validate_vcs_url(vcs_type, vcs_url)
    if not is_vcs_valid:
        return False, vcs_msg

    SecureInfo.objects.filter(app_code=app_code).update(
        vcs_url=vcs_url, vcs_username=vcs_username, vcs_password=vcs_password
    )

    return True, "SUCCESS"


def modify_app_db_info(app_code, request):
    db_host = request.POST.get("db_host", "")
    db_port = request.POST.get("db_port", "")
    db_username = request.POST.get("db_username", "")
    db_password = request.POST.get("db_password", "")

    if not all([db_host, db_username]):
        return False, _(u"数据库信息不能为空")

    if not db_port.isdigit():
        return False, _(u"数据库端口必须为整数")

    SecureInfo.objects.filter(app_code=app_code).update(
        db_host=db_host,
        db_port=db_port,
        db_username=db_username,
        db_password=db_password,
    )
    return True, "SUCCESS"


def modify_app_visiable_labels(app_code, request):
    # get username list + departments list
    # data = request.POST.getlist("selected_list[]")
    data = request.POST.get("selected_list")
    if data:
        import json

        data = json.loads(data)
    else:
        data = []
    # print("after parse", data)

    username_list = {"u:%s" % u.get("id") for u in data if u.get("type") == "user"}
    department_list = {"d:%s" % d.get("id") for d in data if d.get("type") == "department"}

    username_list = set(username_list)
    department_list = set(department_list)

    visiable_labels = []
    visiable_labels.extend(username_list)
    visiable_labels.extend(department_list)

    # print(visiable_labels)

    app = App.objects.get(code=app_code)
    app.visiable_labels = visiable_labels
    app.save()

    return True, "SUCCESS"


def parse_app_visiable_labels(labels):  # noqa
    """
    ["u:14", "d:8"]

    to:
    var data = [
              {
                id: '8',
                type: 'department',
                name: '',
              },
              {
                id: '14',
                type: 'user'
                name: '',
              }
    ]
    """
    user_id_list = []
    department_id_list = []
    for label in labels:
        if label.startswith("u:"):
            user_id_list.append(label[2:])
            continue

        if label.startswith("d:"):
            department_id_list.append(label[2:])

    if not (user_id_list or department_id_list):
        return "[]"

    data = []

    user_names = {}
    if user_id_list:
        try:
            ok, user_names = fetch_user_names(user_id_list)
            if not ok:
                user_names = {}
        except Exception:
            logger.Exception("fetch_user_names fail")
            user_names = {}

    for uid in user_id_list:
        data.append({"id": int(uid), "type": "user", "name": user_names.get(uid, uid)})

    department_names = {}
    if department_id_list:
        try:
            ok, department_names = fetch_department_names(department_id_list)
            if not ok:
                department_names = {}
        except Exception:
            logger.Exception("fetch_department_names fail")
            department_names = {}

    for did in department_id_list:
        data.append({"id": int(did), "type": "department", "name": department_names.get(did, did)})

    return json.dumps(data)


def get_open_mode_choices():
    return [(OpenModeEnum.DESKTOP, _(u"桌面")), (OpenModeEnum.NEW_TAB, _(u"新标签页"))]
