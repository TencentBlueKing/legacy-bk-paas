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


from builtins import str
from django.db import models
from django.utils import timezone

from common.log import logger
from release.constants import OPERATE_CODE_TO_ID_DICT, OperateIDEnum


class RecordManager(models.Manager):
    def create_record(self, app_code, app_old_state, operate_user, operate_id, is_success):
        """
        创建记录
        """
        record_obj = self.create(
            app_code=app_code,
            app_old_state=app_old_state,
            operate_user=operate_user,
            operate_id=operate_id,
            is_success=is_success,
            operate_time=timezone.now(),
        )
        return record_obj

    def get_record_list(self, app_code, operate_code, start=0, end=100):
        """
        operate_id: 操作对应ID, 0: 全部，2：上线，3：下架
        """
        operate_id_options = OPERATE_CODE_TO_ID_DICT.get(operate_code)
        query = self.filter(app_code=app_code, operate_id__in=operate_id_options).order_by("-operate_time")
        record_list = []
        for _record in query[start:end]:
            record_list.append(
                {
                    # "operate_type": _record.get_operate_id_display(),
                    "operate_type": _record.operate_type_display,
                    "operate_user": _record.operate_user,
                    "is_success": _record.is_success,
                    "is_done": _record.is_done,
                    "operate_time": _record.operate_time_display,
                    "extra_data": _record.extra_msg,
                    "detail": _record.message_display,
                    "task_detail": _record.task_detail,
                }
            )
        return record_list

    def get_last_record(self, app_code):
        # 查询最近一条, 处于这几种状态的记录, 则是app的最新记录
        query = self.filter(app_code=app_code).filter(
            operate_id__in=[
                OperateIDEnum.TO_TEST,
                OperateIDEnum.TO_ONLINE,
                OperateIDEnum.TO_OUTLINE,
                OperateIDEnum.IN_TEST,
                OperateIDEnum.IN_ONLINE,
                OperateIDEnum.IN_OUTLINE,
            ]
        )
        if not query:
            return None
        return query.latest("id")
        # return record


class UserOperateRecordManager(models.Manager):
    def create_operate_record(self, app_code, username, operate_type, before_data="", arfter_data="", extra_data=""):
        """
        创建操作记录
        @param app_code: app编码
        @param username: 操作人
        @param operate_type: 操作类型
        @param before_data: 操作前数据
        @param arfter_data: 操作后数据
        @param extra_data: 其他数据
        """
        try:
            self.create(
                app_code=app_code,
                username=username,
                before_data=before_data,
                arfter_data=arfter_data,
                operate_time=timezone.now(),
                operate_type=operate_type,
                extra_data=extra_data,
            )
            # UserOperateRecord(
            # app_code=app_code,
            # username=username,
            # before_data=before_data,
            # arfter_data=arfter_data,
            # operate_time=timezone.now(),
            # operate_type=operate_type,
            # extra_data=extra_data,
            # ).save()
            result = True
        except Exception, e:
            # 用户操作记录创建失败，error：%s
            logger.exception(u"record user operation fail，error：%s" % e)
            result = False
        return result


class VersionManager(models.Manager):
    def create_version(self, appobj, bugs, features, username):
        """
        创建版本
        """
        if not (bugs or features):
            return False

        is_exists = self.filter(app=appobj).exists()
        if is_exists:
            new_version = self.filter(app=appobj).order_by("-pubdate")[0].version
            new_version = int("".join(new_version.split("."))) + 1
            version = ".".join([n for n in str(new_version)])
        else:
            version = "1.0.0.1"

        try:
            self.create(app=appobj, version=version, publisher=username, pubdate=timezone.now())
            self.get(app=appobj, version=version).versiondetail_set.create(bug=bugs, features=features)
        except Exception, e:
            # 创建发布新版本失败!%s
            logger.exception(u"create version fail!%s" % e)
            return False
        return True

    def get_version_list(self, app):
        version_list = []
        _list = self.filter(app=app).order_by("-pubdate")
        for _version in _list:
            version_details = _version.versiondetail_set.all()

            bug_list = [_detail.bug.replace("\n", "<br/>") for _detail in version_details if _detail.bug]
            features_list = [
                _detail.features.replace("\n", "<br/>") for _detail in version_details if _detail.features
            ]

            version_list.append(
                {
                    "version": _version.version,
                    "publisher": _version.publisher,
                    "pubdate": _version.pubdate_display,
                    "features": features_list,
                    "bug": bug_list,
                }
            )
        return version_list
