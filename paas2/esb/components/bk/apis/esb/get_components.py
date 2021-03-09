# -*- coding: utf-8 -*-
from django import forms
from django.utils import translation
from django.utils.translation import ugettext as _

from common.base_utils import html_escape
from common.forms import BaseComponentForm
from common.constants import API_TYPE_Q
from components.component import Component
from esb.bkcore.models import ComponentSystem, ESBChannel, AppComponentPerm
from .toolkit import configs


class GetComponents(Component):
    """"""

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    class Form(BaseComponentForm):
        system_name = forms.CharField(label="system name", required=True)
        searched_app_code = forms.CharField(label="app_code", required=False)

    def handle(self):
        data = self.form_data
        try:
            system = ComponentSystem.objects.get(name=data["system_name"])
        except ComponentSystem.DoesNotExist:
            self.response.payload = {"result": False, "message": "system [%s] does not exist" % data["system_name"]}
            return

        channels = ESBChannel.objects.filter(component_system_id=system.id, is_hidden=False)
        components = []
        searched_app_code = data["searched_app_code"]
        is_official = system.is_official

        bk_language = self.request.headers.get("Blueking-Language", "en")
        with translation.override(bk_language):
            for channel in channels:
                perm_level = channel.perm_level
                if perm_level == 0:
                    app_has_component_perm = True
                elif searched_app_code:
                    app_has_component_perm = AppComponentPerm.objects.filter(
                        app_code=searched_app_code, component_id=channel.id
                    ).exists()  # noqa
                else:
                    app_has_component_perm = False
                channel_name = channel.name
                if is_official:
                    channel_name = _(channel_name)
                components.append(
                    {
                        "id": channel.id,
                        "name": html_escape(channel.component_name),
                        "label": html_escape(channel_name),
                        "perm_level": channel.perm_level,
                        "perm_level_label": channel.get_perm_level_display(),
                        "app_has_component_perm": app_has_component_perm,
                    }
                )

        self.response.payload = {"result": True, "data": components}
