# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

from esb.bkcore.models import ComponentSystem


def get_system_category():
    """获取文档分类"""
    systems = ComponentSystem.objects.all()
    doc_category = {}
    for system in systems:
        if not system.has_display_doc:
            continue
        system_doc_category = system.doc_category
        doc_category.setdefault(system_doc_category.id, {
            'name': system_doc_category.name_display,
            'label': system_doc_category.name_display,
            'priority': system_doc_category.priority,
            'systems': [],
        })
        doc_category[system_doc_category.id]['systems'].append({
            'name': system.name,
            'label': system.label_display,
            'desc': system.remark_display,
        })
    doc_category = doc_category.values()
    doc_category.sort(key=lambda x: x['priority'])
    for category in doc_category:
        category['systems'].sort(key=lambda x: x['name'])
    return doc_category
