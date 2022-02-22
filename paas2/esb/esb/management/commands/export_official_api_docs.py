# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS
Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License.
You may obtain a copy of the License at http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
specific language governing permissions and limitations under the License.
"""

import datetime
import logging
import os

from django.core.management.base import BaseCommand
from django.conf import settings

from common.base_utils import smart_str
from common.file import generate_temp_dir, generate_tarfile, write_to_file
from esb.bkcore.models import ESBChannel, ComponentSystem
from esb.management.utils.api_docs import ApiDocManager, DocNotChangedException

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    """export official public api docs"""

    def handle(self, *args, **options):
        with generate_temp_dir() as output_dir:
            self._generate_api_docs(output_dir)

            output_filename = os.path.join(settings.BASE_DIR, "bk-esb-api-docs-%s.tar.gz" % self._now_str)
            generate_tarfile(output_filename, output_dir, "bk-esb-api-docs")

        logger.info("Export api docs to file: %s", output_filename)

    def _generate_api_docs(self, output_dir):
        api_doc_manager = ApiDocManager(is_update_all_api_doc=True)
        official_system_ids = ComponentSystem.objects.get_official_ids()
        for channel in ESBChannel.objects.filter_channels(system_ids=official_system_ids, is_hidden=False, is_active=True):
            try:
                api_data = api_doc_manager.get_api_doc(channel)
            except DocNotChangedException:
                continue
            except Exception:
                logger.exception("Generate apidoc fail, component_codename=%s", channel.component_codename)
                continue

            if not api_data:
                logger.warning(
                    "Oooops, No api document define found in component %s, you better write one.",
                    channel.component_codename,
                )
                continue

            for language, content in api_data["doc_md"].items():
                doc_dir_path = os.path.join(output_dir, api_data["system_name"].lower(), language)
                doc_path = os.path.join(doc_dir_path, "%s.md" % api_data["component_name"])

                if not os.path.exists(doc_dir_path):
                    os.makedirs(doc_dir_path)

                write_to_file(smart_str(content), doc_path, mode="wb")

    @property
    def _now_str(self):
        return datetime.datetime.now().strftime("%Y%m%d%H%M%S")
