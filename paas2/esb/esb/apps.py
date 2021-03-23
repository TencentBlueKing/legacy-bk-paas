from django.apps import AppConfig

from .utils.config import load_config  # noqa


class ESBAppConfig(AppConfig):
    name = "esb"

    def ready(self):
        # load config for esb
        load_config()
