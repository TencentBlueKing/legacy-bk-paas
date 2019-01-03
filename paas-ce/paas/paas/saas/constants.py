# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

from __future__ import unicode_literals

# 上传文件后，返回给前端的js
UPLOAD_RESPONSE_FORMAT = """
<script>
window.parent.document.getElementById(\"import_msg\").innerHTML=
\"<span class='text-{span_type}'><i class='bk-icon {fa_type} t_b'></i> {message}</span>\";
window.parent.document.getElementById(\"saas_app_version_id\").innerHTML=\"{saas_app_version_id}\";
window.parent.document.getElementById(\"file_version_display\").innerHTML=\"{file_version_display}\";
window.parent.document.getElementById(\"saas_upload\").removeAttribute(\"disabled\");
{if_success_do_remove_js}
</script>
"""

# 应用的 db 创建语句
CREATE_PAAS_DB_SQL = 'CREATE DATABASE IF NOT EXISTS `%s`  DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;'
