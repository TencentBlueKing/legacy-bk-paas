# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
"""
update api_doc to db
"""
import json
import logging
from optparse import make_option

from django.core.management.base import BaseCommand

from esb.bkcore.models import ComponentAPIDoc, ESBChannel
from esb.management.utils.api_docs import ApiDocManager, DocNotChangedException

logger = logging.getLogger(__name__)


class Command(BaseCommand):

    option_list = BaseCommand.option_list + (
        make_option('--all', action='store_true', dest='all', default=False, help='update all api docs'),
    )

    def handle(self, *args, **options):
        update_api_docs(is_update_all_api_doc=options['all'])


def update_api_docs(is_update_all_api_doc):
    # init api docs
    api_doc_manager = ApiDocManager()
    api_doc_manager.is_update_all_api_doc = is_update_all_api_doc
    for channel in ESBChannel.objects.filter(is_active=True, is_hidden=False):
        try:
            api_data = api_doc_manager.get_api_doc(channel)
        except DocNotChangedException:
            continue
        except Exception as ex:
            logger.error('fail to generate apidoc for %s, Exception: %s', channel.component_codename, ex)
            continue

        if not api_data:
            logger.warning(
                'Oooops, No api document define found in component %(comp_name)s, you better write one.' %
                {'comp_name': channel.component_codename})
            continue

        ComponentAPIDoc.objects.update_or_create(
            component_id=channel.id,
            defaults={
                'board': '',
                'doc_md': json.dumps(api_data['doc_md']),
                'doc_html': json.dumps(api_data['doc_html']),
                'doc_md_md5': api_data['raw_doc_md_md5'],
            }
        )
        logger.info('Document synced for api [%s](%s)', api_data['system_name'], api_data['component_name'])
