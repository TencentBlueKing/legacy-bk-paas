# -*- coding: utf-8 -*-
import json
import re

from esb.utils.base import has_path_vars
from esb.utils import SmartHost
from common.errors import error_codes
from components.component import BaseComponent, SetupConfMixin
from .toolkit import configs


class Datav3Component(BaseComponent, SetupConfMixin):

    sys_name = configs.SYSTEM_NAME
    host = configs.host

    def get_host(self):
        try:
            dest_path_prefix = re.match(r"/v3/([a-z]+)/?", self.dest_path).group(1)
        except Exception:
            raise error_codes.BUFFET_CANNOT_FORMAT_PATH.format_prompt(
                "The component's destination request path format error, "
                "please contact the component developer to handle it.",
                replace=True,
            )

        # 此处需要根据前缀，分发不同的域名
        host = configs.v3_dest_host_map.get(dest_path_prefix)
        if not host:
            raise error_codes.BUFFET_CANNOT_FORMAT_PATH.format_prompt(
                "The component's destination request path is not supported, "
                "please contact the component developer to handle it.",
                replace=True,
            )
        return SmartHost(host_prod=host)

    def handle(self):
        self.host = self.get_host()

        # 替换目标地址中的变量模版
        path = self.dest_path
        if has_path_vars(self.dest_path):
            path_vars = self.request.path_vars and self.request.path_vars.val_dict or {}
            try:
                path = self.dest_path.format(**path_vars)
            except KeyError, e:
                raise error_codes.BUFFET_CANNOT_FORMAT_PATH.format_prompt("{%s}" % e.args[0])

        # 请求参数
        params, data, files = None, None, None
        if self.dest_http_method == "GET":
            params = self.request.get_clean_params()
            headers = {"Content-Type": "application/x-www-form-urlencoded"}
        elif (
            "multipart/form-data" in self.request.wsgi_request.META.get("CONTENT_TYPE", "")
            and self.request.wsgi_request.FILES
        ):
            data = self.request.kwargs
            files = self.request.wsgi_request.FILES
            headers = {}
        else:
            data = json.dumps(self.request.kwargs)
            headers = {"Content-Type": "application/json"}

        # 请求接口
        response = self.outgoing.http_client.request(
            self.dest_http_method,
            self.host,
            path,
            params=params,
            data=data,
            files=files,
            headers=headers,
            with_jwt_header=True,
            timeout=600,
        )
        self.response.payload = response
