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

import os
import tarfile
import json
from distutils.version import LooseVersion

from django.conf import settings
from django.db import transaction
from django.shortcuts import HttpResponse
from django.utils.translation import ugettext as gettext
from django.utils.translation import ugettext as _


from app.models import App, SecureInfo, AppTags
from app.constants import AppStateEnum, LanguageEnum
from app_env.models import AppEnvVar
from common.log import logger
from common.record import record_user_operate
from common.constants import (
    ModeEnum,
    DESKTOP_DEFAULT_APP_WIDTH,
    DESKTOP_DEFAULT_APP_HEIGHT,
    DESKTOP_DEFAULT_APP_IS_MAX,
    DESKTOP_DEFAULT_APP_IS_DISPLAY,
)
from common.exceptions import PaaSErrorCodes
from engine.api import register_app
from engine.models import BkServer
from engine.deploy import saas_app_to_online_task
from engine.utils import get_app_prod_deploy_servers, random_choose_servers
from release.models import Record
from release.constants import UserOperateTypeEnum
from saas.models import SaaSApp, SaaSAppVersion
from saas.constants import CREATE_PAAS_DB_SQL
from app_env.validators import validate_env_var_name, validate_env_var_value
from common.constants import SAAS_APP_LOGO_IMG_RELATED
from common.utils.db import execute_sql
from audit.utils import record_audit_log
from audit.constants import AuditEventOperationTypeEnum, AuditSystemEnum, AuditOPObjectTypeEnum

###############
#  saas list  #
###############


def update_app_state_in_list(app_list):
    from release.utils import update_app_state

    app_refresh_states = [AppStateEnum.IN_TEST, AppStateEnum.IN_ONLINE, AppStateEnum.IN_OUTLINE]

    to_refresh_app_list = [_app for _app in app_list if _app.state in app_refresh_states]
    for _app in to_refresh_app_list:
        _app_code = _app.code
        try:
            update_app_state(_app_code)
            # 获取更新后的应用信息
            _app = SaaSApp.objects.get(code=_app_code)
        except Exception:
            # 更新应用[%s]状态失败
            logger.exception(u"update saas [%s] status fail" % _app_code)


############
#  upload  #
############
def upload_response_tpl(is_upload_success, message, data={}):
    """
    将上传文件的结果通过js的方法返回渲染
    """
    span_type = "success" if is_upload_success else "danger"
    fa_type = "icon-check1" if is_upload_success else "icon-exclamation-triangle"
    app_code = data.get("app_code", "")

    link_html = (
        u"<a class='btn btn-success btn-lg deploy_btn' " u"href='{site_url}saas/release/online/{app_code}/'> {tag} </a>"
    ).format(site_url=settings.SITE_URL, app_code=app_code, tag=_(u"去部署"))

    if_success_show_link = ""
    if is_upload_success:
        if_success_show_link = 'window.parent.document.getElementById("to_deploy").innerHTML="' + link_html + '"'

    upload_response_format = u"""
    <script>
    window.parent.document.getElementById(\"import_msg\").innerHTML=
    \"<span class='text-{span_type}'><i class='bk-icon {fa_type} t_b'></i> {message}</span>\";
    {if_success_show_link}
    </script>
    """  # noqa

    response_tpl = upload_response_format.format(
        span_type=span_type,
        fa_type=fa_type,
        message=message,
        if_success_show_link=if_success_show_link,
    )
    response = HttpResponse()
    response["Content-Type"] = "text/html"
    response["charset"] = "utf-8"
    response.write(response_tpl)
    return response


def is_paas_version_too_low(app_name, platform_version):
    """
    判断paas的版本是否过低
    """
    if not platform_version:
        return False, "No platform_version"

    try:
        if LooseVersion(platform_version) > LooseVersion(settings.PLATFORM_VERSION):
            message = _(u"检测到您当前的社区版版本号为V%s，“%s”应用部署要求版本为V%s及以上，请先升级。如有疑问，可咨询在线客服。") % (
                settings.PLATFORM_VERSION,
                app_name,
                platform_version,
            )

            logger.info(message)
            message = (
                "It is detected that your current community version number is V%s and "
                "the %s application deployment requires a version of V%s and above"
            ) % (settings.PLATFORM_VERSION, app_name, platform_version)
            return True, message
    except Exception:
        logger.exception("platform_version compare fail")
        return False, "Compare Fail"
    return False, ""


@transaction.atomic
def save_saas_app_info(app_config, saas_upload_file):
    app_code = app_config.get("app_code")
    app_name = app_config.get("app_name")
    app_name_en = app_config.get("app_name_en")
    version = app_config.get("version")

    # FIXME: app_code / version / language / is_use validation

    language = app_config.get("language", "python").lower()

    is_use_celery = False
    is_use_celery_with_gevent = False
    if language != LanguageEnum.JAVA:
        is_use_celery = app_config.get("is_use_celery", True)
        is_use_celery_with_gevent = app_config.get("is_use_celery_with_gevent", False)

    # NOTE: new add 2017-12-20, to set env var
    container = app_config.get("container")

    author = app_config.get("author", "")
    introduction = app_config.get("introduction", "")
    introduction_en = app_config.get("introduction_en", "")
    category = app_config.get("category", "")
    language_support = app_config.get("language_support", "")

    # 2018-05-22 html_escape begin
    from common.utils.basic import html_escape

    app_name = html_escape(app_name)
    author = html_escape(author)
    introduction = html_escape(introduction)
    category = html_escape(category)
    language_support = html_escape(language_support)
    # 2018-05-22 html_escape end

    date = app_config.get("date")
    desktop = app_config.get("desktop")
    # 2019-03-12 add `env` section in app.yml
    env = app_config.get("env")
    try:
        if date:
            date = date.strftime("%Y-%m-%d %H:%M:%S")
    except Exception:
        date = str(date)

    libraries = app_config.get("libraries", [])
    yums = app_config.get("yums", [])

    pip = " ".join(["{name}=={version}".format(**d) for d in libraries])
    yum = " ".join(yums)

    settings = {
        "language": language,
        "is_use_celery": is_use_celery,
        "is_use_celery_with_gevent": is_use_celery_with_gevent,
        "container": container,
        "author": author,
        "introduction": introduction,
        "introduction_en": introduction_en,
        "name_en": app_name_en,
        "category": category,
        "language_support": language_support,
        "date": date,
        "pip": pip,
        "yum": yum,
        "desktop": desktop,
        "env": env,
    }

    # FIXME: bug here, 当一个上传saas改了app_name, 这里拿不到
    # start to save info
    # saas_app, created = SaaSApp.objects.get_or_create(code=app_code,
    #                                                   name=app_name)
    # NOTE： 这个可以解决新版本的问题, 但是saas改名在新版本验证通过, 可能在老版本部署失败
    # 另: 这个无法改名
    # saas_app, created = SaaSApp.objects.get_or_create(code=app_code)
    # if created:
    #     saas_app.name = app_name

    # NOTE: 2019-07-22 允许S-Mart改名
    saas_app, created = SaaSApp.objects.get_or_create(code=app_code)
    saas_app.name = app_name

    is_saas_app_exist = not created

    if is_saas_app_exist:
        saas_app_version, created = SaaSAppVersion.objects.get_or_create(
            version=version, saas_app=saas_app, defaults={"upload_file": saas_upload_file}
        )
    else:
        saas_app_version = SaaSAppVersion()
        saas_app_version.version = version
        saas_app_version.saas_app = saas_app

    saas_app_version.settings = json.dumps(settings)
    saas_app_version.upload_file = saas_upload_file
    saas_app_version.save()

    # 保存应用的当前版本信息
    saas_app.current_version = saas_app_version
    saas_app.save()

    return saas_app_version


def extract_logo_file(filename, path, saas_app_code):
    """
    解压tar.gz文件中的logo到 /media/saaslogo/
    """
    # check if a tar file
    try:
        tar_file = tarfile.open(path)
        tar_file_members = tar_file.getmembers()
    except Exception:
        message = (
            u"%s The file format is wrong and cannot be opened normally. Please re-upload after confirmation" % filename
        )
        logger.exception(message)
        message = _(u"%s 文件格式错误, 无法正常打开, 请确认后重新上传") % filename
        return False, message

    app_logo_name = "%s.png" % saas_app_code
    # end with /{app_code}.png and the location will be Python(len=3), Java(len=2)
    logo_path_list = [
        m.name for m in tar_file_members if m.name.endswith("/" + app_logo_name) and len(m.name.split("/")) in (3, 2)
    ]

    if not logo_path_list:
        message = u"%s There is no configuration file LOGO file in package: %s" % (filename, app_logo_name)
        logger.error(message)
        message = _(u"%s 包中缺少配置文件LOGO文件: %s") % (filename, app_logo_name)
        return False, message

    logo_path = logo_path_list[0]
    try:
        logo_file = tar_file.extractfile(logo_path)
        logo_content = logo_file.read()
        logo_local_path = os.path.join(settings.MEDIA_ROOT, SAAS_APP_LOGO_IMG_RELATED, app_logo_name)
        applogo_path = os.path.join(settings.MEDIA_ROOT, "applogo", app_logo_name)

        # 存在问题: 如果用户上传第一版本, 放入到applogo, 后面版本更新不会更新到applog
        # 需要做的: 可以比对applogo/saaslog中两个是否都存在且一致, 如果是, 全替换
        is_replace_applog = False
        if os.path.exists(logo_local_path) and os.path.exists(applogo_path):
            import filecmp

            is_replace_applog = filecmp.cmp(logo_local_path, applogo_path)

        # replace saaslogo/*.png
        with open(logo_local_path, "w") as logo_f:
            logo_f.write(logo_content)

        # if user not defined it, the put into applogo
        if not os.path.exists(applogo_path) or is_replace_applog:
            with open(applogo_path, "w") as logo_f:
                logo_f.write(logo_content)
    except Exception:
        message = u"%s Unzip to get app.yml failed" % filename
        logger.exception(message)
        message = _(u"%s 解压获取 app.yml 失败") % filename
        return False, message

    try:
        tar_file.close()
    except Exception:
        logger.exception()
    return True, _(u"处理成功")


#############
#  release  #
#############


def get_env_data(app_code, mode):
    saas_app = SaaSApp.objects.get(code=app_code)
    app_state = saas_app.state

    data = {
        "mode": mode,
        "app_code": app_code,
        "app_state": app_state,
        "app_state_display": saas_app.saas_state_display,
        "deployed_status": _(u"已发布") if saas_app.is_already_deployed(mode) else _(u"未部署"),
        "is_already_deployed": saas_app.is_already_deployed(mode),
    }

    saas_version = saas_app.get_saas_version(mode)
    data["version"] = saas_version.version if saas_version else u"--"

    version_list = SaaSAppVersion.objects.get_version_list(saas_app)
    data["version_list"] = version_list

    # add is_processing
    # app_state = 8 and mode=test
    # app_state = 9 and mode=prod
    data["is_outline_processing"] = False
    data["is_online_processing"] = False
    record = Record.objects.get_last_record(app_code)
    if record:
        extra_data = record.get_extra_data()
        record_mode = extra_data.get("mode")
        data["is_outline_processing"] = record_mode == mode and app_state == AppStateEnum.IN_OUTLINE

        # app_state = 10 => TODO: need to check finall event's mode
        is_online_processing = False
        if record_mode == mode:
            if mode == ModeEnum.TEST and app_state == AppStateEnum.IN_TEST:
                is_online_processing = True
            if mode == ModeEnum.PROD and app_state == AppStateEnum.IN_ONLINE:
                is_online_processing = True
        data["is_online_processing"] = is_online_processing

    return data


def saas_online_task(saas_app_version_id, username, mode, is_back=False, servers=None):  # noqa
    """
    SaaS应用部署操作
    放在 utils.py 中会循环引用，所以放在 views.py 中
    """
    if mode not in (ModeEnum.TEST, ModeEnum.PROD):
        msg = u"mode is invalid: [mode=%s]" % mode
        logger.info(msg)
        result = {"result": False, "msg": msg}
        return result

    server_description = _(u"测试服务器") if mode == ModeEnum.TEST else _(u"正式服务器")
    deploy_name = _(u"测试部署") if mode == ModeEnum.TEST else _(u"正式部署")
    tip = _(u" [蓝鲸智云-开发者中心-服务器信息] ") if is_back else _(u"<a href='/engine/servers/'> [蓝鲸智云-开发者中心-服务器信息] </a>")

    is_app_deployable = BkServer.objects.check_app_deployable(mode)
    if not is_app_deployable:
        msg = (
            "Currently, there is no [%s] available, so application deployment cannot be conducted. "
            "Please register and activate the server at %s"
        ) % (server_description, tip)
        logger.info(msg)
        msg = _(u"当前没有可用的[%s], 无法进行应用部署操作. 请到%s注册并激活服务器") % (server_description, tip)
        result = {"result": False, "msg": msg}
        return result

    try:
        saas_app_version = SaaSAppVersion.objects.get(id=saas_app_version_id)
    except SaaSAppVersion.DoesNotExist:
        return {"result": False, "msg": _(u"对应版本不存在, 无法进行部署")}

    saas_app = saas_app_version.saas_app
    app = saas_app.app
    is_new = not app
    # make a new one
    if not app:
        is_success, message, app = _create_app(saas_app_version)
        if not is_success:
            return {"result": False, "msg": message}

        # audit log here
        record_audit_log(
            system=AuditSystemEnum.PAAS,
            username=username,
            op_type=AuditEventOperationTypeEnum.CREATE,
            op_object_type=AuditOPObjectTypeEnum.SMART,
            op_object_id=app.code,
            op_object_name=app.name,
        )

        # 将 SaasApp 表 与 App表关联
        saas_app.app = app
        saas_app.save()

    # update
    is_success, message = _update_app(saas_app_version, mode)
    if not is_success:
        return {"result": False, "msg": message}

    # NOTE: 兼容之前没有测试环境创建db的. add saas app test db if not exists
    # 如果上面一步新建了, 则不创建了
    if not is_new and mode == ModeEnum.TEST:
        res, msg = _create_saas_app_db(app.code, mode=ModeEnum.TEST)
        if not res:
            return {"result": False, "msg": msg}

    # ========================================

    app_code = app.code
    logger.info(u"SaaS App[app:%s] start [%s]..." % (app_code, deploy_name))

    # 状态检测, 什么状态可以发布?
    # 只有[下架/开发/测试/上线]状态可操作
    if app.state not in [AppStateEnum.OUTLINE, AppStateEnum.DEVELOPMENT, AppStateEnum.TEST, AppStateEnum.ONLINE]:
        msg = u"SaaS App current status: %s, so deployment cannot be done!" % app.state_display
        logger.info(u"SaaS App[app:%s] %s" % (app_code, msg))

        msg = _(u"SaaS App应用当前状态：%s，不能进行部署操作！") % app.state_display
        result = {"result": False, "msg": msg}
        return result

    # NOTE: first time to deploy, without servers, from the backend api
    servers = [s for s in servers if s]
    if not servers and mode == ModeEnum.PROD:
        hostships, prod_servers = get_app_prod_deploy_servers(app_code)
        # if not fresh, use old hostships
        if hostships:
            servers = hostships
        else:
            servers = random_choose_servers(prod_servers)

    # 上线操作
    # NOTE: fix bug here, get the newest object because some changes have been saved
    newest_saas_app_version = SaaSAppVersion.objects.get(id=saas_app_version_id)
    is_success, event_id, message = saas_app_to_online_task(newest_saas_app_version, username, mode, servers)

    # 操作流水日志
    # TODO: add more info here
    extra_data = {"username": username}
    record_user_operate(
        app_code=app_code, username=username, operate_type=UserOperateTypeEnum.RELEASE_ONLINE, extra_data=extra_data
    )

    msg = (_(u"SaaS App%s事件提交成功！") % deploy_name) if is_success else message
    result = {"result": is_success, "msg": msg, "event_id": event_id, "app_code": app_code}

    logger.info(u"SaaS App[app:%s] %s event_id: %s" % (app_code, msg, event_id))
    return result


def _get_app_info_from_settings(app_code, saas_app_version):
    """
    从配置中解析得到app_info
    """
    settings = saas_app_version.get_settings()
    if not settings:
        msg = _(u"应用(code:%s)配置信息解析异常") % app_code
        return False, msg, None

    introduction = settings.get("introduction", "")
    introduction_en = settings.get("introduction_en", "")
    name_en = settings.get("name_en", "")
    language = settings.get("language", "python")
    is_use_celery = settings.get("is_use_celery", False)
    is_use_celery_with_gevent = settings.get("is_use_celery_with_gevent", False)
    author = settings.get("author", "")
    category = settings.get("category", u"其它")
    desktop = settings.get("desktop") or {}
    env = settings.get("env") or []
    container = settings.get("container") or {}

    # 1. 判断app_code是否重复了, 重复则报错
    app_info = {
        "introduction": introduction,
        "introduction_en": introduction_en,
        "name_en": name_en,
        "language": language,
        "is_use_celery": is_use_celery,
        "is_use_celery_beat": is_use_celery,
        "is_use_celery_with_gevent": is_use_celery_with_gevent,
        "author": author,
        "category": category,
        "desktop": desktop,
        "container": container,
        "env": env,
    }

    return True, "success", app_info


def _create_app(saas_app_version):
    """
    新建一个app, 创建数据库, 并将其关联到SaaSApp
    仅有基本信息

    关系1: SaaSApp -> SaaSAppVersion -> SaaSUploadFile
    关系2: SaaSApp -> App
    """
    saas_app = saas_app_version.saas_app
    app_code = saas_app.code
    app_name = saas_app.name

    # 1. get app_info
    is_success, msg, app_info = _get_app_info_from_settings(app_code, saas_app_version)
    if not is_success:
        return False, msg, None
    # 2. 创建App /  AppTags
    res, msg, app = _save_app_info(app_code, app_name, is_create=True, **app_info)
    if not res:
        return False, msg, None

    # 3. 创建数据库, 并将数据库信息存入SecureInfo
    res, msg = _create_saas_app_db(app_code, mode=ModeEnum.PROD)
    if not res:
        # 创建SaaS应用失败，则删除 对应的App
        App.objects.filter(code=app_code).delete()
        return False, msg, None

    res, msg = _create_saas_app_db(app_code, mode=ModeEnum.TEST)
    if not res:
        # 创建SaaS应用失败，则删除 对应的App
        App.objects.filter(code=app_code).delete()
        return False, msg, None

    saas_app.save()

    return True, "success", app


def _update_app(saas_app_version, mode):
    """
    更新app
    language / is_use_celery / language / version等字段
    """
    saas_app = saas_app_version.saas_app
    app_code = saas_app.code

    is_success, msg, app_info = _get_app_info_from_settings(app_code, saas_app_version)
    if not is_success:
        return False, msg, None

    res, msg, app = _save_app_info(saas_app.code, saas_app.name, is_create=False, **app_info)
    if not res:
        return res, msg

    # 2. 更新当前处理时版本, 上线成功后, 更新 online_version=current_version
    # NOTE: update current version while deploy
    SaaSApp.objects.update_current_version(app, mode, saas_app_version)
    return True, "success"


def _add_or_update_env(app_code, name, value, override=True):
    """
    添加环境变量
    """
    # if has all, the update
    if AppEnvVar.objects.filter(app_code=app_code, mode=ModeEnum.ALL, name=name).exists():
        if override:
            env_var = AppEnvVar.objects.get(app_code=app_code, mode=ModeEnum.ALL, name=name)
            env_var.value = value
            env_var.save()
    # if has one of test or prod, update another
    # if has none, add one
    # elif AppEnvVar.objects.filter(app_code=app_code, mode__in=(ModeEnum.PROD, ModeEnum.TEST), name=name).exists():
    else:
        AppEnvVar.objects.filter(app_code=app_code, mode__in=(ModeEnum.PROD, ModeEnum.TEST), name=name).delete()
        env_var = AppEnvVar.objects.create(
            app_code=app_code, mode=ModeEnum.ALL, name=name, value=value, intro="set by S-mart App"
        )


def _save_app_info(code, name, is_create=True, **app_info):  # noqa
    """
    将app的基本信息存入到 paas_app 表中

    如：code、name、introduction 等
    code 重复 则直接返回异常由上层处理
    name 重复 则直接保存code信息
    """
    if not code:
        return False, u"缺少参数：code", None

    # 输入时已经校验正确性, 及转小写
    language = app_info.get("language")

    if is_create:
        # 本地开发时，不调用app engine
        if settings.DEBUG:
            is_success, register_result = True, {"token": "123"}
        else:
            # 新应用，需要在engine 上注册应用信息，获取auth_token
            is_success, register_result = register_app(code, name, language)

        token = register_result.get("token", "") if register_result else ""
        if not (is_success and token):
            error_msg = u"%s SaaS [%s] register fail, error:%s. reason(maybe):App Engine 未正常启动" % (
                PaaSErrorCodes.E1301008_BASE_APPENGINE_ERROR,
                code,
                register_result,
            )
            logger.error(error_msg)
            error_msg = gettext(u"%s 应用[%s]注册失败, 失败信息:%s. 可能原因:App Engine 未正常启动") % (
                PaaSErrorCodes.E1301008_BASE_APPENGINE_ERROR,
                code,
                register_result,
            )
            return False, error_msg, None

    with transaction.atomic():
        # 创建应用
        if is_create:
            try:
                app = App.objects.create(code=code)
                app.auth_token = token
            except Exception:
                logger.exception(u"App code (%s) already exists in the app table" % code)
                return False, gettext(u"SaaS 应用ID[%s]与已有 PaaS 应用ID冲突") % code, None
        else:
            app, _ = App.objects.get_or_create(code=code)

        # name 重复则或为空 直接保存code的信息, 还重复则直接返回异常
        try:
            old_name = app.name
            is_name_exist = App.objects.filter(name=name).exclude(name=old_name).exists()
            app.name = code if (is_name_exist or not name) else name
            app.save()
        except Exception:
            logger.exception(u"App name (%s) already exists in the app table" % name)
            return False, gettext(u"SaaS 应用名称[%s]与已有应用名称冲突") % name, None

        # 保存应用基本信息
        app.is_saas = True
        app.language = language
        app.introduction = app_info.get("introduction")

        app.is_use_celery = app_info.get("is_use_celery")
        app.is_use_celery_beat = app_info.get("is_use_celery")
        app.creater = app_info.get("author")
        # update desktop width/height
        desktop = app_info.get("desktop") or {}

        app.width = desktop.get("width", DESKTOP_DEFAULT_APP_WIDTH)
        app.height = desktop.get("height", DESKTOP_DEFAULT_APP_HEIGHT)
        app.is_max = desktop.get("is_max", DESKTOP_DEFAULT_APP_IS_MAX)
        app.is_display = desktop.get("is_display", DESKTOP_DEFAULT_APP_IS_DISPLAY)

        if app_info.get("name_en"):
            app.name_en = app_info.get("name_en")
        if app_info.get("introduction_en"):
            app.introduction_en = app_info.get("introduction_en")

        # update category
        new_app_tag_name = app_info.get("category", u"其它")
        new_app_tag = AppTags.objects.get_target_tag_or_default(new_app_tag_name)

        # update
        if app.tags and app.tags.name != new_app_tag_name:
            app.tags = new_app_tag
        # new
        if not app.tags:
            app.tags = new_app_tag

        app.save()

        # 保存应用db信息
        paas_db = settings.DATABASES.get("default", {})

        app_sec_info, _ = SecureInfo.objects.get_or_create(app_code=code)
        app_sec_info.db_host = paas_db.get("HOST")
        # 2019-01-03 fix the port not equal 3306 here
        app_sec_info.db_port = paas_db.get("PORT")
        app_sec_info.db_username = paas_db.get("USER")
        app_sec_info.db_password = paas_db.get("PASSWORD")
        # 数据库名称修改为：应用code
        app_sec_info.db_name = code
        app_sec_info.save()

        # 更新env var环境变量
        try:
            is_use_celery_with_gevent = app_info.get("is_use_celery_with_gevent")
            if is_use_celery_with_gevent:
                _add_or_update_env(code, "BKAPP_IS_USE_CELERY_WITH_GEVENT", True)
            else:
                _add_or_update_env(code, "BKAPP_IS_USE_CELERY_WITH_GEVENT", False)
        except Exception:
            logger.exception(u"app update env var fail: %s" % code)

        try:
            container = app_info.get("container")
            if container and container.get("memory"):
                try:
                    memory = int(container.get("memory"))
                except Exception:
                    memory = 512
                _add_or_update_env(code, "BKAPP_CONTAINER_MEM", memory, False)
        except Exception:
            logger.exception(u"app update env var fail: %s" % code)

        try:
            env = app_info.get("env")
            if env:
                for _d in env:
                    key = _d.get("key")
                    value = _d.get("value")

                    # validate key/value
                    is_valid, message = validate_env_var_name(key)
                    if not is_valid:
                        logger.error(u"wrong env key [%s] in app.yml: %s" % (key, message))
                        continue
                    if not key.startswith("BKAPP_"):
                        logger.error(u"wrong env key [%s] in app.yml is not starts with BKAPP_" % key)
                        continue

                    if isinstance(value, unicode):
                        value = value.encode("utf-8")

                    value = str(value)
                    is_valid, message = validate_env_var_value(value)
                    if not is_valid:
                        logger.error(u"wrong env value [%s] in app.yml: %s" % (value, message))
                        continue

                    _add_or_update_env(code, key, value)
        except Exception:
            logger.exception(u"app update env var fail: %s" % code)

    return True, "", app


def _create_saas_app_db(app_code, mode):
    """
    给SaaS应用创建db信息

    db的用户信息跟平台保持一致
    """
    # 获取平台的 db 配置信息
    if mode == ModeEnum.PROD:
        secure_info, created = SecureInfo.objects.get_or_create(app_code=app_code)
        db_name = secure_info.db_name
    else:
        # 注意, saas 应用的测试库, 是特殊的, 其db_name并没有被存下来
        # 注意: db_name限制是64个字符 reference https://dev.mysql.com/doc/refman/5.5/en/identifiers.html
        db_name = "%s_bkt" % app_code

    create_sql = CREATE_PAAS_DB_SQL % db_name
    res, msg = execute_sql("default", create_sql)
    # 创建失败提示用户到基本信息页面手动修改 db 信息
    if not res:
        base_url = "{}/saas/info/{}".format(settings.SITE_URL, app_code)
        msg = _(u"创建应用db失败，请手动创建db后，点击 <a href='{}'>这里</a> 修改配置信息后重新部署").format(base_url)
    return res, msg


############
#  delete  #
############


@transaction.atomic
def delete_saas_app(app_code, username):
    """
    清除应用
    """
    saas_app = SaaSApp.objects.get(code=app_code)

    app_name = saas_app.name

    if saas_app.state not in [1]:
        return False, u"应用已经部署过, 无法进行删除操作"

    saas_app.app = None
    saas_app.current_version = None
    saas_app.online_version = None
    saas_app.current_test_version = None
    saas_app.test_version = None
    saas_app.save()

    # 删除 app 表中的应用
    try:
        SecureInfo.objects.filter(app_code=app_code).delete()
        App.objects.filter(code=app_code).delete()
        # 将APP的发布记录保存为上一次，避免下次创建时显示冲突
        Record.objects.filter(app_code=app_code).update(version="last")
        logger.info(u"[app:%s] 删除成功" % (app_code))

        # audit log
        record_audit_log(
            system=AuditSystemEnum.PAAS,
            username=username,
            op_type=AuditEventOperationTypeEnum.DELETE,
            op_object_type=AuditOPObjectTypeEnum.SMART,
            op_object_id=app_code,
            op_object_name=app_name,
        )
    except Exception:
        msg = u"App delete failed"
        logger.exception(u"[app:%s] %s" % (app_code, msg))

        msg = _(u"应用删除失败！")
        return False, msg

    try:
        versions = SaaSAppVersion.objects.filter(saas_app=saas_app).all()
        for version in versions:
            upload_file = version.upload_file
            upload_file.file.delete()
            upload_file.delete()
            version.delete()
        saas_app.delete()
    except Exception:
        message = u"Delete SaaSApp related data failed, app_code=%s" % app_code
        logger.exception(message)
        message = _(u"删除 SaaSApp 相关数据失败, app_code=%s") % app_code
        return False, message

    # 操作流水日志
    extra_data = {"username": username}
    record_user_operate(
        app_code=app_code, username=username, operate_type=UserOperateTypeEnum.APP_DELETE, extra_data=extra_data
    )

    return True, _(u"应用删除成功")


############
#  others  #
############


def update_online_version(app_code, mode):
    """
    更新 在线版本 为 处理前版本
    """
    logger.info(u"update SaaSApp's online_version: %s, mode=%s" % (app_code, mode))
    try:
        app = App.objects.get(code=app_code)
        SaaSApp.objects.update_online_version(app, mode)
    except Exception:
        logger.exception(u"update SaaSApp's online_version fail. app_code=%s" % app_code)
        return False
    return True
