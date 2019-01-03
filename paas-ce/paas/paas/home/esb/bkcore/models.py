# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
"""
Core models for the project.
"""
import json

from django.db import models


class ComponentSystem(models.Model):
    """组件系统
    """
    name = models.CharField(u'系统名称', max_length=64)
    label = models.CharField(u'系统标签', max_length=128, help_text=u'系统简要说明')
    component_admin = models.CharField(u'组件开发负责人', max_length=128, default='', blank=True)
    interface_admin = models.CharField(u'系统接口负责人', max_length=128, default='', blank=True,
                                       help_text=u'记录系统接口负责人，以便进行消息通知或直接联系，长度为128字符以内')
    system_link = models.CharField(u'系统链接', max_length=1024, default='', blank=True,
                                   help_text=u'标准的HTTP链接，多个以分号分隔')
    belong_to = models.CharField(u'系统所属组织', max_length=128, default='', blank=True)
    remark = models.TextField(u'备注', default='', blank=True)
    execute_timeout = models.IntegerField(u'执行类超时时长', null=True, blank=True,
                                          help_text=u'单位秒，未设置时超时时长为30秒')
    query_timeout = models.IntegerField(u'查询类超时时长', null=True, blank=True,
                                        help_text=u'单位秒，未设置时超时时长为30秒')

    class Meta:
        ordering = ['name']
        db_table = 'esb_component_system'

    def __unicode__(self):
        return u'[%s] %s' % (self.name, self.label)


class ESBChannel(models.Model):
    """Channel for ESB

    One channel links a path to a component
    """
    TYPE_CHOICE = (
        (1, u'执行API'),
        (2, u'查询API'),
    )
    PERM_LEVEL_CHOICE = (
        (0, u'无限制'),
        (1, u'普通权限'),
        (2, u'敏感权限'),
        (3, u'特殊权限'),
    )

    name = models.CharField(u'通道名称', max_length=64, help_text=u'通道名称，长度限制为64字符，例如"查询服务器列表"')
    path = models.CharField(u'通道路径', max_length=255, unique=True, help_text=u'通道请求路径，例如"/host/get_host_list/"')
    method = models.CharField(u'请求类型', max_length=32, null=True, default='', blank=True)
    component_system = models.ForeignKey(ComponentSystem, verbose_name=u'所属组件系统', null=True)
    component_codename = models.CharField(u'对应组件代号', max_length=255,
                                          help_text=u'对应的组件代号，该组件必须注册到ESB平台中，例如 "generic.host.get_host_list"')
    component_name = models.CharField(u'组件英文名', max_length=64, default='', blank=True, null=True)
    is_active = models.BooleanField(u'是否开启', default=True)
    last_modified_time = models.DateTimeField(u'最后更新', auto_now=True)
    created_time = models.DateTimeField(u'创建时间', auto_now_add=True)
    timeout_time = models.IntegerField(u'超时时长', blank=True, null=True, help_text=u'单位秒，未设置时以所属组件系统超时时长为准')
    type = models.IntegerField(u'组件类型', choices=TYPE_CHOICE, default=2)
    comp_conf = models.TextField(u'组件配置', default='', null=True, blank=True)
    perm_level = models.IntegerField(u'权限级别', choices=PERM_LEVEL_CHOICE, default=0)
    is_hidden = models.BooleanField(u'组件是否隐藏', default=False, help_text=u'是否显示文档，及是否在权限申请中展示')
    rate_limit_required = models.BooleanField(u'是否校验访问频率', default=False)
    rate_limit_conf = models.TextField(u'请求频率配置', null=True, blank=True,
                                       help_text=u'限制访问频率，允许多种规则，例如{"app_ratelimit": {"__default": {"token":1000, "minute": 1}, "gcloud": {"token":1000, "minute": 1}}}')  # noqa

    class Meta:
        db_table = 'esb_channel'

    def __unicode__(self):
        return self.name

    @property
    def channel_conf(self):
        return {
            'id': self.id,
            'perm_level': self.perm_level,
            'rate_limit_required': self.rate_limit_required,
            'rate_limit_conf': json.loads(self.rate_limit_conf or '{}'),
        }

    @property
    def comp_conf_dict(self):
        try:
            if not self.comp_conf:
                comp_conf = None
            else:
                comp_conf = json.loads(self.comp_conf)
        except Exception:
            comp_conf = None

        if not comp_conf:
            return None

        if self.path == '/cmsi/send_weixin/':
            comp_conf = dict(comp_conf)
            return {
                'wx_type': comp_conf.get('wx_type', ''),
                'wx_app_id': comp_conf.get('wx_app_id', ''),
                'wx_secret': comp_conf.get('wx_secret', ''),
                'wx_token': comp_conf.get('wx_token', ''),
                'wx_qy_corpid': comp_conf.get('wx_qy_corpid', ''),
                'wx_qy_corpsecret': comp_conf.get('wx_qy_corpsecret', ''),
                'wx_qy_agentid': comp_conf.get('wx_qy_agentid', '')
            }

        return comp_conf
