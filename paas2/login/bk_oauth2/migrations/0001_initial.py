# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
from django.conf import settings
import oauth2_provider.validators


class Migration(migrations.Migration):

    dependencies = [
        ('app', '__first__'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Application',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('redirect_uris', models.TextField(help_text='Allowed URIs list, space separated', blank=True, validators=[oauth2_provider.validators.validate_uris])),
                ('client_type', models.CharField(max_length=32, choices=[('confidential', 'Confidential'), ('public', 'Public')])),
                ('authorization_grant_type', models.CharField(max_length=32, choices=[('authorization-code', 'Authorization code'), ('implicit', 'Implicit'), ('password', 'Resource owner password-based'), ('client-credentials', 'Client credentials')])),
                ('name', models.CharField(max_length=255, blank=True)),
                ('skip_authorization', models.BooleanField(default=False)),
                ('app', models.ForeignKey(to='app.App')),
                ('user', models.ForeignKey(related_name='bk_oauth2_application', blank=True, to=settings.AUTH_USER_MODEL, null=True)),
            ],
            options={
                'db_table': 'login_bk_oauth2_application',
            },
        ),
    ]
