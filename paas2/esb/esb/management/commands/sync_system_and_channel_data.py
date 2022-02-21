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

import json
import logging
from optparse import make_option

from django.core.management.base import BaseCommand

from common.constants import API_TYPE_Q
from esb.bkcore.models import ComponentSystem, ESBBuffetComponent, ESBChannel, SystemDocCategory
from esb.management.utils import conf_tools

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    """update system and channel data to db"""

    option_list = BaseCommand.option_list + (
        make_option("--force", action="store_true", dest="force", help="Force data update to db"),
    )

    def handle(self, *args, **options):
        self.force = options["force"]
        self.warning_msgs = []

        self.update_doc_category()
        self.update_systems()
        self.update_channels()
        self.update_buffet_components()
        self.update_system_doc_category()

        for msg in self.warning_msgs:
            logger.warning(msg)

        logger.info("Sync system/channels done")

    def update_systems(self):
        default_update_fields = ["label", "remark", "interface_admin", "doc_category_id"]
        force_update_fields = ["execute_timeout", "query_timeout"]

        doc_categories = self.get_doc_categories()

        conf_client = conf_tools.ConfClient()
        for system in conf_client.systems:
            # 将系统配置中系统文档名称转换为系统分类ID
            doc_category = doc_categories.get(system.get("doc_category"))
            if doc_category:
                system["doc_category_id"] = doc_category.id

            component_system, created = ComponentSystem.objects.get_or_create(
                name=system["name"], defaults=self.get_by_fields(system, default_update_fields + force_update_fields)
            )
            if created:
                logger.info("add system: %s", system["name"])
            else:
                self.diff_obj_conf(
                    component_system, system, "system %s" % system["name"], default_update_fields, force_update_fields
                )

                component_system.__dict__.update(self.get_by_fields(system, default_update_fields))
                if self.force:
                    component_system.__dict__.update(self.get_by_fields(system, force_update_fields))
                component_system.save()

    def update_channel_by_config(self, channel, config, default_update_fields, force_update_fields):
        self.diff_obj_conf(
            channel,
            config,
            "channel %s" % config["path"],
            default_update_fields,
            force_update_fields,
        )
        channel.method = config["method"]
        channel.extra_info = json.dumps(config["extra_info"])
        channel.__dict__.update(self.get_by_fields(config, default_update_fields))
        if channel.is_confapi:
            channel.comp_conf = json.dumps(config["comp_conf_to_db"])
        if self.force:
            channel.__dict__.update(self.get_by_fields(config, force_update_fields))

        try:
            channel.save()
        except Exception:
            logger.exception("update channel fail: id=%s, config=%s", channel.pk, json.dumps(config))

    def create_channel_by_config(self, config, default_update_fields, force_update_fields):
        esb_channel = ESBChannel(**self.get_by_fields(config, default_update_fields + force_update_fields))
        esb_channel.path = config["path"]
        esb_channel.method = config["method"]
        esb_channel.comp_conf = json.dumps(config["comp_conf_to_db"]) if config["comp_conf_to_db"] else ""
        esb_channel.extra_info = json.dumps(config["extra_info"])

        try:
            esb_channel.save()
        except Exception:
            logger.exception("create channel fail: config=%s", json.dumps(config))
        else:
            logger.info("add channel: path=%s", config["path"])

    def update_channels(self):
        default_update_fields = ["name", "component_codename", "component_name", "method", "is_hidden"]
        force_update_fields = ["component_system_id", "type", "timeout_time"]

        remaining_official_channel_ids = self._get_official_channel_ids()
        remaining_official_channels = dict.fromkeys(remaining_official_channel_ids, None)

        conf_client = conf_tools.ConfClient()
        for system_name, channels in conf_client.channels.items():
            try:
                system = ComponentSystem.objects.get(name=system_name)
            except ComponentSystem.DoesNotExist:
                logger.warning("system %s does not exist, channels will not sync to db", system_name)
                continue

            for channel in channels:
                is_hidden = channel.get("is_hidden", False)
                is_deprecated = channel.get("is_deprecated", False)
                is_hidden = is_hidden or is_deprecated

                channel["name"] = channel["component_label"]
                channel["type"] = 2 if channel["component_type"] == API_TYPE_Q else 1
                channel["is_hidden"] = is_hidden
                channel["component_system_id"] = system.id
                channel["component_codename"] = channel["comp_codename"]
                channel["extra_info"] = {
                    "is_confapi": channel.get("is_confapi", False),
                    "label_en": channel.get("label_en", ""),
                    "suggest_method": channel.get("suggest_method", ""),
                }

                try:
                    esb_channel = ESBChannel.objects.get(path=channel["path"], method=channel["method"])
                except ESBChannel.DoesNotExist:
                    if is_deprecated:
                        continue
                    self.create_channel_by_config(channel, default_update_fields, force_update_fields)
                else:
                    remaining_official_channels.pop(esb_channel.id, None)
                    self.update_channel_by_config(esb_channel, channel, default_update_fields, force_update_fields)

        if remaining_official_channels:
            self._hide_channels(remaining_official_channels.keys())

    def update_doc_category(self):
        conf_client = conf_tools.ConfClient()
        for system_doc_category in conf_client.system_doc_category:
            SystemDocCategory.objects.get_or_create(
                name=system_doc_category["label"],
                defaults={
                    "priority": system_doc_category["priority"],
                },
            )

    def update_system_doc_category(self):
        conf_client = conf_tools.ConfClient()
        for system_doc_category in conf_client.system_doc_category:
            # update_doc_category 已创建文档分类
            doc_category = SystemDocCategory.objects.get(
                name=system_doc_category["label"],
            )
            ComponentSystem.objects.filter(doc_category_id__isnull=True).filter(
                name__in=system_doc_category["systems"]
            ).update(doc_category_id=doc_category.id)

    def update_buffet_components(self):
        default_update_fields = ["name"]
        force_update_fields = [
            "type",
            "dest_url",
            "dest_http_method",
            "favor_post_ctype",
            "extra_headers",
            "timeout_time",
        ]
        conf_client = conf_tools.ConfClient()
        for component in conf_client.buffet_components:
            system = ComponentSystem.objects.get(name=component["system_name"])

            if "extra_headers" in component and not isinstance(component["extra_headers"], basestring):
                component["extra_headers"] = json.dumps(component["extra_headers"])

            obj, created = ESBBuffetComponent.objects.get_or_create(
                system=system,
                registed_path=component["registed_path"],
                registed_http_method=component["registed_http_method"],
                defaults=self.get_by_fields(component, default_update_fields + force_update_fields),
            )
            if created:
                logger.info(
                    "add buffet component: %(system_name)s %(registed_http_method)s %(registed_path)s" % component
                )  # noqa
            else:
                self.diff_obj_conf(
                    obj,
                    component,
                    "buffet component %(system_name)s %(registed_http_method)s %(registed_path)s" % component,
                    default_update_fields,
                    force_update_fields,
                )
                obj.__dict__.update(self.get_by_fields(component, default_update_fields))
                if self.force:
                    obj.__dict__.update(self.get_by_fields(component, force_update_fields))
                obj.save()

    def get_doc_categories(self):
        return {category.name: category for category in SystemDocCategory.objects.all()}

    def get_by_fields(self, obj, fields):
        return dict([(field, obj[field]) for field in fields if field in obj])

    def diff_obj_conf(self, obj, conf, flag, default_update_fields, force_update_fields):
        info = []
        warning = []
        for fields, is_info_level in [(default_update_fields, True), (force_update_fields, self.force)]:
            for field in fields:
                if field not in conf:
                    continue
                if getattr(obj, field) != conf[field]:
                    msg = "%s: %s -> %s" % (field, getattr(obj, field), conf[field])
                    if is_info_level:
                        info.append(msg)
                    else:
                        warning.append(msg)
        if info:
            logger.info("%s changed: %s", flag, ", ".join(info))
        if warning:
            self.warning_msgs.append("%s change: %s" % (flag, ", ".join(warning)))

    def _get_official_channel_ids(self):
        official_system_ids = ComponentSystem.objects.get_official_ids()
        return list(ESBChannel.objects.filter(component_system_id__in=official_system_ids).values_list("id", flat=True))

    def _hide_channels(self, channel_ids):
        ESBChannel.objects.filter(id__in=channel_ids).update(is_hidden=True)
