# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
from optparse import make_option

from django.core.management.base import BaseCommand, CommandError

from esb.bkcore.models import ESBChannel, AppComponentPerm


class Command(BaseCommand):

    option_list = BaseCommand.option_list + (
        make_option('--app_code', action='store', dest='app_code'),
        make_option('--system_name', action='store', dest='system_name'),
        make_option('--component_name', action='store', dest='component_name'),
    )

    def handle(self, *args, **options):
        app_code = options['app_code']
        system_name = options['system_name']
        component_name = options['component_name']

        if not app_code:
            raise CommandError(u'应用编码 app_code 不能为空')

        components = ESBChannel.objects.all()
        if system_name:
            components = components.filter(component_system__name=system_name)
        if component_name:
            components = components.filter(component_name__in=component_name.split(','))
        components = components.values('id', 'component_system__name', 'component_name')

        for component in components:
            obj, created = AppComponentPerm.objects.get_or_create(
                app_code=app_code,
                component_id=component['id'],
            )
            if created:
                tip = 'add perm'
            else:
                tip = 'update perm'
                obj.touch_expires()
                obj.save()
            tip = '{tip}: app_code={app_code}, system_name={system_name}, component_name={component_name}'.format(
                tip=tip, app_code=app_code, system_name=component['component_system__name'],
                component_name=component['component_name'],
            )
            print tip

        print 'Done, count: {count}'.format(count=len(components))
