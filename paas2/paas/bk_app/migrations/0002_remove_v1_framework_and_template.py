# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
from bk_app.constants import SAAS_LIST


def delete_v1_framework_template(apps, schema_editor):
    SaaSApp = apps.get_model("saas", "SaaSApp")

    for app_code in ('bk_framework', 'bk_app_template'):
        try:
            saas_app = SaaSApp.objects.get(code=app_code)
            saas_app_id = saas_app.id
            # not deployed
            if not saas_app.app_id:
                saas_app.delete()
        except Exception as e:
            continue


class Migration(migrations.Migration):

    dependencies = [
        ('bk_app', '0001_load_bkapps_intial_data'),
    ]

    operations = [
        migrations.RunPython(delete_v1_framework_template),
    ]
