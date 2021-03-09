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


from components import usermgr_api


def _update_user(username, **kwargs):
    ok, message, _ = usermgr_api.upsert_user(username, **kwargs)
    return ok, message


def update_user_info(username, chname, phone, email, qq=None):
    kwargs = {
        "display_name": chname,
        "telephone": phone,
        "email": email,
    }
    if qq:
        kwargs["qq"] = qq
    return _update_user(username, **kwargs)


def reset_password(username, password):
    kwargs = {
        "": password,
    }
    return _update_user(username, **kwargs)


def reset_user_i18n_language(username, language):
    kwargs = {
        "language": language,
    }
    return _update_user(username, **kwargs)


def reset_user_i18n_timezone(username, timezone):
    kwargs = {
        "time_zone": timezone,
    }
    return _update_user(username, **kwargs)


def get_user(username):
    """
    获取单个用户信息
    """
    ok, message, _data = usermgr_api.batch_query_users(username_list=[username])
    if ok:
        # 判断是否能拿到数据
        if not _data or len(_data) != 1:
            return False, "user do not exists", {}
        _data = _data[0]
    return ok, message, _data


def unbind_user_wx(username):
    kwargs = {
        "wx_userid": "",
    }
    ok, _ = _update_user(username, **kwargs)
    return ok


def bind_user_wx(username, wx):
    kwargs = {
        "wx_userid": wx,
    }
    return _update_user(username, **kwargs)


def get_user_wx(username):
    ok, _, _data = get_user(username)
    if not ok:
        return ""

    return _data.get("wx_userid", "")
