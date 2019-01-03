# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

from __future__ import unicode_literals

import datetime

from django.db import models
from django.utils.html import escape

from common.log import logger
from release.constants import (APP_ALL_OPERATE_ID_LIST,
                               APP_DID_OPERATE_ID_LIST,
                               APP_OFFLINE_OPERATE_ID_LIST,
                               APP_ONGOING_OPERATE_ID_LIST,
                               APP_ONLINE_OPERATE_ID_LIST,
                               APP_TEST_OPERATE_ID_LIST,
                               OperateCodeEnum)


class ReleaseVersionManager(models.Manager):
    def create_version(self, appobj, bugs, features, username):
        """创建版本
        """
        if not (bugs or features):
            return False

        is_exists = self.filter(app=appobj).exists()
        if is_exists:
            new_version = self.filter(app=appobj).order_by('-pubdate')[0].version
            new_version = int(''.join(new_version.split('.'))) + 1
            version = '.'.join([n for n in str(new_version)])
        else:
            version = '1.0.0.1'

        try:
            self.create(app=appobj,
                        version=version,
                        publisher=username,
                        pubdate=datetime.datetime.now()
                        )
            self.get(app=appobj, version=version).versiondetail_set.create(bug=bugs, features=features)
        except Exception as e:
            logger.exception("创建发布新版本失败!%s", e)
            return False
        return True

    def get_version_list(self, app):
        version_list = []
        versions = self.filter(app=app).order_by("-pubdate")
        for v in versions:
            version_details = v.versiondetail_set.all()

            bug_list = [escape(_detail.bug).replace('\n', '<br/>')
                        for _detail in version_details if _detail.bug]
            features_list = [escape(_detail.features).replace('\n', '<br/>')
                             for _detail in version_details if _detail.features]

            version_list.append({
                "version": v.version,
                "publisher": v.publisher,
                "pubdate": v.pubdate_display,
                "features": features_list,
                "bug": bug_list,
            })
        return version_list


class UserOperateRecordManager(models.Manager):
    def create_operate_record(self, app_code, username, operate_type, before_data='', arfter_data='', extra_data=''):
        """创建操作记录
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
                operate_time=datetime.datetime.now(),
                operate_type=operate_type,
                extra_data=extra_data,
            )
            result = True
        except Exception as e:
            logger.exception("用户操作记录创建失败，error：%s", e)
            result = False
        return result


class ReleaseRecordManager(models.Manager):
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
            operate_time=datetime.datetime.now(),
        )
        return record_obj

    def get_latest_did_record(self, app_code):
        record = self.filter(operate_id__in=APP_DID_OPERATE_ID_LIST,
                             app_code=app_code)\
            .order_by("-id")\
            .first()

        if not record:
            return None

        return {
            "username": record.operate_user,
            "datetime": record.operate_time_display,
            "operate_type": record.get_operate_id_display(),
            "result": "成功" if record.is_success else "失败",
        }

    def query_records(self, app_code, operate_code, size=100):
        query = self.filter(app_code=app_code)

        id_list = {
            OperateCodeEnum.ALL.value: APP_ALL_OPERATE_ID_LIST,
            OperateCodeEnum.TEST.value: APP_TEST_OPERATE_ID_LIST,
            OperateCodeEnum.ONLINE.value: APP_ONLINE_OPERATE_ID_LIST,
            OperateCodeEnum.OFFLINE.value: APP_OFFLINE_OPERATE_ID_LIST,
        }.get(operate_code)

        query = query.filter(operate_id__in=id_list).order_by("-operate_time")[0:size]
        return query

    def get_last_ongoing_records(self, app_code, size=10):
        records = self.filter(app_code=app_code)\
            .filter(operate_id__in=APP_ONGOING_OPERATE_ID_LIST)\
            .order_by("-id")[:size]
        return records

    def get_app_newest_record(self, app_code):
        # 查询最近一条, 处于这几种状态的记录, 则是app的最新记录
        record = self.filter(app_code=app_code)\
            .filter(operate_id__in=APP_ALL_OPERATE_ID_LIST)\
            .latest('id')
        return record
