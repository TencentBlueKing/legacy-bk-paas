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

import os

from django.conf import settings

from components.component import ApiChannelForAPIS, ESBApiChannelForAPIS, FTAApiChannelForAPIS
from esb.bkapp.validators import AppAuthValidator, AppCodeWhiteListValidator
from esb.bkauth.validators import UserAuthWithBKTokenValidator


def _rel_path(x):
    return os.path.join(settings.BASE_DIR, x)


CUSTOM_APIS_REL_PATH = getattr(settings, "CUSTOM_APIS_REL_PATH", "components/generic/apis/")


# channel config is_hidden, is_deprecated description:
#   is_hidden: channel not open, no sdk and apidoc
#   is_deprecated: channel was once open and generated sdk and apidoc, but now deprecated, need to hide apidoc
#   is_hidden and is_deprecated do not need to exist at the same time

config = {
    "version": 1,
    "config": {
        # important!
        # component_group should in order, last dir has higher priority
        "component_groups": [
            {
                "path": _rel_path("components/generic/templates/"),
                "name_prefix": "generic.",
            },
            {
                "path": _rel_path(CUSTOM_APIS_REL_PATH),
                "name_prefix": "generic.",
            },
            {
                "path": _rel_path("components/bk/apis/"),
                "name_prefix": "generic.",
            },
            {
                "path": _rel_path("components/bk/apisv2/"),
                "name_prefix": "generic.v2.",
            },
        ],
        "default_channel_classes": None,
        "doc_common_args": u"""
            ### {{ _("通用参数") }}

            | {{ _("字段") }} | {{ _("类型") }} | {{ _("必选") }} |  {{ _("描述") }} |
            |-----------|------------|--------|------------|
            | bk_app_code  |  string    | {{ _("是") }} | {{ _("应用ID") }}     |
            | bk_app_secret|  string    | {{ _("是") }} | {{ _("安全密钥(应用 TOKEN)，可以通过 蓝鲸智云开发者中心 -> 点击应用ID -> 基本信息 获取") }} |
            | bk_token     |  string    | {{ _("否") }} | {{ _("当前用户登录态，bk_token与bk_username必须一个有效，bk_token可以通过Cookie获取") }} |
            | bk_username  |  string    | {{ _("否") }} | {{ _("当前用户用户名，应用免登录态验证白名单中的应用，用此字段指定当前用户") }} |""",  # noqa
        "channel_groups": {
            "default": {
                "channel_classes": {
                    "api": ApiChannelForAPIS,
                },
                "rewrite_channels": {
                    # cmsi
                    "/v2/cmsi/send_voice_msg/": "/cmsi/send_voice_msg/",
                    "/v2/cmsi/send_mail/": "/cmsi/send_mail/",
                    "/v2/cmsi/send_sms/": "/cmsi/send_sms/",
                    "/v2/cmsi/send_weixin/": "/cmsi/send_weixin/",
                    "/v2/cmsi/get_msg_type/": "/cmsi/get_msg_type/",
                    "/v2/cmsi/send_msg/": "/cmsi/send_msg/",
                },
                "preset_channels": [
                    # CC v2
                    ("/v2/cc/add_host_to_resource/", {"comp_codename": "generic.v2.cc.add_host_to_resource"}),
                    ("/v2/cc/create_business/", {"comp_codename": "generic.v2.cc.create_business"}),
                    ("/v2/cc/create_custom_query/", {
                        "comp_codename": "generic.v2.cc.create_custom_query",
                        "is_hidden": True,
                    }),
                    ("/v2/cc/create_module/", {"comp_codename": "generic.v2.cc.create_module"}),
                    ("/v2/cc/create_set/", {"comp_codename": "generic.v2.cc.create_set"}),
                    ("/v2/cc/delete_business/", {
                        "comp_codename": "generic.v2.cc.delete_business",
                        "is_hidden": True,
                    }),
                    ("/v2/cc/delete_custom_query/", {
                        "comp_codename": "generic.v2.cc.delete_custom_query",
                        "is_hidden": True,
                    }),
                    ("/v2/cc/delete_host/", {"comp_codename": "generic.v2.cc.delete_host"}),
                    ("/v2/cc/delete_module/", {"comp_codename": "generic.v2.cc.delete_module"}),
                    ("/v2/cc/delete_set/", {"comp_codename": "generic.v2.cc.delete_set"}),
                    ("/v2/cc/get_custom_query_data/", {
                        "comp_codename": "generic.v2.cc.get_custom_query_data",
                        "is_hidden": True,
                    }),
                    ("/v2/cc/get_custom_query_detail/", {
                        "comp_codename": "generic.v2.cc.get_custom_query_detail",
                        "is_hidden": True,
                    }),
                    ("/v2/cc/get_host_base_info/", {"comp_codename": "generic.v2.cc.get_host_base_info"}),
                    ("/v2/cc/search_business/", {"comp_codename": "generic.v2.cc.search_business"}),
                    ("/v2/cc/search_custom_query/", {
                        "comp_codename": "generic.v2.cc.search_custom_query",
                        "is_hidden": True,
                    }),
                    ("/v2/cc/search_module/", {"comp_codename": "generic.v2.cc.search_module"}),
                    ("/v2/cc/search_set/", {"comp_codename": "generic.v2.cc.search_set"}),
                    ("/v2/cc/transfer_host_module/", {"comp_codename": "generic.v2.cc.transfer_host_module"}),
                    (
                        "/v2/cc/transfer_host_to_faultmodule/",
                        {
                            "comp_codename": "generic.v2.cc.transfer_host_to_faultmodule",
                        },
                    ),
                    (
                        "/v2/cc/transfer_host_to_idlemodule/",
                        {
                            "comp_codename": "generic.v2.cc.transfer_host_to_idlemodule",
                        },
                    ),
                    (
                        "/v2/cc/transfer_host_to_resourcemodule/",
                        {
                            "comp_codename": "generic.v2.cc.transfer_host_to_resourcemodule",
                        },
                    ),
                    (
                        "/v2/cc/transfer_resourcehost_to_idlemodule/",
                        {
                            "comp_codename": "generic.v2.cc.transfer_resourcehost_to_idlemodule",
                        },
                    ),
                    ("/v2/cc/update_business/", {"comp_codename": "generic.v2.cc.update_business"}),
                    ("/v2/cc/update_custom_query/", {
                        "comp_codename": "generic.v2.cc.update_custom_query",
                        "is_hidden": True,
                    }),
                    ("/v2/cc/update_host/", {"comp_codename": "generic.v2.cc.update_host"}),
                    ("/v2/cc/update_module/", {"comp_codename": "generic.v2.cc.update_module"}),
                    ("/v2/cc/update_set/", {"comp_codename": "generic.v2.cc.update_set"}),
                    ("/v2/cc/search_biz_inst_topo/", {"comp_codename": "generic.v2.cc.search_biz_inst_topo"}),
                    ("/v2/cc/search_inst_by_object/", {"comp_codename": "generic.v2.cc.search_inst_by_object"}),
                    ("/v2/cc/bind_role_privilege/", {
                        "comp_codename": "generic.v2.cc.bind_role_privilege",
                        "is_hidden": True,
                    }),
                    (
                        "/v2/cc/update_object_topo_graphics/",
                        {
                            "comp_codename": "generic.v2.cc.update_object_topo_graphics",
                            "is_hidden": True,
                        },
                    ),
                    # job
                    (
                        "/v2/job/callback_protocol/",
                        {
                            "comp_codename": "generic.v2.job.callback_protocol",
                            "no_sdk": True,
                            "is_hidden": True,
                        },
                    ),
                    # jobv3
                    (
                        "/v2/jobv3/callback_protocol/",
                        {
                            "comp_codename": "generic.v2.jobv3.callback_protocol",
                            "no_sdk": True,
                        },
                    ),
                    # paas v2
                    (
                        "/v2/bk_paas/create_app/",
                        {
                            "comp_codename": "generic.v2.bk_paas.create_app",
                            "is_hidden": True,
                        },
                    ),
                    (
                        "/v2/bk_paas/del_app/",
                        {
                            "comp_codename": "generic.v2.bk_paas.del_app",
                            "is_hidden": True,
                        },
                    ),
                    (
                        "/v2/bk_paas/edit_app/",
                        {
                            "comp_codename": "generic.v2.bk_paas.edit_app",
                            "is_hidden": True,
                        },
                    ),
                    (
                        "/v2/bk_paas/get_app_info/",
                        {
                            "comp_codename": "generic.v2.bk_paas.get_app_info",
                        },
                    ),
                    (
                        "/v2/bk_paas/modify_app_logo/",
                        {
                            "comp_codename": "generic.v2.bk_paas.modify_app_logo",
                            "is_hidden": True,
                        },
                    ),
                    # login v2
                    (
                        "/v2/bk_login/get_all_users/",
                        {
                            "comp_codename": "generic.v2.bk_login.get_all_users",
                            "is_deprecated": True,
                        },
                    ),
                    (
                        "/v2/bk_login/get_batch_users/",
                        {
                            "comp_codename": "generic.v2.bk_login.get_batch_users",
                            "is_deprecated": True,
                        },
                    ),
                    # ('/v2/bk_login/get_batch_users_platform_role/', {
                    #     'comp_codename': 'generic.v2.bk_login.get_batch_users_platform_role',
                    # }),
                    ("/v2/bk_login/get_user/", {"comp_codename": "generic.v2.bk_login.get_user"}),
                    (
                        "/v2/bk_login/is_login/",
                        {
                            "comp_codename": "generic.v2.bk_login.is_login",
                            "request_validators": [AppAuthValidator()],
                            "is_hidden": True,
                        },
                    ),
                    # gse
                    ("/v2/gse/get_agent_info/", {"comp_codename": "generic.v2.gse.get_agent_info"}),
                    ("/v2/gse/get_agent_status/", {"comp_codename": "generic.v2.gse.get_agent_status"}),
                    # cicdkit
                    (
                        "/v2/cicdkit/get_cicdkit_nginx/",
                        {
                            "comp_codename": "generic.v2.cicdkit.get_cicdkit_nginx",
                            "is_hidden": True,
                        },
                    ),
                    # bk_monitor
                    (
                        "/v2/bk_monitor/get_alarm_type/",
                        {
                            "comp_codename": "generic.v2.bk_monitor.bk_monitor_component",
                            "request_validators": [AppAuthValidator()],
                            "is_hidden": True,
                            "comp_conf": {
                                "name": "get_alarm_type",
                                "dest_http_method": "GET",
                                "dest_path": "/o/bk_monitor/rest/v1/alarm_type/",
                            },
                        },
                    ),
                    # BK_LOGIN
                    (
                        "/bk_login/get_all_user/",
                        {
                            "comp_codename": "generic.bk_login.get_all_user",
                            "request_validators": [AppAuthValidator()],
                            "is_deprecated": True,
                        },
                    ),
                    (
                        "/bk_login/get_batch_user/",
                        {
                            "comp_codename": "generic.bk_login.get_batch_user",
                            "request_validators": [AppAuthValidator()],
                            "is_deprecated": True,
                        },
                    ),
                    # ('/bk_login/get_batch_user_platform_role/', {
                    #     'comp_codename': 'generic.bk_login.get_batch_user_platform_role',
                    #     'request_validators': [AppAuthValidator()],
                    #     'is_deprecated': True,
                    # }),
                    (
                        "/bk_login/is_login/",
                        {
                            "comp_codename": "generic.bk_login.is_login",
                            "request_validators": [AppAuthValidator()],
                            "is_hidden": True,
                        },
                    ),
                    (
                        "/bk_login/get_user/",
                        {
                            "comp_codename": "generic.bk_login.get_user",
                            "request_validators": [AppAuthValidator()],
                            "is_deprecated": True,
                        },
                    ),
                    # BK_PAAS
                    (
                        "/bk_paas/get_app_info/",
                        {
                            "comp_codename": "generic.bk_paas.get_app_info",
                            "is_deprecated": True,
                        },
                    ),
                    # AUTH
                    ("/auth/get_auth_token/", {"comp_codename": "generic.auth.get_auth_token", "is_hidden": True}),
                    # CMSI
                    (
                        "/cmsi/send_voice_msg/",
                        {
                            "comp_codename": "generic.cmsi.send_voice_msg",
                            "comp_conf_to_db": [
                                ("dest_url", ""),
                                ("qcloud_app_id", ""),
                                ("qcloud_app_key", ""),
                            ],
                        },
                    ),
                    (
                        "/cmsi/send_mail/",
                        {
                            "comp_codename": "generic.cmsi.send_mail",
                            "comp_conf_to_db": [
                                ("dest_url", ""),
                                ("smtp_host", ""),
                                ("smtp_port", 25),
                                ("smtp_user", "blueking"),
                                ("smtp_pwd", ""),
                                ("smtp_usessl", "False"),
                                ("smtp_usetls", "False"),
                                ("mail_sender", "blueking@bking.com"),
                            ],
                        },
                    ),
                    (
                        "/cmsi/send_sms/",
                        {
                            "comp_codename": "generic.cmsi.send_sms",
                            "comp_conf_to_db": [
                                ("dest_url", ""),
                                ("qcloud_app_id", ""),
                                ("qcloud_app_key", ""),
                            ],
                        },
                    ),
                    (
                        "/cmsi/send_weixin/",
                        {
                            "comp_codename": "generic.cmsi.send_weixin",
                            "comp_conf_to_db": [
                                ("wx_type", "qywx"),
                                ("wx_app_id", ""),
                                ("wx_secret", ""),
                                ("wx_token", ""),
                                ("wx_template_id", "yrxKwt3OR4BGvuZzwiASaSm_GfOtxwak3mMfh5Ijiaw"),
                                ("wx_qy_corpid", ""),
                                ("wx_qy_corpsecret", ""),
                                ("wx_qy_agentid", ""),
                            ],
                        },
                    ),
                    (
                        "/cmsi/get_msg_type/",
                        {
                            "comp_codename": "generic.cmsi.get_msg_type",
                            "comp_conf_to_db": [
                                ("weixin", True),
                                ("mail", True),
                                ("sms", True),
                                ("voice", True),
                            ],
                        },
                    ),
                    ("/cmsi/send_msg/", {"comp_codename": "generic.cmsi.send_msg"}),
                    (
                        "/cmsi/send_qy_weixin/",
                        {
                            "comp_codename": "generic.cmsi.send_qy_weixin",
                            "is_deprecated": True,
                            "comp_conf_to_db": [
                                ("wx_qy_corpid", ""),
                                ("wx_qy_corpsecret", ""),
                                ("wx_qy_agentid", ""),
                            ],
                        },
                    ),
                    (
                        "/cmsi/send_mp_weixin/",
                        {
                            "comp_codename": "generic.cmsi.send_mp_weixin",
                            "is_deprecated": True,
                            "comp_conf_to_db": [
                                ("wx_app_id", ""),
                                ("wx_secret", ""),
                                ("wx_template_id", "yrxKwt3OR4BGvuZzwiASaSm_GfOtxwak3mMfh5Ijiaw"),
                            ],
                        },
                    ),
                    # GSE
                    (
                        "/gse/proc_create_session/",
                        {
                            "comp_codename": "generic.gse.proc_create_session",
                            "is_deprecated": True,
                            "comp_conf": {
                                "need_check_operate_perm": True,
                            },
                        },
                    ),
                    (
                        "/gse/proc_get_task_result_by_id/",
                        {
                            "comp_codename": "generic.gse.proc_get_task_result_by_id",
                            "is_deprecated": True,
                        },
                    ),
                    (
                        "/gse/proc_run_command/",
                        {
                            "comp_codename": "generic.gse.proc_run_command",
                            "is_deprecated": True,
                        },
                    ),
                    # devops
                    ("/devops/api/v1/getPipelineList", {"comp_codename": "generic.devops.devops_component"}),
                    ("/devops/api/v1/getPipelineBuildStatus", {"comp_codename": "generic.devops.devops_component"}),
                    ("/devops/api/v1/buildPipeline", {"comp_codename": "generic.devops.devops_component"}),
                    ("/devops/api/v1/getBuildList", {"comp_codename": "generic.devops.devops_component"}),
                    ("/devops/api/v1/getBuildChanges", {"comp_codename": "generic.devops.devops_component"}),
                    ("/devops/api/v1/getPipelineInfo", {"comp_codename": "generic.devops.devops_component"}),
                    ("/devops/api/v1/savePipeline", {"comp_codename": "generic.devops.devops_component"}),
                    ("/devops/api/v1/deletePipeline", {"comp_codename": "generic.devops.devops_component"}),
                    ("/devops/api/v1/replayPipeline", {"comp_codename": "generic.devops.devops_component"}),
                    ("/devops/api/v1/getStageDetail", {"comp_codename": "generic.devops.devops_component"}),
                    ("/devops/api/v1/getBuildInfo", {"comp_codename": "generic.devops.devops_component"}),
                    ("/devops/api/v1/terminateBuild", {"comp_codename": "generic.devops.devops_component"}),
                    ("/devops/api/v1/reviewOperate", {"comp_codename": "generic.devops.devops_component"}),
                    ("/devops/api/v1/getStepInfo", {"comp_codename": "generic.devops.devops_component"}),
                    ("/devops/api/v1/checkScmPermission", {"comp_codename": "generic.devops.devops_component"}),
                    ("/devops/api/v1/saveCredentials", {"comp_codename": "generic.devops.devops_component"}),
                    ("/devops/api/v1/getCredentials", {"comp_codename": "generic.devops.devops_component"}),
                    ("/devops/api/v1/deleteCredentials", {"comp_codename": "generic.devops.devops_component"}),
                    ("/devops/api/v1/getCredentialsList", {"comp_codename": "generic.devops.devops_component"}),
                    ("/devops/api/v1/saveScm", {"comp_codename": "generic.devops.devops_component"}),
                    ("/devops/api/v1/getScm", {"comp_codename": "generic.devops.devops_component"}),
                    ("/devops/api/v1/deleteScm", {"comp_codename": "generic.devops.devops_component"}),
                    ("/devops/api/v1/getScmList", {"comp_codename": "generic.devops.devops_component"}),
                    ("/devops/api/v1/getBuildImageList", {"comp_codename": "generic.devops.devops_component"}),
                    ("/devops/api/v1/terminateBuild", {"comp_codename": "generic.devops.devops_component"}),
                    ("/devops/api/v1/getBuildInfo", {"comp_codename": "generic.devops.devops_component"}),
                    ("/devops/api/v1/getBuildCount", {"comp_codename": "generic.devops.devops_component"}),
                    ("/devops/api/v1/getArtifactStatistics", {"comp_codename": "generic.devops.devops_component"}),
                    ("/devops/api/v1/admin/getBuildCount", {"comp_codename": "generic.devops.devops_component"}),
                    ("/devops/api/v1/getCodeScanStatistics", {"comp_codename": "generic.devops.devops_component"}),
                    ("/devops/api/v1/saveAppInfo", {"comp_codename": "generic.devops.devops_component"}),
                    ("/devops/api/v1/getAppInfo", {"comp_codename": "generic.devops.devops_component"}),
                    ("/devops/api/v1/selectBuildMachineList", {"comp_codename": "generic.devops.devops_component"}),
                    ("/devops/api/v1/addBuildMachine", {"comp_codename": "generic.devops.devops_component"}),
                    ("/devops/api/v1/updateBuildMachine", {"comp_codename": "generic.devops.devops_component"}),
                    ("/devops/api/v1/deleteBuildMachine", {"comp_codename": "generic.devops.devops_component"}),
                    ("/devops/api/v1/getTestReport", {"comp_codename": "generic.devops.devops_component"}),
                    ("/devops/api/v1/selectSuccessRate", {"comp_codename": "generic.devops.devops_component"}),
                    ("/devops/api/v1/selectTakeRecord", {"comp_codename": "generic.devops.devops_component"}),
                    ("/devops/api/v1/selectBuildStatistics", {"comp_codename": "generic.devops.devops_component"}),
                    ("/devops/api/v1/getArtifactDetail", {"comp_codename": "generic.devops.devops_component"}),
                    ("/devops/api/v1/listDirectory", {"comp_codename": "generic.devops.devops_component"}),
                    # FTA
                    ("/fta/http_relay/", {"comp_codename": "generic.fta.http_relay", "is_hidden": True}),
                    ("/fta/imap_relay/", {"comp_codename": "generic.fta.imap_relay", "is_hidden": True}),
                    (
                        "/fta/callback/{instance_id}/",
                        {
                            "comp_codename": "generic.fta.fta_component",
                            "is_hidden": True,
                            "method": "POST",
                            "comp_conf": {
                                "dest_path": "/fta/callback/{instance_id}/",
                                "dest_http_method": "POST",
                                "name": "callback_instance_id",
                                "label": u"callback_instance_id",
                            },
                        },
                    ),
                    (
                        "/fta/callback/{instance_id}/{node_idx}/",
                        {
                            "comp_codename": "generic.fta.fta_component",
                            "is_hidden": True,
                            "method": "POST",
                            "comp_conf": {
                                "dest_path": "/fta/callback/{instance_id}/{node_idx}/",
                                "dest_http_method": "POST",
                                "name": "callback_instance_id_node_idx",
                                "label": u"callback_instance_id_node_idx",
                            },
                        },
                    ),
                    # HEARTBEAT
                    ("/heartbeat/detect/", {"comp_codename": "generic.heartbeat.detect", "is_hidden": True}),
                    # ESB
                    ("/v2/esb/get_systems/", {"comp_codename": "generic.v2.esb.get_systems"}),
                    ("/v2/esb/get_components/", {"comp_codename": "generic.v2.esb.get_components"}),
                    (
                        "/v2/esb/get_api_public_key/",
                        {
                            "comp_codename": "generic.v2.esb.get_api_public_key",
                            "is_hidden": True,
                        },
                    ),
                    # BKUSER
                    (
                        "/v2/usermanage/fe_list_departments/",
                        {
                            "comp_codename": "generic.v2.usermanage.usermanage_component",
                            "request_validators": [UserAuthWithBKTokenValidator()],
                            "is_hidden": True,
                            "comp_conf": {
                                "name": "fe_list_departments",
                                "dest_http_method": "GET",
                                "dest_path": "/api/v2/departments/",
                                "is_support_jsonp": True,
                            },
                        },
                    ),
                    (
                        "/v2/usermanage/fe_list_users/",
                        {
                            "comp_codename": "generic.v2.usermanage.usermanage_component",
                            "request_validators": [UserAuthWithBKTokenValidator()],
                            "is_hidden": True,
                            "comp_conf": {
                                "name": "fe_list_users",
                                "dest_http_method": "GET",
                                "dest_path": "/api/v2/profiles/",
                                "is_support_jsonp": True,
                            },
                        },
                    ),
                    (
                        "/v2/usermanage/fe_list_department_children/",
                        {
                            "comp_codename": "generic.v2.usermanage.usermanage_component",
                            "request_validators": [UserAuthWithBKTokenValidator()],
                            "is_hidden": True,
                            "comp_conf": {
                                "name": "fe_list_department_children",
                                "dest_http_method": "GET",
                                "dest_path": "/api/v2/departments/{lookup_value}/children/",
                                "is_support_jsonp": True,
                            },
                        },
                    ),
                    (
                        "/v2/usermanage/fe_list_department_profiles/",
                        {
                            "comp_codename": "generic.v2.usermanage.usermanage_component",
                            "request_validators": [UserAuthWithBKTokenValidator()],
                            "is_hidden": True,
                            "comp_conf": {
                                "name": "fe_list_department_profiles",
                                "dest_http_method": "GET",
                                "dest_path": "/api/v2/departments/{lookup_value}/profiles/",
                                "is_support_jsonp": True,
                            },
                        },
                    ),
                    (
                        "/v2/usermanage/fs_list_users/",
                        {
                            "comp_codename": "generic.v2.usermanage.fs_list_users",
                            "request_validators": [UserAuthWithBKTokenValidator()],
                            "is_hidden": True,
                            "comp_conf": {
                                "is_support_jsonp": True,
                            },
                        },
                    ),
                    (
                        "/v1/usermanage/login/check/",
                        {
                            "comp_codename": "generic.v2.usermanage.usermanage_component",
                            "request_validators": [
                                AppAuthValidator(),
                                AppCodeWhiteListValidator(
                                    (
                                        "bk_login",
                                        "bk_paas",
                                        "bk_console",
                                    )
                                ),
                            ],
                            "is_hidden": True,
                            "comp_conf": {
                                "name": "api_v1_login_check",
                                "dest_http_method": "POST",
                                "dest_path": "/api/v1/login/check/",
                            },
                        },
                    ),
                    (
                        "/v1/usermanage/login/profile/",
                        {
                            "comp_codename": "generic.v2.usermanage.usermanage_component",
                            "request_validators": [
                                AppAuthValidator(),
                                AppCodeWhiteListValidator(
                                    (
                                        "bk_login",
                                        "bk_paas",
                                        "bk_console",
                                    )
                                ),
                            ],
                            "is_hidden": True,
                            "comp_conf": {
                                "name": "api_v1_login_profile",
                                "dest_http_method": "POST",
                                "dest_path": "/api/v1/login/profile/",
                            },
                        },
                    ),
                    (
                        "/v1/usermanage/login/profile/query/",
                        {
                            "comp_codename": "generic.v2.usermanage.usermanage_component",
                            "request_validators": [
                                AppAuthValidator(),
                                AppCodeWhiteListValidator(
                                    (
                                        "bk_login",
                                        "bk_paas",
                                        "bk_console",
                                    )
                                ),
                            ],
                            "is_hidden": True,
                            "comp_conf": {
                                "name": "api_v1_login_profile_query",
                                "dest_http_method": "POST",
                                "dest_path": "/api/v1/login/profile/query/",
                            },
                        },
                    ),

                ],
            },
            "esb": {
                "channel_classes": {
                    "api": ESBApiChannelForAPIS,
                },
                "preset_channels": (
                    (
                        "/esb/get_systems/",
                        {
                            "comp_codename": "generic.esb.get_systems",
                            "is_hidden": True,
                        },
                    ),
                    (
                        "/esb/get_components/",
                        {
                            "comp_codename": "generic.esb.get_components",
                            "is_hidden": True,
                        },
                    ),
                    (
                        "/esb/add_app_component_perm/",
                        {
                            "comp_codename": "generic.esb.add_app_component_perm",
                            "is_hidden": True,
                        },
                    ),
                    (
                        "/esb/get_weixin_config/",
                        {
                            "comp_codename": "generic.esb.get_weixin_config",
                            "is_hidden": True,
                        },
                    ),
                    # weixin
                    ("/weixin/get_token/", {"comp_codename": "generic.weixin.get_token", "is_hidden": True}),
                ),
            },
            "fta": {
                "channel_classes": {
                    "api": FTAApiChannelForAPIS,
                },
                "preset_channels": (
                    (
                        "/fta/event/api/{fta_application_id}/",
                        {
                            "comp_codename": "generic.fta.fta_component",
                            "is_hidden": True,
                            "method": "POST",
                            "comp_conf": {
                                "dest_path": "/event/api/{fta_application_id}/",
                                "dest_http_method": "POST",
                                "name": "event_api_fta_application_id",
                                "label": u"event_api_fta_application_id",
                            },
                        },
                    ),
                    (
                        "/fta/event/nagios/{fta_application_id}/",
                        {
                            "comp_codename": "generic.fta.fta_component",
                            "is_hidden": True,
                            "method": "POST",
                            "comp_conf": {
                                "dest_path": "/event/nagios/{fta_application_id}/",
                                "dest_http_method": "POST",
                                "name": "event_nagios_fta_application_id",
                                "label": u"event_nagios_fta_application_id",
                            },
                        },
                    ),
                    (
                        "/fta/event/open-falcon/{fta_application_id}/",
                        {
                            "comp_codename": "generic.fta.fta_component",
                            "is_hidden": True,
                            "method": "GET",
                            "comp_conf": {
                                "dest_path": "/event/open-falcon/{fta_application_id}/",
                                "dest_http_method": "GET",
                                "name": "event_open_falcon_fta_application_id",
                                "label": u"event_open_falcon_fta_application_id",
                            },
                        },
                    ),
                    (
                        "/fta/event/zabbix/v3.0/{fta_application_id}/",
                        {
                            "comp_codename": "generic.fta.fta_component",
                            "is_hidden": True,
                            "method": "POST",
                            "comp_conf": {
                                "dest_path": "/event/zabbix/v3.0/{fta_application_id}/",
                                "dest_http_method": "POST",
                                "name": "event_zabbix_v3_fta_application_id",
                                "label": u"event_zabbix_v3_fta_application_id",
                            },
                        },
                    ),
                    (
                        "/fta/event/aws/{fta_application_id}/",
                        {
                            "comp_codename": "generic.fta.fta_component",
                            "is_hidden": True,
                            "method": "POST",
                            "comp_conf": {
                                "dest_path": "/event/aws/{fta_application_id}/",
                                "dest_http_method": "POST",
                                "name": "fta_event_aws_fta_app_id",
                                "label": u"fta_event_aws_fta_app_id",
                            },
                        },
                    ),
                    (
                        "/fta/event/icinga2/{fta_application_id}/",
                        {
                            "comp_codename": "generic.fta.fta_component",
                            "is_hidden": True,
                            "method": "POST",
                            "comp_conf": {
                                "dest_path": "/event/icinga2/{fta_application_id}/",
                                "dest_http_method": "POST",
                                "name": "fta_event_icinga2_fta_app_id",
                                "label": u"fta_event_icinga2_fta_app_id",
                            },
                        },
                    ),
                    (
                        "/fta/status/process/",
                        {
                            "comp_codename": "generic.fta.fta_component",
                            "is_hidden": True,
                            "method": "GET",
                            "comp_conf": {
                                "dest_path": "/fta/status/process/",
                                "dest_http_method": "GET",
                                "name": "fta_status_process",
                                "label": u"fta_status_process",
                            },
                        },
                    ),
                ),
            },
        },
    },
}
