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

import json
import time
import urlparse
import socket
from urlparse import urljoin

import requests
from requests.exceptions import ReadTimeout, SSLError
from django.utils.encoding import smart_str
from django.utils import timezone
from django.conf import settings

from common.base_utils import FancyDict, datetime_format
from common.bkerrors import bk_error_codes
from common.errors import (
    RequestThirdPartyException,
    TestHostNotFoundException,
    request_third_party_error_codes,
    RequestSSLException,
)
from common.log import logger, logger_api
from esb.bkapp.models import BKApp
from esb.utils.jwt_utils import JWTClient
from .utils import SmartHost, get_ssl_root_dir

"""
All outgoing requests:
"""

REQUEST_TIMEOUT_SECS = settings.REQUEST_TIMEOUT_SECS
STATUS_CODE_OK = 200
RESP_LIMIT_SIZE = 4096


class RequestsWrapper(object):
    """
    Wrapper for Requests
    """

    def request(self, *args, **kwargs):
        response_encoding = kwargs.pop("response_encoding", None)
        # 设置超时时间
        timeout = kwargs.get("timeout") or REQUEST_TIMEOUT_SECS
        # 默认不验证证书的正确性
        kwargs.update(timeout=timeout, verify=False)

        resp = requests.request(*args, **kwargs)

        # 如果指定了返回内容的编码格式，使用之
        if response_encoding:
            resp.encoding = response_encoding
        return {
            "text": resp.text,
            "status_code": resp.status_code,
            "headers": resp.headers,
            "reason": resp.reason,
        }


def get_current_http_wrapper():
    return RequestsWrapper()


def encode_dict(d, encoding="utf-8"):
    """
    使用指定的编码来编码给定的字典，否则使用urlencode方法的时候会报编码错误

    :param dict d: 需要转换编码的字典对象
    :param str encoding: 需要转换的目标编码
    """
    result = {}
    for k, v in d.iteritems():
        if isinstance(v, unicode):
            result[k] = v.encode(encoding)
        else:
            result[k] = v
    return result


class BasicHttpClient(object):
    """
    A very basic HTTP Client
    """

    @property
    def smart_http_client(self):
        return get_current_http_wrapper()

    def request(self, *args, **kwargs):
        """
        直接使用 _request 方法来发送请求
        """
        return self._request(*args, **kwargs)

    def request_by_url(self, method, url, *args, **kwargs):
        """
        使用一个完整的 url 来替代 host 和 path 参数
        """
        parsed_url = urlparse.urlparse(url)
        host = "%s://%s" % (parsed_url.scheme, parsed_url.netloc)
        return self.request(method, host, parsed_url.path, *args, **kwargs)

    def _request(
        self,
        method,
        host,
        path,
        params=None,
        data=None,
        headers={},
        response_type="json",
        max_retries=0,
        response_encoding=None,
        request_encoding=None,
        use_test_env=False,
        verify=False,
        cert=None,
        timeout=None,
        allow_non_200=False,
        files=None,
    ):
        """
        Send a request to given destination

        :param str method: One of "GET/POST"
        :param str host: host, such as "http://www.qq.com/"
        :param str path: request path, like "/account/login/"
        :param str/dict params: params in query string
        :param str/dict data: data to send in POST request
        :param str response_type: type of response, can be one of "json"
        :param int max_retries: 最多可以重试的次数，默认为0，不重试
        :param str response_encoding: 结果内容的编码，默认自动猜测
        :param str request_encoding: 请求参数编码
        :param str/bool verify: 是否校验crt
        :param string/tuple: 传递客户端crt和key
        :param int timtout: 超时时间
        :returns: response
        """
        url = self.make_url(host, path, use_test_env=use_test_env)
        request_exception = None
        resp, resp_status_code, resp_text = None, -1, ""
        result = None

        # 编码请求参数
        params_to_send, data_to_send = params, data
        if request_encoding:
            if isinstance(params, dict):
                params_to_send = encode_dict(params, encoding=request_encoding)
            if isinstance(data, dict):
                data_to_send = encode_dict(data, encoding=request_encoding)

        try:
            client = self.smart_http_client
            logger.debug(
                "Starting request to url=%s, params=%s, data=%s, headers=%s", url, params, data, json.dumps(headers)
            )
            resp = client.request(
                method,
                url,
                params=params_to_send,
                data=data_to_send,
                headers=headers,
                response_encoding=response_encoding,
                verify=verify,
                cert=cert,
                timeout=timeout,
                files=files,
            )
            resp_text = resp["text"]
            resp_status_code = resp["status_code"]

            logger.debug("Response from url=%s, params=%s, data=%s, response=%s", url, params, data, resp_text)

            # Check response status
            if not allow_non_200 and resp_status_code != STATUS_CODE_OK:
                status_code = "STATUS_CODE_%s" % resp_status_code
                raise Exception(
                    "Status Code: %s, Error Message: %s"
                    % (
                        resp_status_code,
                        request_third_party_error_codes.error_codes.get(
                            status_code, "Third-party system interface is abnormal, %s" % resp["reason"]
                        ),
                    )
                )
        except Exception as e:
            logger.exception(
                "%s Error occured when sending request to %s", bk_error_codes.REQUEST_THIRD_PARTY_ERROR.code, url
            )
            if isinstance(e, ReadTimeout):
                request_exception = ReadTimeout(
                    "Third-party system interface response time exceeds %s seconds" % (timeout or REQUEST_TIMEOUT_SECS)
                )
            else:
                request_exception = e

            # 如果请求失败，而且max_retries > 0，尝试重试请求
            if max_retries > 0:
                seconds_wait = 1
                max_retries -= 1

                # 在请求异常发生时，尝试漂移host地址
                if isinstance(host, SmartHost):
                    logger.info("Shift request host for %s", url)
                    host.shift_host(use_test_env=use_test_env)

                logger.info("Will Retry request after %s seconds, remaining retries = %s", seconds_wait, max_retries)
                time.sleep(seconds_wait)
                return self._request(
                    method,
                    host,
                    path,
                    params,
                    data,
                    headers,
                    response_type,
                    max_retries,
                    response_encoding,
                    request_encoding,
                    use_test_env,
                )

        else:
            try:
                result = self.format_resp(resp_text, response_type=response_type)
            except Exception as e:
                logger.exception(
                    u"%s resp_text: %s, response_type: %s",
                    bk_error_codes.THIRD_PARTY_RESP_ERROR.code,
                    resp_text,
                    response_type,
                )
                request_exception = e

        return FancyDict(
            url=url,
            resp=resp,
            resp_status_code=resp_status_code,
            resp_text=resp_text,
            result=result,
            request_exception=request_exception,
        )

    # GET/POST requests

    def get(self, *args, **kwargs):
        return self.request("GET", *args, **kwargs)

    def post(self, *args, **kwargs):
        return self.request("POST", *args, **kwargs)

    @staticmethod
    def make_url(host, path, use_test_env):
        # Tranform SmartHost object to str type
        if isinstance(host, SmartHost):
            # 当访问测试环境时，如果Smarthost并没有用于测试环境下的地址，抛出异常
            if use_test_env and not host.has_test_host():
                raise TestHostNotFoundException("Error, the system does not provide test environment")

            host = host.get_value(use_test_env=use_test_env)

        # Add prefix for host if not given, default to http:
        if not host.startswith("http"):
            host = "http://%s" % host
        return urljoin(host, path)

    @staticmethod
    def format_resp(resp_text, encoding="utf-8", response_type="json"):
        """
        Format the given response
        """
        if response_type == "json":
            try:
                return json.loads(resp_text)
            except Exception:
                raise ValueError("interface response is not the JSON format")

        return resp_text


class HttpClient(BasicHttpClient):
    """
    Send outgoing HTTP request
    """

    DEFAULT_HEADERS = [
        "Blueking-Language",
        "Blueking-Timezone",
        # for OpenTelemetry
        "Traceparent",
    ]

    def __init__(self, component):
        self.component = component

    def get_default_headers(self):
        try:
            request_headers = self.component.request.headers
        except Exception:
            return {}

        if not isinstance(request_headers, dict):
            return {}

        return dict([(key, request_headers[key]) for key in self.DEFAULT_HEADERS if key in request_headers])

    def prepare_bk_header(self, headers={}, with_jwt_header=False):
        bkapi_headers = {}
        if self.component.request:
            bkapi_headers["X-Bkapi-Request-Id"] = self.component.request.request_id

            if with_jwt_header:
                jwt_client = JWTClient(
                    BKApp(self.component.request.app_code, verified=True), self.component.current_user
                )
                bkapi_headers["X-Bkapi-JWT"] = jwt_client.encode()

        request_headers = {}
        request_headers.update(self.get_default_headers())
        request_headers.update(bkapi_headers)
        request_headers.update(headers)
        return request_headers

    def request(
        self,
        method,
        host,
        path,
        params=None,
        data=None,
        headers={},
        response_type="json",
        max_retries=0,
        response_encoding=None,
        request_encoding=None,
        verify=False,
        cert=None,
        timeout=None,
        allow_non_200=False,
        files=None,
        with_jwt_header=False,
    ):
        """Send a request to given destination
        """
        datetime_start = timezone.now()
        # 判断component是否被request初始化过，如果没有，默认访问正式环境，而且request_id为None
        if self.component.request:
            app_code = self.component.request.app_code
            use_test_env = self.component.request.use_test_env
            request_id = self.component.request.request_id
            # 超时时长
            timeout_time = self.component.request.timeout
        else:
            app_code = ""
            use_test_env = False
            request_id = None
            timeout_time = None

        system_name = self.component.sys_name
        component_name = self.component.get_alias_name()

        # 处理超时时间
        if not timeout:
            timeout = timeout_time if timeout_time else REQUEST_TIMEOUT_SECS

        req_headers = self.prepare_bk_header(headers, with_jwt_header=with_jwt_header)

        # 调用BasicHttpClient.request来发送请求
        r = self._request(
            method,
            host,
            path,
            params,
            data,
            req_headers,
            response_type,
            max_retries,
            response_encoding,
            request_encoding,
            use_test_env=use_test_env,
            verify=verify,
            cert=cert,
            timeout=timeout,
            allow_non_200=allow_non_200,
            files=files,
        )

        if r.resp_status_code == 200 and not r.request_exception:
            response_to_log = r.resp_text[:RESP_LIMIT_SIZE]
        else:
            response_to_log = r.resp_text
        params = params or data
        if not isinstance(params, basestring):
            params = json.dumps(params)
        datetime_end = timezone.now()
        msecs_cost = (datetime_end - datetime_start).total_seconds() * 1000
        exception_name = smart_str(r.request_exception) if r.request_exception else None

        try:
            api_log = {
                "message": "Request outgoing finished, method=%s url=%s" % (method, r.url),
                "type": "pyls-comp-api",
                "request_id": request_id,
                "req_app_code": app_code,
                "req_system_name": system_name,
                "req_component_name": component_name,
                "req_url": r.url,
                "req_params": params,
                "req_status": r.resp_status_code if r.resp else -1,
                "req_response": response_to_log,
                "req_exception": exception_name,
                "req_msecs_cost": int(msecs_cost),
                "req_start_time": datetime_format(datetime_start),
                "req_end_time": datetime_format(datetime_end),
            }
            # 添加访问记录
            logger_api.info(json.dumps(api_log))
        except Exception, e:
            logger.warning(u"logger api exception: %s" % e)

        # 为了记录这一次请求的api log，延迟抛出异常
        # UPDATE: xx系统xx接口出错,状态码: xx,错误消息:xx
        if r.request_exception:
            if isinstance(r.request_exception, SSLError):
                r.request_exception.cert = cert
                r.request_exception.SSL_ROOT_DIR = get_ssl_root_dir()
                logger.error(
                    u"%s request third party SSLError, system_name: %s, ssl_root_dir: %s",
                    bk_error_codes.REQUEST_SSL_ERROR.code,
                    system_name,
                    r.request_exception.SSL_ROOT_DIR,
                )
                raise RequestSSLException(r.request_exception, system_name=system_name, interface_name=component_name)
            else:
                raise RequestThirdPartyException(
                    r.request_exception, system_name=system_name, interface_name=component_name
                )
        return r.result

    def request_by_url(self, method, url, *args, **kwargs):
        """
        使用一个完整的 url 来替代 host 和 path 参数
        """
        parsed_url = urlparse.urlparse(url)
        host = "%s://%s" % (parsed_url.scheme, parsed_url.netloc)
        path = "%s?%s" % (parsed_url.path, parsed_url.query) if parsed_url.query else parsed_url.path
        return self.request(method, host, path, *args, **kwargs)


class RequestHelperClient(BasicHttpClient):
    """Send outgoing request helper, Add Log"""

    def __init__(self, component):
        self.component = component

    def request(self, handler, action="", args=[], kwargs={}, timeout=None, api_name="", is_response_parse=True):  # noqa
        datetime_start = timezone.now()
        # 判断component是否被request初始化过，如果没有，默认为访问正式环境，
        # 而且request_id为None
        if self.component and self.component.request:
            app_code = self.component.request.app_code
            timeout_time = self.component.request.timeout
            request_id = self.component.request.request_id
        else:
            app_code = None
            timeout_time = None
            request_id = None

        if self.component:
            system_name = self.component.sys_name
            component_name = api_name or self.component.get_alias_name()
        else:
            system_name = ""
            component_name = ""

        # 获取组件的超时时间
        # 如果请求的接口中指定了超时时间，则以传递的timeout为准
        if not timeout:
            timeout = timeout_time if timeout_time else REQUEST_TIMEOUT_SECS

        # 发送请求
        request_url = ""
        request_exception = None
        request_params = {"action": action, "args": args, "kwargs": kwargs}
        resp_text = ""
        resp_status_code = -1
        result = None
        try:
            if action:
                resp = getattr(handler, action)(*args, **kwargs)
            else:
                resp = handler(*args, **kwargs)
        except Exception, e:
            logger.exception(
                "%s error occured when request sys_name: %s, component_name: %s",
                bk_error_codes.REQUEST_THIRD_PARTY_ERROR.code,
                system_name,
                component_name,
            )
            # for SOAPTimeoutError
            if isinstance(e, socket.timeout):
                request_exception = ReadTimeout(
                    "Third-party system interface response timeout, " "did not return data in %s seconds" % timeout
                )
            else:
                request_exception = e
        else:
            if is_response_parse:
                request_url = resp.get("request_url", "")
                request_exception = resp.get("request_exception", None)
                request_params = resp.get("request_params") if hasattr(resp, "request_params") else request_params
                resp_text = resp.get("resp_text", "")
                resp_status_code = resp.get("resp_status_code", -1)
                result = resp.get("result")
            else:
                resp_status_code = 200
                if isinstance(resp, basestring):
                    resp_text = resp
                else:
                    try:
                        resp_text = json.dumps(resp)
                    except Exception:
                        resp_text = str(resp)

                result = resp

        # 限制写入日志的response大小不超过一定大小
        if resp_status_code == 200 and not request_exception:
            response_to_log = resp_text[:RESP_LIMIT_SIZE]
        else:
            response_to_log = resp_text
        if not isinstance(request_params, basestring):
            try:
                request_params = json.dumps(request_params)
            except Exception:
                request_params = str(request_params)
        datetime_end = timezone.now()
        msecs_cost = (datetime_end - datetime_start).total_seconds() * 1000
        exception_name = smart_str(request_exception) if request_exception else None

        # Log to logstash, Use type="pyls-comp-api"
        try:
            api_log = {
                "message": "Request outgoing finished, method=%s url=%s" % ("POST", request_url),
                "type": "pyls-comp-api",
                "request_id": request_id,
                "req_app_code": app_code,
                "req_system_name": system_name,
                "req_component_name": component_name,
                "req_params": request_params,
                "req_status": resp_status_code,
                "req_response": response_to_log,
                "req_exception": exception_name,
                "req_msecs_cost": int(msecs_cost),
                "req_start_time": datetime_format(datetime_start),
                "req_end_time": datetime_format(datetime_end),
            }
            # 添加访问记录
            logger_api.info(json.dumps(api_log))
        except Exception, e:
            logger.warning(u"logger api exception: %s" % e)

        # 为了记录这一次请求的api log，延迟抛出异常
        # UPDATE: xx系统xx接口出错,状态码: xx,错误消息:xx
        if request_exception:
            raise RequestThirdPartyException(
                request_exception, system_name=system_name, interface_name=component_name,
            )
        return result
