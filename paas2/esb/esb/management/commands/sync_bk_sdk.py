# -*- coding: utf-8 -*-
"""
生成最新SDK
"""
from django.conf import settings
from django.core.management.base import BaseCommand

from apps.sdk_management.utils import SDKGenerator
from esb.management.utils import conf_tools

import logging

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    def get_target_dir(self):
        return getattr(settings, "SDK_TARGET_DIR", "/tmp/open_paas_esb_sdk/")

    def handle(self, *args, **options):
        conf_client = conf_tools.ConfClient()
        sdk_channels = conf_client.default_channels
        for system_name, system_channels in conf_client.confapis_channels.iteritems():
            sdk_channels.setdefault(system_name, [])
            sdk_channels[system_name].extend(system_channels)

        sdk_generator = SDKGenerator(
            channels=sdk_channels,
            target_dir=self.get_target_dir(),
        )
        sdk_generator.generate_sdk_files()
        logger.info("generate open_pass_esb sdk files to %s" % self.get_target_dir())
