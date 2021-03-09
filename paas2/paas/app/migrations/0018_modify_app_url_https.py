# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations
from django.conf import settings


def load_data(apps, schema_editor):
    """
    添加 作业平台和配置平台的创建者
    """
    App = apps.get_model("app", "App")

    # 修改 作业平台和配置平台的链接为https
    if settings.HTTP_SCHEMA == "https":
        App.objects.filter(code='bk_cc').update(external_url='https://%s' % settings.HOST_CC)
        App.objects.filter(code='bk_job').update(external_url='https://%s' % settings.HOST_JOB)


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0017_auto_20170905_1459'),
    ]

    operations = [
        migrations.RunPython(load_data)
    ]
