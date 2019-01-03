# -*-coding:utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

"""
Copyright © 2012-2017 Tencent BlueKing. All Rights Reserved. 蓝鲸智云 版权所有
"""
import os

import markdown
from markdown.extensions.headerid import HeaderIdExtension


def md2html(name):
    app_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(app_dir, 'templates/manager/mdfiles', '%s.md' % name)
    with open(file_path) as fp:
        md_content = unicode(fp.read(), 'utf-8')
        html_content = markdown.markdown(
            md_content,
            extensions=[
                'tables',
                'attr_list',
                'fenced_code',
                HeaderIdExtension(level=1),
                'markdown.extensions.codehilite',
                'markdown.extensions.toc'
            ],
        )
    return html_content
