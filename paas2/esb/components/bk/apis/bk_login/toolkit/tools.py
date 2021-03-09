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


def convert_user_info(user):
    return {
        "username": user.get("bk_username", ""),
        "qq": user.get("qq", ""),
        "language": user.get("language", ""),
        "wx_userid": user.get("wx_userid", ""),
        "time_zone": user.get("time_zone", ""),
        "phone": user.get("telephone", ""),
        "role": str(user.get("bk_role", 0)),
        "email": user.get("email"),
        "chname": user.get("display_name"),
    }
