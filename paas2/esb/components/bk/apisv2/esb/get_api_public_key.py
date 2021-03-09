# -*- coding: utf-8 -*-
from common.constants import API_TYPE_Q, HTTP_METHOD
from components.component import Component
from esb.utils.jwt_utils import JWTKey

from .toolkit import configs


class GetApiPublicKey(Component):
    suggest_method = HTTP_METHOD.GET
    label = u"获取公钥"
    label_en = "Get api public key"

    sys_name = configs.SYSTEM_NAME
    api_type = API_TYPE_Q

    def handle(self):
        public_key = JWTKey().get_public_key()

        self.response.payload = {
            "result": True if public_key else False,
            "data": {
                "public_key": public_key,
            },
        }
