# -*- coding: utf-8 -*-
import time

from django import forms

from common.forms import BaseComponentForm
from components.component import Component
from .toolkit import configs


class Detect(Component):
    """心跳探测，测试用"""

    sys_name = configs.SYSTEM_NAME

    class Form(BaseComponentForm):
        timestamp = forms.IntegerField(label="timestamp", required=True)
        sleep_time = forms.IntegerField(label="sleep time", required=False)

    def handle(self):
        if self.form_data.get("sleep_time"):
            time.sleep(self.form_data["sleep_time"])

        self.response.payload = {
            "result": True,
            "data": {
                "timestamp": self.form_data["timestamp"],
                "now": int(time.time()),
            },
        }
