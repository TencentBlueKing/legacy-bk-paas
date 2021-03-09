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


from django.conf import settings


def enum(**enums):
    return type(b"Enum", (), enums)


PaaSErrorCodes = enum(
    E1301000_DEFAULT_CODE=1301000,
    E1301001_BASE_SETTINGS_ERROR=1301001,
    E1301002_BASE_DATABASE_ERROR=1301002,
    E1301003_BASE_HTTP_DEPENDENCE_ERROR=1301003,
    E1301004_BASE_REDIS_ERROR=1301004,
    E1301005_BASE_PAASAGENT_ERROR=1301005,
    E1301006_BASE_RABBITMQ_ERROR=1301006,
    E1301007_BASE_BKSUITE_DATABASE_ERROR=1301007,
    E1301008_BASE_APPENGINE_ERROR=1301008,
    E1301100_PAASAGENT_COMMIT_TEST_DEPLOYMENT_FAIL=1301100,
    E1301101_PAASAGENT_COMMIT_PROD_DEPLOYMENT_FAIL=1301101,
    E1301102_PAASAGENT_NOT_INSTALLED=1301102,
    E1301103_PAASAGENT_NOT_HEALTH=1301103,
    E1301200_DEPENDENCE_REDIS_ERROR=1301200,
    E1301300_APP_SAAS_UPLOAD_FAIL=1301300,
)

ConsoleErrorCodes = enum(
    E1303000_DEFAULT_CODE=1303000,
    E1303001_BASE_SETTINGS_ERROR=1303001,
    E1303002_BASE_DATABASE_ERROR=1303002,
    E1303003_BASE_HTTP_DEPENDENCE_ERROR=1303003,
    E1303004_BASE_BKSUITE_DATABASE_ERROR=1303004,
    E1303005_BASE_LICENSE_ERROR=1303005,
    # 加载桌面应用错误
    E1303100_DESKTOP_USER_APP_LOAD_ERROR=1303100,
    # 应用市场查询应用失败
    E1303101_MARKET_APP_QUERY_FAIL=1303101,
    # 应用市场应用详情查询失败
    E1303102_MARKET_APP_DETAIL_QUERY_FAIL=1303102,
    # 请求微信GET接口出错
    E1303200_WEIXIN_HTTP_GET_REQUEST_ERROR=1303200,
    # 请求微信POST接口出错
    E1303201_WEIXIN_HTTP_POST_REQUEST_ERROR=1303201,
    # 微信公众号推送事件响应出错
    E1303202_WEIXIN_MP_EVENT_PUSH_RESPONSE_ERROR=1303202,
)


class PaaSException(Exception):
    code = 1301000
    message = u"PaaS系统异常"

    def __init__(self, code=None, message=None):
        if code is not None:
            self.code = code
        if message is not None:
            self.message = message

    def __str__(self):
        return "%s: %s" % (self.code, self.message)


# NOTE: 1.2版本暂时只用到了 - 日志状态码
# NOTE:  如果后续异常统一处理, 则全部声明为Exception后输出
class ExampleException(PaaSException):
    code = PaaSErrorCodes.E1301000_DEFAULT_CODE
    message = u"Paas Sample Exception"


class BaseSettingsError(PaaSException):
    code = PaaSErrorCodes.E1301001_BASE_SETTINGS_ERROR
    message = u"配置文件中配置项不正确"


class BaseDatabaseError(PaaSException):
    code = PaaSErrorCodes.E1301002_BASE_DATABASE_ERROR
    message = u"数据库访问存在问题"


class BaseHTTPDependenceError(PaaSException):
    code = PaaSErrorCodes.E1301003_BASE_HTTP_DEPENDENCE_ERROR
    message = u"第三方HTTP依赖存在问题"


class BaseRedisError(PaaSException):
    code = PaaSErrorCodes.E1301004_BASE_REDIS_ERROR
    message = u"依赖的Redis存在问题"


class BasePaaSAgentError(PaaSException):
    code = PaaSErrorCodes.E1301005_BASE_PAASAGENT_ERROR
    message = u"当前没有注册并激活的PaaSAgent服务器"


class BaseRabbitmqError(PaaSException):
    code = PaaSErrorCodes.E1301006_BASE_RABBITMQ_ERROR
    message = u"未注册并激活RabbitMQ服务"


class BaseBksuiteDatabaseError(PaaSException):
    code = PaaSErrorCodes.E1301007_BASE_BKSUITE_DATABASE_ERROR
    message = u"无法连接并访问bksuite数据库"


class BaseAppengineError(PaaSException):
    code = PaaSErrorCodes.E1301008_BASE_APPENGINE_ERROR
    message = u"App Engine 未正常启动或App Engine接口异常"


class PaaSAgentTestDeploymentError(PaaSException):
    code = PaaSErrorCodes.E1301100_PAASAGENT_COMMIT_TEST_DEPLOYMENT_FAIL
    message = u"测试部署事件提交失败！请确认 1.appengine服务正常[/v1/healthz/] 2.安装并注册了对应的agent服务器 3.第三方服务等正常 "


class PaaSAgentProdDeploymentError(PaaSException):
    code = PaaSErrorCodes.E1301101_PAASAGENT_COMMIT_PROD_DEPLOYMENT_FAIL
    message = u"正式部署事件提交失败！请确认 1.appengine服务正常[/v1/healthz/] 2.安装并注册了对应的agent服务器 3.第三方服务等正常 "


class PaaSAgentNotInstalledError(PaaSException):
    code = PaaSErrorCodes.E1301102_PAASAGENT_NOT_INSTALLED
    message = u"服务器上未安装Agent, 请安装Agent后重试"


class PaaSAgentNotHealthError(PaaSException):
    code = PaaSErrorCodes.E1301103_PAASAGENT_NOT_HEALTH
    message = (
        u"PaasAgent激活失败[%s], 可能原因:1) 对应机器上未安装PaaSAgent, 请按文档指引安装PaaSAgent后重试2) "
        u"部署PaasAgent未正常启动, 请查看日志定位原因"
        u"日志默认在 ${BK_HOME}/logs/paas_agent/agent.log"
    )


class DependenceRedisError(PaaSException):
    code = PaaSErrorCodes.E1301200_DEPENDENCE_REDIS_ERROR
    message = u"访问redis失败, 请确认配置文件中redis配置正确且对应redis服务可用"


class AppSaaSUploadError(PaaSException):
    code = PaaSErrorCodes.E1301300_APP_SAAS_UPLOAD_FAIL
    message = u"SaaS上传文件失败, 请确认 %s 路径 NFS 配置正确且权限正常(目录可读写)" % settings.MEDIA_ROOT
