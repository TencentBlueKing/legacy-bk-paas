# -*- coding: utf-8 -*-
from django.utils import translation
from django.utils.translation import ugettext as _

from common.base_utils import html_escape
from common.constants import API_TYPE_Q
from components.component import Component
from esb.bkcore.models import ComponentSystem, ESBChannel
from .toolkit import configs


class GetSystems(Component):
    """"""

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    def handle(self):
        systems = ComponentSystem.objects.all()
        systems_has_channel = []

        bk_language = self.request.headers.get("Blueking-Language", "en")
        with translation.override(bk_language):
            for system in systems:
                if ESBChannel.objects.filter(component_system_id=system.id, is_hidden=False).exists():
                    system_label = system.label
                    if system.is_official:
                        system_label = _(system_label)
                    systems_has_channel.append(
                        {
                            "name": html_escape(system.name),
                            "label": html_escape(system_label),
                        }
                    )

        self.response.payload = {"result": True, "data": systems_has_channel}
