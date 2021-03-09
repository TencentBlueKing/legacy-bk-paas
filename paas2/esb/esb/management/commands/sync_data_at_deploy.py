# -*- coding: utf-8 -*-
"""
update system and channel data to db
"""
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    def handle(self, *args, **options):
        from esb.management.commands import sync_function_controller

        sync_function_controller.Command().handle()

        from esb.management.commands import sync_system_and_channel_data

        sync_system_and_channel_data.Command().handle(force=False)

        from esb.management.commands import sync_api_docs

        sync_api_docs.Command().handle(all=False)
