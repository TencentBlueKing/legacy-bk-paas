# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
import json

from django import forms

from components.component import Component, SetupConfMixin
from common.forms import BaseComponentForm, TypeCheckField, ListField
from .toolkit import configs, tools


class NocNotice(Component, SetupConfMixin):
    """
    apiLabel 公共语音通知
    apiMethod POST

    ### 功能描述

    公共语音通知

    ### 请求参数

    {{ common_args_desc }}

    #### 接口参数

    | 字段                  |  类型      | 必选   |  描述      |
    |-----------------------|------------|--------|------------|
    | auto_read_message     |  string    | 是     | 自动语音读字信息 |
    | user_list_information |  array     | 否     | 待通知的用户列表，自动语音通知列表，若user_list_information、receiver__username同时存在，以user_list_information为准 |
    | receiver__username    |  string    | 否     | 待通知的用户列表，包含用户名，用户需在蓝鲸平台注册，多个以逗号分隔，若user_list_information、receiver__username同时存在，以user_list_information为准 |

    #### user_list_information

    | 字段         |  类型      | 必选   |  描述      |
    |--------------|------------|--------|------------|
    | username     |  string    | 是     | 被通知人 |
    | mobile_phone |  string    | 否     | 被通知人手机号 |

    ### 请求参数示例

    ```python
    {
        "app_code": "esb_test",
        "app_secret": "xxx",
        "bk_token": "xxx",
        "auto_read_message": "This is a test",
        "user_list_information": [{
            "username": "admin",
            "mobile_phone": "1234567890",
        }]
    }
    ```

    ### 返回结果示例

    ```python
    {
        "result": true,
        "code": "00",
        "message": "",
        "data": {
            "instance_id": "2662152044"
        }
    }
    ```
    """  # noqa

    sys_name = configs.SYSTEM_NAME
    host = configs.host
    contact_way = 'phone'
    dest_url = ''

    class Form(BaseComponentForm):
        auto_read_message = forms.CharField(label=u'自动语音读字信息', required=True)
        user_list_information = TypeCheckField(label=u'用户列表', promise_type=list, required=False)
        receiver__username = ListField(label=u'蓝鲸用户列表', required=False)

        def clean(self):
            data = self.cleaned_data
            user_list_information = [
                NocNotice.UserListInfoForm(user_info).get_cleaned_data_or_error()
                for user_info in data['user_list_information']
                if user_info
            ]
            if not (data.get('receiver__username') or user_list_information):
                raise forms.ValidationError(u'参数[user_list_information、receiver__username]不能同时为空')
            data['user_list_information'] = user_list_information
            if user_list_information:
                data['receiver__username'] = None
            return data

    class UserListInfoForm(BaseComponentForm):
        username = forms.CharField(label=u'被通知人', required=True)
        mobile_phone = forms.CharField(label=u'被通知人手机号', required=False)

        def clean(self):
            data = self.cleaned_data
            if data['mobile_phone'] and not data['mobile_phone'].isdigit():
                raise forms.ValidationError(u'被通知人手机号[mobile_phone]必须是一个数字。')
            return data

    def handle(self):
        data = self.request.kwargs
        # 将 receiver__username 中的用户名，转换为接口需要的 user_list_information 信息
        if data['receiver__username']:
            user_data = tools.get_user_contact_with_username(
                username_list=data['receiver__username'],
                contact_way=self.contact_way,
            )
            data['user_list_information'] = [
                {
                    'username': username,
                    'mobile_phone': contact_info,
                }
                for username, contact_info in user_data['user_contact_info'].iteritems()
            ]
            data['_extra_user_error_msg'] = user_data['_extra_user_error_msg']

        # TODO: can be updated
        if self.dest_url:
            result = self.outgoing.http_client.request_by_url(
                'POST',
                self.dest_url,
                data=json.dumps(data)
            )

            if result['result'] and data.get('_extra_user_error_msg'):
                result = {
                    'result': False,
                    'data': result.get('data'),
                    'message': u'部分用户语音发送失败。%s' % data['_extra_user_error_msg'],
                }
            self.response.payload = result
        else:
            self.response.payload = {'result': False, 'message': u'未完成接口，需要组件负责人进行完善'}
