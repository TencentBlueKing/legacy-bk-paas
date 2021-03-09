# -*- coding: utf-8 -*-

from rest_framework import permissions


def is_app_user(request, obj):
    return hasattr(obj, "is_active") and obj.is_active


def is_agent(request, obj):
    return hasattr(obj, "is_active") and obj.is_active


class IsAppUser(permissions.BasePermission):
    """
    Object-level permission to allow owners or collaborators to access
    an app-related model.
    """

    def has_object_permission(self, request, view, obj):
        return is_app_user(request, obj)


class IsAgent(permissions.BasePermission):
    """
    Object-level permission to allow owners or collaborators to access
    an app-related model.
    """

    def has_object_permission(self, request, view, obj):
        return is_agent(request, obj)
