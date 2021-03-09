from django.test import TestCase

from .confapis import ConfapisChannelManager


class TestConfapisChannelManager(TestCase):
    def register_channel_groups(self, manager, path, method, rewrite_channels=None):
        manager.register_channel_groups({}, [(path, {"comp_codename": "test"})], rewrite_channels or {})

    def test_get_channel_by_path_matched(self):
        path = "/v2/confapi"
        method = "GET"

        manager = ConfapisChannelManager()
        self.register_channel_groups(manager, path, method)
        channel = manager.get_channel_by_path(path, method)
        self.assertEqual(channel["raw_path"], path)

    def test_search_channel_by_repath_matched(self):
        path = "/v2/confapi/vars/{var}"
        method = "GET"

        manager = ConfapisChannelManager()
        self.register_channel_groups(manager, path, method)

        channel, path_vars = manager.search_channel_by_repath(path.format(var="test"), method)
        self.assertEqual(path_vars.val_dict["var"], "test")
        self.assertEqual(channel["raw_path"], path)

    def test_search_channel_by_repath_unmatch(self):
        path = "/v2/confapi/vars/{var}"
        method = "GET"

        manager = ConfapisChannelManager()
        self.register_channel_groups(manager, path, method)

        confing, path_vars = manager.search_channel_by_repath(path.format(var=""), method)
        self.assertIsNone(path_vars)
