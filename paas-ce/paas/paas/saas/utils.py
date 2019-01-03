# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

from __future__ import unicode_literals

import json
import os
import tarfile

from django.conf import settings
from django.db import connections, transaction
from django.shortcuts import HttpResponse
from django.utils.html import escape

from app.constants import AppStateEnum
from app.models import App, SecureInfo
from common.constants import LogoImgRelatedDirEnum
from common.log import logger
from components.engine import register_app
from engine.deploy import saas_app_to_online_task
from engine.models import BkServer
from release.constants import UserOperateTypeEnum
from release.models import Record
from release.utils import record_user_operate
from saas.constants import CREATE_PAAS_DB_SQL, UPLOAD_RESPONSE_FORMAT
from saas.models import SaaSApp, SaaSAppVersion


def _get_file_from_tar_file(filename, path, match_func):
    # check if a tar file
    try:
        tar_file = tarfile.open(path)
    except Exception:
        message = "%s 文件格式错误, 无法正常打开, 请确认后重新上传" % filename
        logger.exception(message)
        return False, message, None

    try:
        tar_file_members = tar_file.getmembers()
    except Exception:
        message = "%s 文件错误, 无法正常打开解析文件列表, 请确认后重新上传" % filename
        logger.exception(message)
        return False, message, None

    target_file_list = [m.name for m in tar_file_members if match_func(m.name)]
    if not target_file_list:
        message = "%s 包中缺少对应文件" % filename
        logger.error(message)
        return False, message, None

    target_file_path = target_file_list[0]
    try:
        target_file = tar_file.extractfile(target_file_path)
        content = target_file.read()
    except Exception:
        message = "%s 解压获取文件失败" % filename
        logger.exception(message)
        return False, message, None

    try:
        tar_file.close()
    except Exception:
        logger.exception()

    return True, "处理成功", content


def validate_and_extract_tar_file(filename, path):
    """
    校验tar.gz文件, 并解压获取app.yml
    """
    def match_func(name):
        if not isinstance(name, unicode):
            name = name.decode("utf-8")
        return name.endswith("app.yml") and len(name.split("/")) == 2

    ok, message, content = _get_file_from_tar_file(filename, path, match_func)
    return True, "处理成功", content


def extract_logo_file(filename, path, saas_app_code):
    """
    解压tar.gz文件中的logo到 /media/saaslogo/
    """
    app_logo_name = "%s.png" % saas_app_code

    def match_func(name):
        if not isinstance(name, unicode):
            name = name.decode("utf-8")
        return name.endswith(app_logo_name) and len(name.split("/")) == 3

    ok, message, content = _get_file_from_tar_file(filename, path, match_func)
    if not ok:
        return False, message

    # write content
    logo_local_path = os.path.join(settings.MEDIA_ROOT, LogoImgRelatedDirEnum.SAAS.value, app_logo_name)
    applogo_path = os.path.join(settings.MEDIA_ROOT, LogoImgRelatedDirEnum.APP.value, app_logo_name)

    # 存在问题: 如果用户上传第一版本, 放入到applogo, 后面版本更新不会更新到applog
    # 需要做的: 可以比对applogo/saaslog中两个是否都存在且一致, 如果是, 全替换
    is_replace_applog = False
    if os.path.exists(logo_local_path) and os.path.exists(applogo_path):
        import filecmp
        if filecmp.cmp(logo_local_path, applogo_path):
            is_replace_applog = True

    try:
        # replace saaslogo/*.png
        with open(logo_local_path, "w") as logo_f:
            logo_f.write(content)

        # if user not defined it, the put into applogo
        if not os.path.exists(applogo_path) or is_replace_applog:
            with open(applogo_path, "w") as logo_f:
                logo_f.write(content)
    except Exception:
        message = "保存logo文件失败"
        logger.exception(message)
        return False, message

    return True, "处理成功"


@transaction.atomic
def save_saas_app_info(app_config, saas_upload_file):

    app_code = app_config.get("app_code")
    app_name = app_config.get("app_name")
    version = app_config.get("version")

    language = app_config.get("language", "python")
    is_use_celery = app_config.get("is_use_celery", True)
    author = app_config.get("author", "")
    introduction = app_config.get("introduction", "")
    category = app_config.get('category', "")
    language_support = app_config.get('language_support', "")
    desktop = app_config.get("desktop")
    date = app_config.get("date")

    # fix xss error, this value are all from app.yml
    # 2018-05-22 escape begin
    app_name = escape(app_name)
    author = escape(author)
    introduction = escape(introduction)
    category = escape(category)
    language_support = escape(language_support)
    # 2018-05-22 escape end

    try:
        if date:
            date = date.strftime("%Y-%m-%d %H:%M:%S")
    except Exception:
        date = str(date)

    libraries = app_config.get("libraries", [])
    yums = app_config.get("yums", [])

    pip = ' '.join(["{name}=={version}".format(**d) for d in libraries])
    yum = ' '.join(yums)

    settings = {
        'language': language,
        'is_use_celery': is_use_celery,
        'author': author,
        'introduction': introduction,
        'category': category,
        'language_support': language_support,
        'date': date,
        'pip': pip,
        'yum': yum,
        'desktop': desktop
    }

    # start to save info
    is_saas_app_exist = False
    try:
        saas_app = SaaSApp.objects.get(code=app_code)
        saas_app.name = app_name
        is_saas_app_exist = True
    except SaaSApp.DoesNotExist:
        saas_app = SaaSApp()
        saas_app.code = app_code
        saas_app.name = app_name
        saas_app.save()

    if is_saas_app_exist:
        try:
            saas_app_version = SaaSAppVersion.objects.get(version=version, saas_app=saas_app)
        except SaaSAppVersion.DoesNotExist:
            saas_app_version = SaaSAppVersion()
            saas_app_version.version = version
            saas_app_version.saas_app = saas_app
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

    return saas_app_version.id


def _create_app(saas_app_version):
    """
    新建一个app, 创建数据库, 并将其关联到SaaSApp

    关系1: SaaSApp -> SaaSAppVersion -> SaaSUploadFile
    关系2: SaaSApp -> App
    """
    saas_app = saas_app_version.saas_app
    app_code = saas_app.code
    app_name = saas_app.name

    ok, message, app_info = saas_app_version.gen_app_info_from_settings(app_code)
    if not ok:
        return False, message, None

    # 2. 创建App /  AppTags
    ok, message, app = save_app_info(app_code, app_name, is_create=True, **app_info)
    if not ok:
        return False, message, None

    # 3. 创建数据库, 并将数据库信息存入SecureInfo
    ok, message = create_saas_app_db(app_code)
    if not ok:
        # 创建SaaS应用失败，则删除 对应的App
        App.objects.filter(code=app_code).delete()
        return False, message, None

    return True, "success", app


def _update_app(saas_app_version):
    """
    更新app
    language / is_use_celery / language / version等字段
    """
    saas_app = saas_app_version.saas_app
    app_code = saas_app.code

    ok, message, app_info = saas_app_version.gen_app_info_from_settings(app_code)
    if not ok:
        return False, message

    ok, message, app = save_app_info(saas_app.code, saas_app.name, is_create=False, **app_info)
    if not ok:
        return False, message

    # 2. 更新当前处理时版本, 上线成功后, 更新 online_version=current_version
    SaaSApp.objects.update_current_version(app, saas_app_version)

    return True, "success"


def save_app_info(code, name, is_create=True, **app_info):
    """
    将app的基本信息存入到 paas_app 表中

    如：code、name、introduction 等
    code 重复 则直接返回异常由上层处理
    name 重复 则直接保存code信息
    """
    if not code:
        return False, "缺少参数：code", None

    language = app_info.get('language', 'python')
    if is_create:
        ok, message, token = register_app(code, name, language)
        if not ok:
            return False, message, None

    with transaction.atomic():
        # 创建应用
        if is_create:
            try:
                app = App.objects.create(code=code)
                app.auth_token = token
            except Exception:
                logger.exception("SaaS 应用code(%s)已经存在app表中", code)
                return False, "SaaS 应用ID[%s]与已有 PaaS 应用ID冲突" % code, None
        else:
            app, _c = App.objects.get_or_create(code=code)

        # name 重复则或为空 直接保存code的信息, 还重复则直接返回异常
        try:
            old_name = app.name
            is_name_exist = App.objects.filter(name=name).exclude(name=old_name).exists()
            app.name = code if (is_name_exist or not name) else name
            app.save()
        except Exception:
            logger.exception("SaaS 应用name(%s)已经存在app表中", name)
            return False, "SaaS 应用名称[%s]与已有应用名称冲突" % name, None

        # 保存应用基本信息
        app.is_saas = True
        app.language = language
        app.introduction = app_info.get('introduction')
        app.is_use_celery = app_info.get('is_use_celery')
        app.is_use_celery_beat = app_info.get('is_use_celery_beat')
        app.creater = app_info.get('author')
        app.save()

        # 保存应用db信息
        paas_db = settings.DATABASES.get('default', {})
        app_sec_info, _c = SecureInfo.objects.get_or_create(app_code=code)
        app_sec_info.db_host = paas_db.get('HOST')
        app_sec_info.db_port = paas_db.get('PORT', 3306)
        app_sec_info.db_username = paas_db.get('USER')
        app_sec_info.db_password = paas_db.get('PASSWORD')
        # 数据库名称修改为：应用code
        app_sec_info.db_name = code
        app_sec_info.save()
    return True, '', app


def upload_response_tpl(result, message, data={}):
    """
    将上传文件的结果通过js的方法返回渲染
    """
    span_type = 'success' if result else 'danger'
    fa_type = 'icon-check1' if result else 'icon-exclamation-triangle'

    saas_app_version_id = data.get('saas_app_version_id', '')
    file_version_display = data.get('file_version_display', '')

    if_success_do_remove_js = 'window.parent.document.getElementById(\"saas_app_online\").removeAttribute(\"disabled\");' # noqa
    if not result:
        if_success_do_remove_js = ''

    response_tpl = UPLOAD_RESPONSE_FORMAT.format(
        span_type=span_type,
        message=message,
        fa_type=fa_type,
        saas_app_version_id=saas_app_version_id,
        file_version_display=file_version_display,
        if_success_do_remove_js=if_success_do_remove_js,
    )
    response = HttpResponse()
    response['Content-Type'] = 'text/html'
    response['charset'] = 'utf-8'
    response.write(response_tpl)
    return response


def create_saas_app_db(app_code):
    """
    给SaaS应用创建db信息

    db的用户信息跟平台保持一致
    """
    # 获取平台的 db 配置信息
    app_sec_info, _c = SecureInfo.objects.get_or_create(app_code=app_code)
    db_name = app_sec_info.db_name
    create_sql = CREATE_PAAS_DB_SQL % db_name
    ok, message = execute_sql('default', create_sql)
    # 创建失败提示用户到基本信息页面手动修改 db 信息
    if not ok:
        base_url = '{}/saas/{}/info/'.format(settings.SITE_URL, app_code)
        message = "创建应用db失败，请手动创建db后，点击 <a href='{}'>这里</a> 修改配置信息后重新部署".format(base_url)
    return ok, message


def execute_sql(db_alias, operation, params=None):
    '''
    @summary: 查询数据库中的数据
    @param db_alias: 数据连接别名，数据连接由settings.DATABASES设置
    @param execute_sql: 执行更新操作的SQL语句
    @param params: SQL语句中条件参数
    @return: 返回是否执行成功
    '''
    cursor = connections[db_alias].cursor()
    message = ''
    try:
        cursor.execute(operation)
        message = "执行成功"
        return True, message
    except Exception:
        logger.exception("sql语句执行失败")
        return False, message
    finally:
        # 关闭连接
        cursor.close()


@transaction.atomic
def delete_saas_app(app_code, username):
    """
    清除应用
    """
    # app = App.objects.get(code=app_code)
    saas_app = SaaSApp.objects.get(code=app_code)

    if saas_app.state not in [1]:
        return False, "应用已经部署过, 无法进行删除操作"

    saas_app.app = None
    saas_app.current_version = None
    saas_app.online_version = None
    saas_app.save()

    # 删除 app 表中的应用
    try:
        SecureInfo.objects.filter(app_code=app_code).delete()
        App.objects.filter(code=app_code).delete()
        # 将APP的发布记录保存为上一次，避免下次创建时显示冲突
        Record.objects.filter(app_code=app_code).update(version='last')
        logger.info("[app:%s] 删除成功", app_code)
    except Exception:
        message = "应用删除失败！"
        logger.exception("[app:%s] %s", app_code, message)
        return False, message

    try:
        SaaSAppVersion.objects.delete_all_versions(saas_app)
        saas_app.delete()
    except Exception:
        message = "删除 SaaSApp 相关数据失败, app_code=%s" % app_code
        logger.exception(message)
        return False, message

    # 操作流水日志
    extra_data = {"username": username}
    record_user_operate(app_code=app_code,
                        username=username,
                        operate_type=UserOperateTypeEnum.APP_DELETE.value,
                        extra_data=extra_data)

    return True, "应用删除成功"


def saas_online_task(saas_app_version_id, username):
    """
    SaaS应用部署操作
    """
    is_saas_app_deployable = BkServer.objects.check_saas_app_deployable()
    if not is_saas_app_deployable:
        message = "当前没有可用的[正式服务器], 无法进行应用部署操作. 请到<a href='/engine/server/'> [蓝鲸智云-开发者中心-服务器信息] </a>注册并激活服务器"
        logger.info(message)
        return False, message, None

    try:
        saas_app_version = SaaSAppVersion.objects.get(id=saas_app_version_id)
    except SaaSAppVersion.DoesNotExist:
        return False, "对应版本不存在, 无法进行部署", None

    saas_app = saas_app_version.saas_app
    app = saas_app.app
    if not app:
        # make a new one
        ok, message, app = _create_app(saas_app_version)
        if not ok:
            return False, message, None

        # 将 SaasApp 表 与 App表关联
        saas_app.app = app
        saas_app.save()

    # update
    ok, message = _update_app(saas_app_version)
    if not ok:
        return False, message, None

    # ========================================

    app_code = app.code
    logger.info("SaaS App[app:%s] 开始进行[正式部署]...", app_code)

    # 状态检测, 什么状态可以发布?
    # 只有[下架/开发/测试/上线]状态可操作
    if app.state not in [AppStateEnum.OFFLINE.value, AppStateEnum.DEVELOPMENT.value,
                         AppStateEnum.TEST.value, AppStateEnum.ONLINE.value]:
        message = "SaaS App应用当前状态：%s，不能进行部署操作！" % app.get_state_display()
        logger.info("SaaS App[app:%s] %s", app_code, message)
        return False, message, None

    # 上线操作
    # NOTE: fix bug here, get the newest object because some changes have been saved
    newest_saas_app_version = SaaSAppVersion.objects.get(id=saas_app_version_id)
    ok, event_id, message = saas_app_to_online_task(newest_saas_app_version, username)

    # 操作流水日志
    extra_data = {"username": username}
    record_user_operate(app_code=app_code,
                        username=username,
                        operate_type=UserOperateTypeEnum.RELEASE_ONLINE.value,
                        extra_data=extra_data)

    logger.info("SaaS App[app:%s] %s event_id: %s", app_code, message, event_id)

    data = {
        "event_id": event_id,
        "app_code": app_code,
    }
    if ok:
        return True, "SaaS App正式部署事件提交成功！", data
    return False, message, None
