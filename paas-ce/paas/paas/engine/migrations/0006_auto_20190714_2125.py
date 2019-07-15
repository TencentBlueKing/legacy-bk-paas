# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('engine', '0005_auto_20160929_1109'),
    ]

    operations = [
        migrations.CreateModel(
            name='BkEvent',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, serialize=False, editable=False, primary_key=True)),
                ('event_type', models.CharField(max_length=200)),
                ('status', models.CharField(max_length=200)),
                ('message', models.TextField(default='')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'ordering': ('created_at',),
                'db_table': 'engine_events',
                'verbose_name': 'father event',
            },
        ),
        migrations.AddField(
            model_name='bkappevent',
            name='bk_event_id',
            field=models.CharField(default='-1', max_length=128),
        ),
        migrations.AddField(
            model_name='bkappevent',
            name='is_master',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='bkappevent',
            name='server_id',
            field=models.IntegerField(default=-1),
        ),
    ]
