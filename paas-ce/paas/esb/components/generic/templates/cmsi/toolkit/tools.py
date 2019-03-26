# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
from common.errors import CommonAPIError


def valid_email(email):
    if not isinstance(email, basestring) or email.find('@') < 0:
        return False
    return True


def valid_phone(phone):
    if not isinstance(phone, (basestring, int)) or not str(phone).isdigit():
        return False
    return True


def get_user_contact(user, contact_way):
    if contact_way == 'email':
        contact_info = user['email']
        return contact_info, valid_email(contact_info)
    elif contact_way == 'phone':
        contact_info = user['phone']
        return contact_info, valid_phone(contact_info)
    else:
        contact_info = user.get(contact_way)
        return contact_info, bool(contact_info)


def validate_receiver(receiver, contact_way='phone'):
    valid_receiver = []
    error_contact_user = []
    for user_contact in receiver:
        if contact_way == 'email':
            is_valid = valid_email(user_contact)
        elif contact_way == 'phone':
            is_valid = valid_phone(user_contact)
        if is_valid:
            valid_receiver.append(user_contact)
        else:
            error_contact_user.append(user_contact)
    if error_contact_user:
        raise CommonAPIError('User message failed to send. The following users contact format are incorrect: %s, please check' % ','.join(error_contact_user))  # noqa
    return valid_receiver


def get_receiver_with_username(receiver__username=None,    # noqa
                               cc__username=None,
                               contact_way='phone'):
    username_list = []
    if receiver__username:
        username_list.extend(receiver__username)
    if cc__username:
        username_list.extend(cc__username)

    if not username_list:
        return {}

    from components.bk.apis.bk_login.get_batch_user import GetBatchUser
    user_result = GetBatchUser().invoke(kwargs={'username_list': username_list})
    if not user_result['result']:
        raise CommonAPIError(u'Failed to get users contact information based on username, %s' % user_result['message'])

    result = {}
    not_exist_user = []
    error_contact_user = []
    user_data = user_result['data']
    if receiver__username:
        result['receiver'] = []
        for username in receiver__username:
            user = user_data.get(username)
            if not user:
                not_exist_user.append(username)
                continue
            user_contact, is_valid = get_user_contact(user, contact_way)
            if is_valid:
                result['receiver'].append(user_contact)
            else:
                error_contact_user.append(username)

    if cc__username:
        result['cc'] = []
        for username in cc__username:
            user = user_data.get(username)
            if not user:
                not_exist_user.append(username)
                continue
            user_contact, is_valid = get_user_contact(user, contact_way)
            if is_valid:
                result['cc'].append(user_contact)
            else:
                error_contact_user.append(username)

    _extra_user_error_msg = []
    if not_exist_user:
        _extra_user_error_msg.append(u'The following users are not blueking users: %s' % ','.join(not_exist_user))
    if error_contact_user:
        _extra_user_error_msg.append(u'The following users contact format are incorrect: %s'
                                     % ','.join(error_contact_user))
    result['_extra_user_error_msg'] = ';'.join(_extra_user_error_msg)

    if receiver__username and not result.get('receiver'):
        raise CommonAPIError(u'All users message failed to be sent. %s' % result['_extra_user_error_msg'])

    return result


def get_user_contact_with_username(username_list=None, contact_way='phone'):
    from components.bk.apis.bk_login.get_batch_user import GetBatchUser
    user_result = GetBatchUser().invoke(kwargs={'username_list': username_list})
    if not user_result['result']:
        raise CommonAPIError(u'Failed to get users contact information based on username, %s' % user_result['message'])

    user_contact_info = {}
    not_exist_user = []
    error_contact_user = []
    user_data = user_result['data']
    for username in username_list:
        user = user_data.get(username)
        if not user:
            not_exist_user.append(username)
            continue
        user_contact, is_valid = get_user_contact(user, contact_way)
        if is_valid:
            user_contact_info[username] = user_contact
        else:
            error_contact_user.append(username)

    _extra_user_error_msg = []
    if not_exist_user:
        _extra_user_error_msg.append(u'The following users are not blueking users: %s' % ','.join(not_exist_user))
    if error_contact_user:
        _extra_user_error_msg.append(u'The following users contact format are incorrect: %s'
                                     % ','.join(error_contact_user))
    _extra_user_error_msg = ';'.join(_extra_user_error_msg)

    if not user_contact_info:
        raise CommonAPIError(u'All users contact information failed to get, %s' % _extra_user_error_msg)

    return {
        'user_contact_info': user_contact_info,
        '_extra_user_error_msg': _extra_user_error_msg
    }
