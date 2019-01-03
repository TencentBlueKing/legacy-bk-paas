# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
from __future__ import print_function, unicode_literals


from django.db.models.signals import post_syncdb
from app import models as m
from django.db import transaction
from app.models import AppTags


@transaction.atomic
def init_data(**kwargs):
    # 初始化 应用分类
    with transaction.atomic():
        try:
            AppTags.objects.get_or_create(name="基础服务", code='Service')
            AppTags.objects.get_or_create(name="管理类", code='MGT')
            AppTags.objects.get_or_create(name="数据类", code='Data')
            AppTags.objects.get_or_create(name="行政和HR", code='Hr')
            AppTags.objects.get_or_create(name="运维工具", code='Tools')
            AppTags.objects.get_or_create(name="流程管理", code='BPM')
            AppTags.objects.get_or_create(name="运营支持", code='Supports')
            AppTags.objects.get_or_create(name="其它", code='Other')
        except Exception as e:
            print(e)
            print("Init app tags fail")


init_data()
post_syncdb.connect(init_data, sender=m)
