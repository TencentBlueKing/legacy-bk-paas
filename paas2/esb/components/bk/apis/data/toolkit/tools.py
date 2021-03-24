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
from __future__ import print_function

from future import standard_library
standard_library.install_aliases()
import urllib.parse

from esb.bkcore.models import ESBBuffetComponent


def make_esb_conf_with_buffet_data():
    system_id = 5
    url_prefix = "/data"
    buffets = ESBBuffetComponent.objects.filter(system_id=system_id).order_by("registed_path")
    esb_conf = []
    for component in buffets:
        parsed_url = urllib.parse.urlparse(component.dest_url)
        esb_conf.append(
            u"""
                    ('%s%s', {
                        'comp_codename': 'generic.data.data_component',
                        'method': '%s',
                        'comp_conf': {
                            'dest_path': '%s',
                            'dest_http_method': '%s',
                            'name': '%s',
                            'label': u'%s',
                        }
                    }),"""
            % (
                url_prefix,
                component.registed_path,
                component.registed_http_method,
                parsed_url.path,
                component.dest_http_method,
                component.registed_path.strip("/").replace("/", "_").replace("{", "").replace("}", ""),
                component.name,
            )
        )
    print("".join(esb_conf))

    print("count: %s" % len(esb_conf))
