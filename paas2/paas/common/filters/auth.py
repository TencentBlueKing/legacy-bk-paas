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


from django.utils.translation import ugettext as _
from common.bk_iam import Permission, ResourceTypeNameDict, ActionNameDict


def has_smart_manage_permission(username):
    return Permission().allowed_manage_smart(username)


def has_system_ops_permission(username):
    return Permission().allowed_ops_system(username)


def has_apigateway_manage_permission(username):
    return Permission().allowed_manage_apigateway(username)


def has_app_develop_permission(username, app_code):
    return Permission().allowed_develop_app(username, app_code)


def get_action_name(action_id):
    return _(ActionNameDict.get(action_id, action_id))


def get_resource_type_name(resource_type):
    return _(ResourceTypeNameDict.get(resource_type, resource_type))
