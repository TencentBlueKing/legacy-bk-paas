# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models

def update_iam_resource_owner_to_creater(apps, schema_editor):
    """
    更新所有app.iam_resource_owner = app.creater
    """
    pass
    # App = apps.get_model("app", "App")
    # for app in App.objects.all():
    #     app.iam_resource_owner = app.creater
        # app.save()

class Migration(migrations.Migration):

    dependencies = [
        ('app', '0025_auto_20191126_1418'),
    ]

    operations = [
        migrations.AddField(
            model_name='app',
            name='iam_resource_owner',
            field=models.CharField(max_length=32, null=True, verbose_name='IAM\u8d44\u6e90\u6240\u6709\u8005', blank=True),
        ),
        migrations.RunPython(update_iam_resource_owner_to_creater)
    ]
