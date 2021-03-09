# -*- coding: utf-8 -*-
"""
初始化默认应用信息

利用migration的原理来初始化并维护默认应用信息，保证以下三个规则：
1. 每个应用生成一个migration文件，如：0002_framework.py,0003_iwork.py
2. 每个migration文件维护当前应用的最新版本号，保证新安装PaaS的用户都是安装最新版本的应用包，老的用户的应用版本保持不变
   如 0002_PaaS V2.0.0.py文件中：
   PaaS V1.0.0 中 app 的 version为 1.0.0
   PaaS V2.0.0 中 app 的 version为 2.0.0
3. 每个发布的PaaS包中需要包含默认应用的所有版本，如 PaaS V2.0.0 需包含：framework_v1.0.0 和 framework_v2.0.0

即:
- 每个应用更新, 需增加版本号, 发布包中会保留其所有历史版本

"""
from django.utils.translation import ugettext as _

from common.log import logger
from saas.models import SaaSApp, SaaSUploadFile
from saas.utils import save_saas_app_info


def init_saas_app_db_info(app_code, config_info, file_info):
    """
    初始化SaaS应用的 db 信息

    """
    # 如果应用(app_code)已经存在数据库中，则不再更新
    # apps = SaaSApp.objects.filter(code=app_code)
    # if apps.exists():
    # msg = u"应用[%s]已经存在，不进行初始化操作" % app_code
    # logger.info(msg)
    # return True, msg

    # 保存安装文件信息
    saas_upload_file = SaaSUploadFile()
    try:
        saas_upload_file.name = file_info.get("name")
        saas_upload_file.size = file_info.get("size")
        saas_upload_file.md5 = file_info.get("md5")
        saas_upload_file.file = file_info.get("file")
        saas_upload_file.save()
    except Exception:
        # 初始化应用[%s]出错，保存应用版本信息出错
        msg = u"An error occurred in initializing app [%s], and saving the app version information" % app_code
        logger.exception(msg)
        msg = _(u"初始化应用[%s]出错，保存应用版本信息出错") % app_code
        return False, msg

    try:
        save_saas_app_info(config_info, saas_upload_file)
        # 保存应用 logo
        SaaSApp.objects.filter(code=app_code).update(logo="applogo/%s.png" % app_code)
    except Exception:
        # 初始化应用[%s]出错
        msg = u"Initialization of app [%s] failed" % app_code
        logger.exception(msg)

        msg = _(u"初始化应用[%s]出错") % app_code
        return False, msg

    # 初始化应用[%s]成功
    msg = u"Initialization of app [%s] succeeded" % app_code
    logger.info(msg)
    msg = _(u"初始化应用[%s]成功") % app_code
    return True, msg
