#!/usr/bin/env python
# -*- coding: utf-8 -*-

import uuid
from django.db import migrations


def load_data(apps, schema_editor):
    tpapp = apps.get_model("app", "App")

    apps = tpapp.objects.filter(is_third=True, auth_token__isnull=True).all()
    for app in apps:
        app.auth_token = str(uuid.uuid4())
        app.save()


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.RunPython(load_data)
    ]
