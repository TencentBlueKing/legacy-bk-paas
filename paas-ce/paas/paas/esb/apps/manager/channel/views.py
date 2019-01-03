# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa

import json

from django.shortcuts import render
from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect
from django.views.generic import View
from django.http import Http404

from common.log import logger
from esb.bkcore.models import ESBChannel, ComponentSystem
from esb.common.decorators import is_user_super
from esb.common.django_utils import i18n_form, get_cur_language
from esb.configs.default import menu_items
from .forms import ESBChannelForm, EditESBChannelForm
from ..system.forms import ComponentSystemForm
from ..utils import md2html

menu_active_item = 'channel_manager'


class ChannelListView(View):
    """Channel list page"""

    @is_user_super
    def get(self, request):
        channel_exists = ESBChannel.objects.exists()
        systems = [{'name': '', 'label': u'All'}]
        channel_system_ids = ESBChannel.objects.values_list('component_system_id', flat=True).distinct()
        systems.extend([
            {
                'name': system.name,
                'label': u'[%s] %s' % (system.name, system.label_display),
            }
            for system in ComponentSystem.objects.filter(id__in=channel_system_ids).order_by('name')
        ])

        cur_language = get_cur_language()
        return render(request, 'manager/channel/list.html', {
            'channel_exists': channel_exists,
            'systems': systems,
            'menu_items': menu_items,
            'menu_active_item': menu_active_item,
            'channel_term_html': md2html('%s/channel' % cur_language)
        })


class AddChannelView(View):
    """Add channel view"""

    @is_user_super
    def get(self, request):
        form = ESBChannelForm()
        system_form = ComponentSystemForm()
        form = i18n_form(form)
        system_form = i18n_form(system_form)
        return render(request, 'manager/channel/add.html', {
            'form': form,
            'system_form': system_form,
            'menu_items': menu_items,
            'menu_active_item': menu_active_item,
        })

    @is_user_super
    def post(self, request):
        form = ESBChannelForm(request.POST)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect(reverse('manager.channel.list'))
        system_form = ComponentSystemForm()
        form = i18n_form(form)
        system_form = i18n_form(system_form)
        return render(request, 'manager/channel/add.html', {
            'form': form,
            'system_form': system_form,
            'menu_items': menu_items,
            'menu_active_item': menu_active_item,
        })


class EditChannelView(View):
    """Edit channel view"""

    @is_user_super
    def get(self, request, channel_id):
        if not str(channel_id).isdigit():
            raise Http404

        channel = ESBChannel.objects.get(id=channel_id)

        channel.name = channel.name_display
        if channel.is_confapi:
            # confapi 不更新 comp_conf
            channel.comp_conf = None

        form = EditESBChannelForm(instance=channel)
        system_form = ComponentSystemForm()
        try:
            if channel.comp_conf:
                comp_conf = json.loads(channel.comp_conf)
            else:
                comp_conf = None
        except Exception:
            logger.error('esb channel comp_conf is not json, channel_id: %s, comp_conf: %s',
                         channel_id, channel.comp_conf)
            comp_conf = None

        try:
            rate_limit_conf = json.loads(channel.rate_limit_conf)
            default_rate_limit_conf = rate_limit_conf['app_ratelimit']['__default'][0]
            rate_limit_tokens = default_rate_limit_conf.pop('tokens', '')
            rate_limit_unit = default_rate_limit_conf.keys()[0]
        except Exception:
            rate_limit_tokens = ''
            rate_limit_unit = 'second'

        _comp_conf_group = self.comp_conf_group(channel.path, comp_conf)
        # 可在 comp_conf_group 中新增字段，用户在通道管理页面上可看到并更新新增字段
        if _comp_conf_group:
            _comp_conf_val = json.dumps([(conf['key'], conf['value']) for conf in _comp_conf_group['comp_conf']])
        else:
            _comp_conf_val = ''

        form = i18n_form(form)
        system_form = i18n_form(system_form)

        if channel.is_official:
            form.fields['name'].widget.attrs['readonly'] = True
            form.fields['path'].widget.attrs['readonly'] = True
            form.fields['component_codename'].widget.attrs['readonly'] = True

        return render(request, 'manager/channel/edit.html', {
            'form': form,
            'system_form': system_form,
            'menu_items': menu_items,
            'menu_active_item': menu_active_item,
            'comp_conf': comp_conf,
            'comp_conf_val': _comp_conf_val,
            'rate_limit_required': channel.rate_limit_required,
            'comp_conf_group': _comp_conf_group,
            'rate_limit_conf': {
                'tokens': rate_limit_tokens,
                'unit': rate_limit_unit
            }
        })

    @is_user_super
    def post(self, request, channel_id):
        channel = ESBChannel.objects.get(id=channel_id)
        post_data = request.POST.copy()

        # 值不变更
        unchanged_data = {}
        if channel.is_official:
            unchanged_data['name'] = channel.name
        if channel.is_confapi:
            unchanged_data['comp_conf'] = channel.comp_conf
            unchanged_data['component_name'] = channel.component_name

        form = EditESBChannelForm(post_data, instance=channel)
        if form.is_valid():
            form.instance.__dict__.update(unchanged_data)
            form.save()
            return HttpResponseRedirect(reverse('manager.channel.list'))
        system_form = ComponentSystemForm()
        form = i18n_form(form)
        system_form = i18n_form(system_form)
        return render(request, 'manager/channel/edit.html', {
            'form': form,
            'system_form': system_form,
            'menu_items': menu_items,
            'menu_active_item': menu_active_item,
        })

    def comp_conf_group(self, path, comp_conf):
        """
        注意：生成结果的 comp_conf 中不能有 key 值相同的项，否则，数据库中 comp_conf 也会出现多余的重复字段
        """
        if not comp_conf:
            return None
        if path == '/cmsi/send_weixin/':
            comp_conf = dict(comp_conf)
            return {
                # 参数分组字段
                'group_field': 'wx_type',
                # 参数分组可选值
                'groups': [
                    {'value': 'qywx', 'label': u'企业微信'},
                    {'value': 'mp', 'label': u'微信公众号'},
                ],
                # 字段配置
                'comp_conf': [
                    {
                        'key': 'wx_type',
                        'value': comp_conf.get('wx_type', ''),
                    },
                    {
                        'key': 'wx_app_id',
                        'value': comp_conf.get('wx_app_id', ''),
                        'group': 'wx_type wx_type_mp',
                    },
                    {
                        'key': 'wx_secret',
                        'value': comp_conf.get('wx_secret', ''),
                        'group': 'wx_type wx_type_mp',
                        'text_type': 'password',
                    },
                    {
                        'key': 'wx_token',
                        'value': comp_conf.get('wx_token', ''),
                        'group': 'wx_type wx_type_mp',
                        'text_type': 'password',
                    },
                    {
                        'key': 'wx_template_id',
                        'value': comp_conf.get('wx_template_id', ''),
                        'group': 'wx_type wx_type_mp',
                    },
                    {
                        'key': 'wx_qy_corpid',
                        'value': comp_conf.get('wx_qy_corpid', ''),
                        'group': 'wx_type wx_type_qy wx_type_qywx',
                    },
                    {
                        'key': 'wx_qy_corpsecret',
                        'value': comp_conf.get('wx_qy_corpsecret', ''),
                        'group': 'wx_type wx_type_qy wx_type_qywx',
                        'text_type': 'password',
                    },
                    {
                        'key': 'wx_qy_agentid',
                        'value': comp_conf.get('wx_qy_agentid', ''),
                        'group': 'wx_type wx_type_qy wx_type_qywx',
                    },
                ]
            }
        elif path == '/cmsi/send_mail/':
            comp_conf = dict(comp_conf)
            return {
                # 字段配置
                'comp_conf': [
                    {
                        'key': 'dest_url',
                        'value': comp_conf.get('dest_url', ''),
                    },
                    {
                        'key': 'smtp_host',
                        'value': comp_conf.get('smtp_host', ''),
                    },
                    {
                        'key': 'smtp_port',
                        'value': comp_conf.get('smtp_port', 25),
                    },
                    {
                        'key': 'smtp_user',
                        'value': comp_conf.get('smtp_user', ''),
                    },
                    {
                        'key': 'smtp_pwd',
                        'value': comp_conf.get('smtp_pwd', ''),
                        'text_type': 'password',
                    },
                    {
                        'key': 'smtp_usessl',
                        'value': comp_conf.get('smtp_usessl', 'False'),
                    },
                    {
                        'key': 'smtp_usetls',
                        'value': comp_conf.get('smtp_usetls', 'False'),
                    },
                    {
                        'key': 'mail_sender',
                        'value': comp_conf.get('mail_sender', ''),
                    },
                ]
            }
        elif path == '/cmsi/send_sms/':
            comp_conf = dict(comp_conf)
            return {
                # 字段配置
                'comp_conf': [
                    {
                        'key': 'dest_url',
                        'value': comp_conf.get('dest_url', ''),
                    },
                    {
                        'key': 'qcloud_app_id',
                        'value': comp_conf.get('qcloud_app_id', ''),
                    },
                    {
                        'key': 'qcloud_app_key',
                        'value': comp_conf.get('qcloud_app_key', ''),
                        'text_type': 'password',
                    },
                ]
            }

        comp_conf = [
            {
                'key': key,
                'value': value
            }
            for key, value in comp_conf
        ]
        return {'comp_conf': comp_conf}
