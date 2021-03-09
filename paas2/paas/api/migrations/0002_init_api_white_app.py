# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations


def load_data(apps, schema_editor):
    """
    初始化壁纸
    """
    ApiWhiteList = apps.get_model("api", "ApiWhiteList")
    ApiWhiteList.objects.get_or_create(api_name='app_maker', app_code='gcloud')


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(load_data)
    ]
