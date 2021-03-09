# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='AuditEventLog',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('event_id', models.UUIDField(default=uuid.uuid4, editable=False)),
                ('system', models.CharField(max_length=64)),
                ('username', models.CharField(max_length=64)),
                ('op_time', models.DateTimeField(auto_now_add=True)),
                ('op_type', models.CharField(max_length=32, choices=[(1, '\u67e5\u8be2'), (2, '\u521b\u5efa'), (3, '\u5220\u9664'), (4, '\u4fee\u6539')])),
                ('op_object_type', models.CharField(max_length=32)),
                ('op_object_id', models.CharField(max_length=64, null=True, blank=True)),
                ('op_object_name', models.CharField(max_length=64, null=True, blank=True)),
                ('data_before', models.TextField(null=True, blank=True)),
                ('data_after', models.TextField(null=True, blank=True)),
                ('comment', models.TextField(null=True, blank=True)),
            ],
            options={
                'db_table': 'audit_event_log',
                'verbose_name': '\u64cd\u4f5c\u5ba1\u8ba1\u65e5\u5fd7',
                'verbose_name_plural': '\u64cd\u4f5c\u5ba1\u8ba1\u65e5\u5fd7',
            },
        ),
    ]
