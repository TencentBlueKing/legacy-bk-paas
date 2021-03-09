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

import datetime

from django.db import models


class AppUseRecordManager(models.Manager):
    """
    用户使用APP记录操作
    """

    def get_records(self, s_time, e_time, app_code):
        """
        获取经过过滤的app使用记录数据
        """
        all_visit = self.filter()
        if s_time:
            all_visit = all_visit.filter(use_time__gte=s_time)
        if e_time:
            delta_one_day = datetime.timedelta(days=1)
            all_visit = all_visit.filter(use_time__lt=e_time + delta_one_day)
        # 筛选
        if app_code:
            all_visit = all_visit.filter(app__code=app_code)

        return all_visit
