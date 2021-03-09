# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations


def load_data(apps, schema_editor):
    """
    默认内部应用, 为了获取esb鉴权(esb加白)而生成securt_key的给其他系统调用esb使用 而生成的应用
    - bk_paas_log_alert

    is_saas = True
    但是, 不会出现在 我的应用/内置应用列表中
    """
    App = apps.get_model("app", "App")

    App(
        name="bk_paas_log_alert",
        code="bk_paas_log_alert",
        introduction=u"[内部系统-日志告警], 需使用esb的cmsi等接口, 请勿修改其属性等信息",
        creater="internal_default",
        auth_token="defcef66-f80b-11e6-b449-784f4358a163",
        is_saas=False,
        is_sysapp=True
    ).save()


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0010_app_is_platform'),
    ]

    operations = [
        migrations.RunPython(load_data)
    ]
