# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations
from django.utils import timezone
from django.conf import settings


def load_data(apps, schema_editor):
    """
    添加第三方应用 作业平台和配置平台
    初始化 默认应用
    """
    App = apps.get_model("app", "App")

    # 添加第三方应用 作业平台和配置平台
    App.objects.bulk_create([
        App(
            name=u"配置平台",
            code="bk_cc",
            introduction=u"蓝鲸配置平台是一款面向应用的CMDB，在ITIL体系里，CMDB是构建其它流程的基石，而在蓝鲸智云体系里，配置平台就扮演着基石的角色，为应用提供了各种运维场景的配置数据服务。",
            logo='applogo/bk_cc.png',
            state=4,
            is_already_test=True,
            is_already_online=True,
            first_test_time=timezone.now(),
            first_online_time=timezone.now(),
            is_max=True,
            is_third=True,
            is_platform=True,
            is_default=True,
            external_url='http://%s' % settings.HOST_CC,
        ),
        App(
            name=u"作业平台",
            code="bk_job",
            introduction=u"为运维量身定制的脚本自动化操作平台，实现各种复杂运维场景的一键式、自动化操作。包含：批量脚本执行、文件分发、文件拉取、定时任务。流程化执行一系列脚本，各个步骤可自动或人工执行。",
            logo='applogo/bk_job.png',
            state=4,
            is_already_test=True,
            is_already_online=True,
            first_test_time=timezone.now(),
            first_online_time=timezone.now(),
            is_max=True,
            is_third=True,
            is_platform=True,
            is_default=True,
            external_url='http://%s' % settings.HOST_JOB,
        ),
    ])


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0011_add_internal_apps'),
    ]

    operations = [
        migrations.RunPython(load_data)
    ]
