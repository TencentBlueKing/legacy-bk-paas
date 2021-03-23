# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS
Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License.
You may obtain a copy of the License at http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
specific language governing permissions and limitations under the License.
"""

from builtins import range
from builtins import object
from django.conf import settings
from thrift.transport import TSSLSocket
from thrift.transport import TTransport
from thrift.protocol import TBinaryProtocol

from common.log import logger
from common.errors import CommonAPIError, RequestThirdPartyException
from esb.outgoing import RequestHelperClient
from lib.gse.procServer import ProcService
from common.bkerrors import bk_error_codes
from . import configs


socket_timeout = settings.REQUEST_TIMEOUT_SECS * 1000


class BaseGSEClient(object):
    """Base class for GSEclient
    """

    client_module = None
    transport_class = TTransport.TFramedTransport
    MAX_CONNECT_RETRIES = 3

    def __init__(self, host, port, use_test_env=False, component=None):
        """Initialize a client instance, call .connect() method before sending any request.

        :param <SmartHost> host: Host info should not contains port number
        :param int port: service port
        :param bool use_test_env: Use test env or not
        """
        self.thrift_client = None

        self.use_test_env = use_test_env
        self.thrift_host = host
        self.thrift_port = port
        self.component = component

    def connect(self):
        if self.thrift_client:
            self.transport.close()
            self.thrift_client = None

        for _ in range(self.MAX_CONNECT_RETRIES):
            try:
                # Get ip
                ip = self.thrift_host.get_value(self.use_test_env)

                # 使用双向证书保证安全性
                socket = TSSLSocket.TSSLSocket(
                    ip,
                    int(self.thrift_port),
                    validate=False,
                    ca_certs=configs.SERVER_CERT,
                    keyfile=configs.CLIENT_KEY,
                    certfile=configs.CLIENT_CERT,
                )

                socket.setTimeout(socket_timeout)
                self.transport = self.transport_class(socket)
                protocol = TBinaryProtocol.TBinaryProtocol(self.transport)
                self.thrift_client = self.client_module.Client(protocol)

                self.transport.open()
            except Exception:
                logger.exception(
                    "%s Cann't connect to GSE thrift server, host=%s:%s",
                    bk_error_codes.REQUEST_GSE_ERROR.code,
                    ip,
                    self.thrift_port,
                )
                self.thrift_client = None
                self.thrift_host.shift_host(use_test_env=self.use_test_env)
                continue
            break
        else:
            raise CommonAPIError("Fail to connect GSE service. Please check if GSE service is normal.")

    def close(self):
        if self.thrift_client:
            self.transport.close()
            self.thrift_client = None

    def supports_command(self, cmd):
        """Determine if client supports given command
        """
        return hasattr(self.thrift_client, cmd)


class GSEProcServerClient(BaseGSEClient):
    """Wrapped client class for ProcService
    """

    client_module = ProcService

    def __init__(self, *args, **kwargs):
        super(GSEProcServerClient, self).__init__(*args, **kwargs)
        # SSL使用TBufferedTransport, 非SSL使用TFramedTransport
        self.transport_class = TTransport.TBufferedTransport

    def request(self, command_str, args=[], kwargs={}):
        req_helper_client = RequestHelperClient(self.component)
        try:
            response = req_helper_client.request(
                self.thrift_client, action=command_str, args=args, kwargs=kwargs, is_response_parse=False
            )
        except RequestThirdPartyException, e:
            raise e
        except Exception:
            logger.exception("%s access gse service fail.", bk_error_codes.REQUEST_GSE_ERROR.code)
            raise CommonAPIError(
                "An exception occurred while requesting GSE service, please contact the GSE developer to handle it."
            )

        if response.error_code != 0:
            return {
                "result": False,
                "code": "1%s" % response.error_code,
                "message": u"Request GSE service failed: %s" % response.error_msg,
                "__tresp": response,
            }
        else:
            return {"result": True, "message": response.error_msg, "__tresp": response}
