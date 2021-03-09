# -*- coding: utf-8 -*-
"""
Classes to serialize the RESTful representation of OpenPaaS API models.
"""

from rest_framework import serializers

from api import models


class BkAppSerializer(serializers.ModelSerializer):
    """Serialize a :class:`~api.models.BkApp` model."""

    token = serializers.ReadOnlyField(required=False)
    app_envs = serializers.ReadOnlyField(required=False)

    class Meta:
        """Metadata options for a :class:`AppSerializer`."""

        model = models.BkApp


class BkAppEventSerializer(serializers.ModelSerializer):
    """Serialize a :class:`~api.models.BkAppEventLog` model."""

    logs = serializers.ReadOnlyField(required=False)

    class Meta:
        """Metadata options for a :class:`AppSerializer`."""

        model = models.BkAppEvent
