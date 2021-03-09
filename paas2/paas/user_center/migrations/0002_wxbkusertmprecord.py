# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_center', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='RoleApplyReocrd',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('operator', models.CharField(max_length=32, verbose_name='\u7533\u8bf7\u4eba')),
                ('create_time', models.DateTimeField(auto_now_add=True, verbose_name='\u521b\u5efa\u65f6\u95f4', null=True)),
                ('apply_reason', models.TextField(null=True, verbose_name='\u7533\u8bf7\u539f\u56e0', blank=True)),
                ('apply_role', models.CharField(default=b'2', max_length=32, verbose_name='\u7533\u8bf7\u7684\u89d2\u8272')),
                ('approver', models.CharField(max_length=32, null=True, verbose_name='\u5ba1\u6279\u4eba', blank=True)),
                ('approval_result', models.CharField(default=b'applying', max_length=32, verbose_name='\u5ba1\u6279\u7ed3\u679c', choices=[(b'applying', '\u7533\u8bf7\u4e2d'), (b'pass', '\u5ba1\u6279\u901a\u8fc7'), (b'reject', '\u9a73\u56de')])),
                ('approval_time', models.DateTimeField(null=True, verbose_name='\u5ba1\u6279\u65f6\u95f4', blank=True)),
                ('approval_reason', models.TextField(null=True, verbose_name='\u5ba1\u6279\u539f\u56e0', blank=True)),
            ],
            options={
                'db_table': 'console_user_role_apply_record',
                'verbose_name': '\u7528\u6237\u89d2\u8272\u6743\u9650\u8868',
                'verbose_name_plural': '\u7528\u6237\u89d2\u8272\u6743\u9650\u8868',
            },
        ),
    ]
