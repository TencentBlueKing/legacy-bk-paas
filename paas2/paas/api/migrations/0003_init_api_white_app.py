# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations


def load_data(apps, schema_editor):
    """
    初始化壁纸
    """
    ApiWhiteList = apps.get_model("api", "ApiWhiteList")
    ApiWhiteList.objects.get_or_create(api_name='app_maker', app_code='bk_sops')


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_init_api_white_app'),
    ]

    operations = [
        migrations.RunPython(load_data)
    ]
