# -*- coding: utf-8 -*-
import pytest
from ddf import G

from esb.bkcore.models import ComponentSystem, ESBChannel
from esb.management.commands.sync_system_and_channel_data import Command

pytestmark = pytest.mark.django_db


class TestCommand:
    def test_update_channels(self, mocker, unique_id):
        system_name = unique_id
        channel_method = "GET"
        channel_path_exist = "/%s/exist/" % unique_id
        channel_path_not_exist = "/%s/not-exist/" % unique_id

        mocker.patch(
            "esb.management.commands.sync_system_and_channel_data.conf_tools.ConfClient",
            return_value=mocker.MagicMock(
                channels={
                    system_name: [
                        {
                            "method": channel_method,
                            "path": channel_path_exist,
                            "comp_codename": "generic.test_system.test",
                            "comp_conf_to_db": {},
                            "system_name": "test_system",
                            "component_name": "test",
                            "component_label": "test",
                            "component_type": "query",
                            "suggest_method": "GET",
                            "is_hidden": False,
                            "is_deprecated": False,
                            "is_confapi": False,
                        },
                        {
                            "method": channel_method,
                            "path": channel_path_not_exist,
                            "comp_codename": "generic.test_system.test",
                            "comp_conf_to_db": {},
                            "system_name": "test_system",
                            "component_name": "test",
                            "component_label": "test",
                            "component_type": "query",
                            "suggest_method": "GET",
                            "is_hidden": False,
                            "is_deprecated": False,
                            "is_confapi": False,
                        }
                    ]
                },
            )
        )

        system = G(ComponentSystem, name=system_name)

        channel_1 = G(ESBChannel, component_system=system, is_hidden=True, method=channel_method, path=channel_path_exist)
        channel_2 = G(ESBChannel, component_system=system, is_hidden=False)

        mocker.patch.object(
            Command, "_get_official_channel_ids", return_value=[channel_1.id, channel_2.id],
        )

        command = Command()
        command.force = False
        command.update_channels()

        # created
        assert not ESBChannel.objects.get(method=channel_method, path=channel_path_not_exist).is_hidden
        # changed
        assert not ESBChannel.objects.get(id=channel_1.id).is_hidden
        # not specified
        assert ESBChannel.objects.get(id=channel_2.id).is_hidden

    def test_get_official_channel_ids(self, mocker, unique_id):
        system = G(ComponentSystem, name=unique_id)
        channel = G(ESBChannel, component_system=system)

        mocker.patch(
            "esb.management.commands.sync_system_and_channel_data.ComponentSystem.objects.get_official_ids",
            return_value=[system.id],
        )

        assert Command()._get_official_channel_ids() == [channel.id]

    def test_hide_channels(self):
        channel = G(ESBChannel, is_hidden=False)

        Command()._hide_channels([channel.id])

        assert ESBChannel.objects.get(id=channel.id).is_hidden