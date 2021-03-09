# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0006_app_is_saas'),
    ]

    operations = [
        migrations.AddField(
            model_name='app',
            name='logo',
            field=models.ImageField(null=True, upload_to=b'applogo', blank=True),
        ),
        migrations.AlterField(
            model_name='app',
            name='tags',
            field=models.ForeignKey(on_delete=django.db.models.deletion.SET_NULL, blank=True, to='app.AppTags', help_text='\u5e94\u7528\u5206\u7c7b', null=True),
        ),
    ]
