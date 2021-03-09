# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations

from esb.bkcore.constants import FUNCTION_CONTROLLERS


def init_function_controller(apps, schema_editor):
    FunctionController = apps.get_model('bkcore', 'FunctionController')
    for func_ctl in FUNCTION_CONTROLLERS:
        func_code = func_ctl.pop('func_code')
        FunctionController.objects.get_or_create(func_code=func_code, defaults=func_ctl)


class Migration(migrations.Migration):

    dependencies = [
        ('bkcore', '0002_auto_20160712_2041'),
    ]

    operations = [
        migrations.RunPython(init_function_controller),
    ]
