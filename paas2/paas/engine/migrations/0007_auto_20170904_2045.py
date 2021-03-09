# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('engine', '0006_auto_20170215_1527'),
    ]

    operations = [
        migrations.CreateModel(
            name='BkAppBindPort',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('mode', models.CharField(default=b'test', max_length=10, choices=[(b'test', b'\xe6\xb5\x8b\xe8\xaf\x95\xe7\x8e\xaf\xe5\xa2\x83'), (b'prod', b'\xe6\xad\xa3\xe5\xbc\x8f\xe7\x8e\xaf\xe5\xa2\x83')])),
                ('port', models.IntegerField(verbose_name='\u4f7f\u7528\u7684\u670d\u52a1\u5668\u7aef\u53e3\u53f7')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('bk_app', models.ForeignKey(to='engine.BkApp')),
            ],
            options={
                'ordering': ('created_at',),
                'db_table': 'engine_app_bind_port',
                'verbose_name': 'app bind port',
            },
        ),
        migrations.AlterUniqueTogether(
            name='bkappbindport',
            unique_together=set([('bk_app', 'mode', 'port')]),
        ),
    ]
