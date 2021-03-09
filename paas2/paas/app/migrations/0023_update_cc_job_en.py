# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations


def load_data(apps, schema_editor):
    """
    insert en of bk_cmdb/bk_job
    """
    App = apps.get_model("app", "App")
    cmdb_intro = ("BlueKing Configuration System is an application-oriented CMDB. In the "
"ITIL, the CMDB is the cornerstone for building other processes. In "
"BlueKing, the Configuration System plays a crucial role and provides "
"applications with data configuration services for different operation "
"scenarios.")
    job_intro = ("The Job System is a script automation operating platform tailored for "
"operation and maintenance, and provides one-click and automatic operation"
" for various complex operation and maintenance scenarios, including batch"
" script execution, file distribution, file pull and scheduled tasks. Each"
" step in executing the script process, can be conducted automatically or "
"manually.")

    App.objects.filter(code='bk_cmdb').update(name_en="CMDB", introduction_en=cmdb_intro)
    App.objects.filter(code='bk_job').update(name_en="JOB", introduction_en=job_intro)


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0022_auto_20190807_1538'),
    ]

    operations = [
        migrations.RunPython(load_data)
    ]
