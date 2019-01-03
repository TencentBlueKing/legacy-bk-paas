# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
"""
ESB conf
"""
import os

from django.conf import settings

from components.component import ApiChannelForAPIS, ESBApiChannelForAPIS, FTAApiChannelForAPIS
from esb.bkapp.validators import AppAuthValidator


def _rel_path(x):
    return os.path.join(settings.BASE_DIR, x)


CUSTOM_APIS_REL_PATH = getattr(settings, 'CUSTOM_APIS_REL_PATH', 'components/generic/apis/')


# channel config is_hidden, is_deprecated description:
#   is_hidden: channel not open, no sdk and apidoc
#   is_deprecated: channel was once open and generated sdk and apidoc, but now deprecated, need to hide apidoc
#   is_hidden and is_deprecated do not need to exist at the same time

config = {
    'version': 1,
    'config': {
        # important!
        # component_group should in order, last dir has higher priority
        'component_groups': [
            {
                'path': _rel_path('components/generic/templates/'),
                'name_prefix': 'generic.',
            },
            {
                'path': _rel_path(CUSTOM_APIS_REL_PATH),
                'name_prefix': 'generic.',
            },
            {
                'path': _rel_path('components/bk/apis/'),
                'name_prefix': 'generic.',
            },
            {
                'path': _rel_path('components/bk/apisv2/'),
                'name_prefix': 'generic.v2.',
            },
        ],
        'default_channel_classes': None,
        'doc_common_args': u"""
            #### {{ _("通用参数") }}

            | {{ _("字段") }} | {{ _("类型") }} | {{ _("必选") }} |  {{ _("描述") }} |
            |-----------|------------|--------|------------|
            | bk_app_code  |  string    | {{ _("是") }} | {{ _("应用ID") }}     |
            | bk_app_secret|  string    | {{ _("是") }} | {{ _("安全密钥(应用 TOKEN)，可以通过 蓝鲸智云开发者中心 -> 点击应用ID -> 基本信息 获取") }} |
            | bk_token     |  string    | {{ _("否") }} | {{ _("当前用户登录态，bk_token与bk_username必须一个有效，bk_token可以通过Cookie获取") }} |
            | bk_username  |  string    | {{ _("否") }} | {{ _("当前用户用户名，应用免登录态验证白名单中的应用，用此字段指定当前用户") }} |""",  # noqa
        'channel_groups': {
            'default': {
                'channel_classes': {
                    'api': ApiChannelForAPIS,
                },
                'rewrite_channels': {
                    # cmsi
                    '/v2/cmsi/send_voice_msg/': '/cmsi/send_voice_msg/',
                    '/v2/cmsi/send_mail/': '/cmsi/send_mail/',
                    '/v2/cmsi/send_sms/': '/cmsi/send_sms/',
                    '/v2/cmsi/send_weixin/': '/cmsi/send_weixin/',
                },
                'preset_channels': [
                    # CC v2
                    ('/v2/cc/add_host_to_resource/', {'comp_codename': 'generic.v2.cc.add_host_to_resource'}),
                    ('/v2/cc/create_business/', {'comp_codename': 'generic.v2.cc.create_business'}),
                    ('/v2/cc/create_custom_query/', {'comp_codename': 'generic.v2.cc.create_custom_query'}),
                    ('/v2/cc/create_module/', {'comp_codename': 'generic.v2.cc.create_module'}),
                    ('/v2/cc/create_set/', {'comp_codename': 'generic.v2.cc.create_set'}),
                    ('/v2/cc/delete_business/', {'comp_codename': 'generic.v2.cc.delete_business'}),
                    ('/v2/cc/delete_custom_query/', {'comp_codename': 'generic.v2.cc.delete_custom_query'}),
                    ('/v2/cc/delete_host/', {'comp_codename': 'generic.v2.cc.delete_host'}),
                    ('/v2/cc/delete_module/', {'comp_codename': 'generic.v2.cc.delete_module'}),
                    ('/v2/cc/delete_set/', {'comp_codename': 'generic.v2.cc.delete_set'}),
                    ('/v2/cc/get_custom_query_data/', {'comp_codename': 'generic.v2.cc.get_custom_query_data'}),
                    ('/v2/cc/get_custom_query_detail/', {'comp_codename': 'generic.v2.cc.get_custom_query_detail'}),
                    ('/v2/cc/get_host_base_info/', {'comp_codename': 'generic.v2.cc.get_host_base_info'}),
                    ('/v2/cc/search_business/', {'comp_codename': 'generic.v2.cc.search_business'}),
                    ('/v2/cc/search_custom_query/', {'comp_codename': 'generic.v2.cc.search_custom_query'}),
                    ('/v2/cc/search_host/', {'comp_codename': 'generic.v2.cc.search_host'}),
                    ('/v2/cc/search_module/', {'comp_codename': 'generic.v2.cc.search_module'}),
                    ('/v2/cc/search_set/', {'comp_codename': 'generic.v2.cc.search_set'}),
                    ('/v2/cc/transfer_host_module/', {'comp_codename': 'generic.v2.cc.transfer_host_module'}),
                    ('/v2/cc/transfer_host_to_faultmodule/', {
                        'comp_codename': 'generic.v2.cc.transfer_host_to_faultmodule',
                    }),
                    ('/v2/cc/transfer_host_to_idlemodule/', {
                        'comp_codename': 'generic.v2.cc.transfer_host_to_idlemodule',
                    }),
                    ('/v2/cc/transfer_host_to_resourcemodule/', {
                        'comp_codename': 'generic.v2.cc.transfer_host_to_resourcemodule',
                    }),
                    ('/v2/cc/transfer_resourcehost_to_idlemodule/', {
                        'comp_codename': 'generic.v2.cc.transfer_resourcehost_to_idlemodule',
                    }),
                    ('/v2/cc/update_business/', {'comp_codename': 'generic.v2.cc.update_business'}),
                    ('/v2/cc/update_custom_query/', {'comp_codename': 'generic.v2.cc.update_custom_query'}),
                    ('/v2/cc/update_host/', {'comp_codename': 'generic.v2.cc.update_host'}),
                    ('/v2/cc/update_module/', {'comp_codename': 'generic.v2.cc.update_module'}),
                    ('/v2/cc/update_set/', {'comp_codename': 'generic.v2.cc.update_set'}),
                    ('/v2/cc/search_biz_inst_topo/', {'comp_codename': 'generic.v2.cc.search_biz_inst_topo'}),
                    ('/v2/cc/search_inst_by_object/', {'comp_codename': 'generic.v2.cc.search_inst_by_object'}),
                    ('/v2/cc/bind_role_privilege/', {'comp_codename': 'generic.v2.cc.bind_role_privilege'}),
                    ('/v2/cc/update_object_topo_graphics/', {
                        'comp_codename': 'generic.v2.cc.update_object_topo_graphics',
                    }),

                    # paas v2
                    ('/v2/bk_paas/create_app/', {
                        'comp_codename': 'generic.v2.bk_paas.create_app',
                        'is_hidden': True,
                    }),
                    ('/v2/bk_paas/del_app/', {
                        'comp_codename': 'generic.v2.bk_paas.del_app',
                        'is_hidden': True,
                    }),
                    ('/v2/bk_paas/edit_app/', {
                        'comp_codename': 'generic.v2.bk_paas.edit_app',
                        'is_hidden': True,
                    }),
                    ('/v2/bk_paas/get_app_info/', {
                        'comp_codename': 'generic.v2.bk_paas.get_app_info',
                    }),
                    ('/v2/bk_paas/modify_app_logo/', {
                        'comp_codename': 'generic.v2.bk_paas.modify_app_logo',
                        'is_hidden': True,
                    }),

                    # login v2
                    ('/v2/bk_login/get_all_users/', {'comp_codename': 'generic.v2.bk_login.get_all_users'}),
                    ('/v2/bk_login/get_batch_users/', {'comp_codename': 'generic.v2.bk_login.get_batch_users'}),
                    ('/v2/bk_login/get_batch_users_platform_role/', {
                        'comp_codename': 'generic.v2.bk_login.get_batch_users_platform_role',
                    }),
                    ('/v2/bk_login/get_user/', {'comp_codename': 'generic.v2.bk_login.get_user'}),
                    ('/v2/bk_login/is_login/', {
                        'comp_codename': 'generic.v2.bk_login.is_login',
                        'request_validators': [AppAuthValidator()],
                        'is_hidden': True,
                    }),

                    # CC
                    ('/cc/add_plat_id/', {
                        'comp_codename': 'generic.cc.add_plat_id',
                        'is_deprecated': True,
                    }),
                    ('/cc/del_plat/', {
                        'comp_codename': 'generic.cc.del_plat',
                        'is_deprecated': True,
                    }),
                    ('/cc/get_app_by_id/', {
                        'comp_codename': 'generic.cc.get_app_by_id',
                        'is_deprecated': True,
                    }),

                    ('/cc/get_app_by_user/', {
                        'comp_codename': 'generic.cc.get_app_by_user',
                        'is_deprecated': True,
                    }),
                    ('/cc/get_app_by_user_role/', {
                        'comp_codename': 'generic.cc.get_app_by_user_role',
                        'is_deprecated': True,
                    }),

                    ('/cc/get_app_host_list/', {
                        'comp_codename': 'generic.cc.get_app_host_list',
                        'is_deprecated': True,
                    }),

                    ('/cc/get_app_list/', {
                        'comp_codename': 'generic.cc.get_app_list',
                        'is_deprecated': True,
                    }),
                    ('/cc/get_host_list_by_ip/', {
                        'comp_codename': 'generic.cc.get_host_list_by_ip',
                        'is_deprecated': True,
                    }),
                    ('/cc/get_hosts_by_property/', {
                        'comp_codename': 'generic.cc.get_hosts_by_property',
                        'is_deprecated': True,
                    }),
                    ('/cc/get_ip_and_proxy_by_company/', {
                        'comp_codename': 'generic.cc.get_ip_and_proxy_by_company',
                        'is_deprecated': True,
                    }),

                    ('/cc/get_module_host_list/', {
                        'comp_codename': 'generic.cc.get_module_host_list',
                        'is_deprecated': True,
                    }),
                    ('/cc/get_modules/', {
                        'comp_codename': 'generic.cc.get_modules',
                        'is_deprecated': True,
                    }),
                    ('/cc/get_modules_by_property/', {
                        'comp_codename': 'generic.cc.get_modules_by_property',
                        'is_deprecated': True,
                    }),

                    ('/cc/get_plat_id/', {
                        'comp_codename': 'generic.cc.get_plat_id',
                        'is_deprecated': True,
                    }),

                    ('/cc/get_set_host_list/', {
                        'comp_codename': 'generic.cc.get_set_host_list',
                        'is_deprecated': True,
                    }),
                    ('/cc/get_set_property/', {
                        'comp_codename': 'generic.cc.get_set_property',
                        'is_deprecated': True,
                    }),
                    ('/cc/get_sets_by_property/', {
                        'comp_codename': 'generic.cc.get_sets_by_property',
                        'is_deprecated': True,
                    }),
                    ('/cc/get_topo_tree_by_app_id/', {
                        'comp_codename': 'generic.cc.get_topo_tree_by_app_id',
                        'is_deprecated': True,
                    }),

                    ('/cc/update_gse_proxy_status/', {
                        'comp_codename': 'generic.cc.update_gse_proxy_status',
                        'is_deprecated': True,
                    }),
                    ('/cc/update_host_by_app_id/', {
                        'comp_codename': 'generic.cc.update_host_by_app_id',
                        'is_deprecated': True,
                    }),
                    ('/cc/update_host_plat/', {
                        'comp_codename': 'generic.cc.update_host_plat',
                        'is_deprecated': True,
                    }),
                    ('/cc/get_property_list/', {
                        'comp_codename': 'generic.cc.get_property_list',
                        'is_deprecated': True,
                    }),
                    ('/cc/get_host_list_by_field/', {
                        'comp_codename': 'generic.cc.get_host_list_by_field',
                        'is_deprecated': True,
                    }),
                    ('/cc/get_app_agent_status/', {
                        'comp_codename': 'generic.cc.get_app_agent_status',
                        'is_deprecated': True,
                    }),
                    ('/cc/get_host_company_id/', {
                        'comp_codename': 'generic.cc.get_host_company_id',
                        'is_deprecated': True,
                    }),
                    ('/cc/get_host_by_company_id/', {
                        'comp_codename': 'generic.cc.get_host_by_company_id',
                        'is_deprecated': True,
                    }),
                    ('/cc/get_git_server_ip/', {
                        'comp_codename': 'generic.cc.get_git_server_ip',
                        'is_hidden': True,
                    }),

                    ('/cc/clone_host_property/', {
                        'comp_codename': 'generic.cc.clone_host_property',
                        'is_deprecated': True,
                    }),
                    ('/cc/update_host_module/', {
                        'comp_codename': 'generic.cc.update_host_module',
                        'is_deprecated': True,
                    }),
                    ('/cc/get_process_port_by_app_id/', {
                        'comp_codename': 'generic.cc.get_process_port_by_app_id',
                        'is_deprecated': True,
                    }),
                    ('/cc/get_process_port_by_ip/', {
                        'comp_codename': 'generic.cc.get_process_port_by_ip',
                        'is_hidden': True,
                    }),
                    ('/cc/add_set/', {
                        'comp_codename': 'generic.cc.add_set',
                        'is_deprecated': True,
                    }),
                    ('/cc/del_set/', {
                        'comp_codename': 'generic.cc.del_set',
                        'is_deprecated': True,
                    }),
                    ('/cc/del_set_host/', {
                        'comp_codename': 'generic.cc.del_set_host',
                        'is_deprecated': True,
                    }),
                    ('/cc/update_set_property/', {
                        'comp_codename': 'generic.cc.update_set_property',
                        'is_deprecated': True,
                    }),
                    ('/cc/update_set_service_status/', {
                        'comp_codename': 'generic.cc.update_set_service_status',
                        'is_deprecated': True,
                    }),
                    ('/cc/update_custom_property/', {
                        'comp_codename': 'generic.cc.update_custom_property',
                        'is_deprecated': True,
                    }),
                    ('/cc/update_module_property/', {
                        'comp_codename': 'generic.cc.update_module_property',
                        'is_deprecated': True,
                    }),

                    ('/cc/add_app/', {
                        'comp_codename': 'generic.cc.add_app',
                        'is_deprecated': True,
                    }),
                    ('/cc/add_module/', {
                        'comp_codename': 'generic.cc.add_module',
                        'is_deprecated': True,
                    }),
                    ('/cc/del_app/', {
                        'comp_codename': 'generic.cc.del_app',
                        'is_deprecated': True,
                    }),
                    ('/cc/del_host_in_app/', {
                        'comp_codename': 'generic.cc.del_host_in_app',
                        'is_deprecated': True,
                    }),
                    ('/cc/del_module/', {
                        'comp_codename': 'generic.cc.del_module',
                        'is_deprecated': True,
                    }),
                    ('/cc/edit_app/', {
                        'comp_codename': 'generic.cc.edit_app',
                        'is_deprecated': True,
                    }),
                    ('/cc/enter_ip/', {
                        'comp_codename': 'generic.cc.enter_ip',
                        'is_deprecated': True,
                    }),
                    ('/cc/update_host_info/', {
                        'comp_codename': 'generic.cc.update_host_info',
                        'is_deprecated': True,
                    }),

                    ('/cc/get_customer_group_list/', {
                        'comp_codename': 'generic.cc.get_customer_group_list',
                        'is_hidden': True,
                    }),
                    ('/cc/get_content_by_customer_group_id/', {
                        'comp_codename': 'generic.cc.get_content_by_customer_group_id',
                        'is_hidden': True,
                    }),

                    # BK_LOGIN
                    ('/bk_login/get_all_user/', {
                        'comp_codename': 'generic.bk_login.get_all_user',
                        'request_validators': [AppAuthValidator()],
                        'is_deprecated': True,
                    }),
                    ('/bk_login/get_batch_user/', {
                        'comp_codename': 'generic.bk_login.get_batch_user',
                        'request_validators': [AppAuthValidator()],
                        'is_deprecated': True,
                    }),
                    ('/bk_login/get_batch_user_platform_role/', {
                        'comp_codename': 'generic.bk_login.get_batch_user_platform_role',
                        'request_validators': [AppAuthValidator()],
                        'is_deprecated': True,
                    }),

                    ('/bk_login/is_login/', {
                        'comp_codename': 'generic.bk_login.is_login',
                        'request_validators': [AppAuthValidator()],
                        'is_hidden': True,
                    }),
                    ('/bk_login/get_user/', {
                        'comp_codename': 'generic.bk_login.get_user',
                        'request_validators': [AppAuthValidator()],
                        'is_deprecated': True,
                    }),

                    # BK_PAAS
                    ('/bk_paas/get_app_info/', {
                        'comp_codename': 'generic.bk_paas.get_app_info',
                        'is_deprecated': True,
                    }),

                    # CMSI
                    ('/cmsi/send_voice_msg/', {
                        'comp_codename': 'generic.cmsi.send_voice_msg',
                        'comp_conf_to_db': [
                            ('dest_url', ''),
                        ]
                    }),
                    ('/cmsi/send_mail/', {
                        'comp_codename': 'generic.cmsi.send_mail',
                        'comp_conf_to_db': [
                            ('dest_url', ''),
                            ('smtp_host', ''),
                            ('smtp_port', 25),
                            ('smtp_user', 'blueking'),
                            ('smtp_pwd', ''),
                            ('smtp_usessl', 'False'),
                            ('smtp_usetls', 'False'),
                            ('mail_sender', 'blueking@bking.com'),
                        ]
                    }),
                    ('/cmsi/send_sms/', {
                        'comp_codename': 'generic.cmsi.send_sms',
                        'comp_conf_to_db': [
                            ('dest_url', ''),
                            ('qcloud_app_id', ''),
                            ('qcloud_app_key', ''),
                        ]
                    }),
                    ('/cmsi/send_weixin/', {
                        'comp_codename': 'generic.cmsi.send_weixin',
                        'comp_conf_to_db': [
                            ('wx_type', 'qywx'),
                            ('wx_app_id', ''),
                            ('wx_secret', ''),
                            ('wx_token', ''),
                            ('wx_template_id', ''),
                            ('wx_qy_corpid', ''),
                            ('wx_qy_corpsecret', ''),
                            ('wx_qy_agentid', ''),
                        ]
                    }),

                    # FTA
                    ('/fta/http_relay/', {
                        'comp_codename': 'generic.fta.http_relay',
                        'is_hidden': True
                    }),
                    ('/fta/imap_relay/', {
                        'comp_codename': 'generic.fta.imap_relay',
                        'is_hidden': True
                    }),
                    ('/fta/callback/{instance_id}/', {
                        'comp_codename': 'generic.fta.fta_component',
                        'is_hidden': True,
                        'method': 'POST',
                        'comp_conf': {
                            'dest_path': '/fta/callback/{instance_id}/',
                            'dest_http_method': 'POST',
                            'name': 'callback_instance_id',
                            'label': u'callback_instance_id',
                        }
                    }),
                    ('/fta/callback/{instance_id}/{node_idx}/', {
                        'comp_codename': 'generic.fta.fta_component',
                        'is_hidden': True,
                        'method': 'POST',
                        'comp_conf': {
                            'dest_path': '/fta/callback/{instance_id}/{node_idx}/',
                            'dest_http_method': 'POST',
                            'name': 'callback_instance_id_node_idx',
                            'label': u'callback_instance_id_node_idx',
                        }
                    }),

                    # HEARTBEAT
                    ('/heartbeat/detect/', {
                        'comp_codename': 'generic.heartbeat.detect',
                        'is_hidden': True
                    }),

                ]
            },
            'esb': {
                'channel_classes': {
                    'api': ESBApiChannelForAPIS,
                },
                'preset_channels': (
                    # weixin
                    ('/weixin/get_token/', {
                        'comp_codename': 'generic.weixin.get_token',
                        'is_hidden': True
                    }),
                )
            },
            'fta': {
                'channel_classes': {
                    'api': FTAApiChannelForAPIS,
                },
                'preset_channels': (
                    ('/fta/event/api/{fta_application_id}/', {
                        'comp_codename': 'generic.fta.fta_component',
                        'is_hidden': True,
                        'method': 'POST',
                        'comp_conf': {
                            'dest_path': '/event/api/{fta_application_id}/',
                            'dest_http_method': 'POST',
                            'name': 'event_api_fta_application_id',
                            'label': u'event_api_fta_application_id',
                        }
                    }),
                    ('/fta/event/nagios/{fta_application_id}/', {
                        'comp_codename': 'generic.fta.fta_component',
                        'is_hidden': True,
                        'method': 'POST',
                        'comp_conf': {
                            'dest_path': '/event/nagios/{fta_application_id}/',
                            'dest_http_method': 'POST',
                            'name': 'event_nagios_fta_application_id',
                            'label': u'event_nagios_fta_application_id',
                        }
                    }),
                    ('/fta/event/open-falcon/{fta_application_id}/', {
                        'comp_codename': 'generic.fta.fta_component',
                        'is_hidden': True,
                        'method': 'GET',
                        'comp_conf': {
                            'dest_path': '/event/open-falcon/{fta_application_id}/',
                            'dest_http_method': 'GET',
                            'name': 'event_open_falcon_fta_application_id',
                            'label': u'event_open_falcon_fta_application_id',
                        }
                    }),
                    ('/fta/event/zabbix/v3.0/{fta_application_id}/', {
                        'comp_codename': 'generic.fta.fta_component',
                        'is_hidden': True,
                        'method': 'POST',
                        'comp_conf': {
                            'dest_path': '/event/zabbix/v3.0/{fta_application_id}/',
                            'dest_http_method': 'POST',
                            'name': 'event_zabbix_v3_fta_application_id',
                            'label': u'event_zabbix_v3_fta_application_id',
                        }
                    }),
                    ('/fta/event/aws/{fta_application_id}/', {
                        'comp_codename': 'generic.fta.fta_component',
                        'is_hidden': True,
                        'method': 'POST',
                        'comp_conf': {
                            'dest_path': '/event/aws/{fta_application_id}/',
                            'dest_http_method': 'POST',
                            'name': 'fta_event_aws_fta_app_id',
                            'label': u'fta_event_aws_fta_app_id',
                        }
                    }),
                    ('/fta/event/icinga2/{fta_application_id}/', {
                        'comp_codename': 'generic.fta.fta_component',
                        'is_hidden': True,
                        'method': 'POST',
                        'comp_conf': {
                            'dest_path': '/event/icinga2/{fta_application_id}/',
                            'dest_http_method': 'POST',
                            'name': 'fta_event_icinga2_fta_app_id',
                            'label': u'fta_event_icinga2_fta_app_id',
                        }
                    }),
                    ('/fta/status/process/', {
                        'comp_codename': 'generic.fta.fta_component',
                        'is_hidden': True,
                        'method': 'GET',
                        'comp_conf': {
                            'dest_path': '/fta/status/process/',
                            'dest_http_method': 'GET',
                            'name': 'fta_status_process',
                            'label': u'fta_status_process',
                        }
                    }),

                )
            }
        }
    }
}
