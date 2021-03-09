# -*- coding: utf-8 -*-

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
