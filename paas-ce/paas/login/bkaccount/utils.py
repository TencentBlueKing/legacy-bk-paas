# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
from __future__ import unicode_literals
import StringIO

import xlrd
import xlwt
from django.conf import settings
from django.utils.translation import ugettext as _

from common.log import logger
from bkaccount.accounts import Account
from bkaccount.constants import ROLECODE_CHOICES
from bkaccount.models import BkUser


def validate_bk_token(data):
    """
    检查bk_token的合法性，并返回用户实例
    """
    account = Account()
    bk_token = data.get(account.BK_COOKIE_NAME)
    # 验证Token参数
    is_valid, username, message = account._is_bk_token_valid(bk_token)
    if not is_valid:
        return False, None, message
    try:
        user = BkUser.objects.get(username=username)
    except BkUser.DoesNotExist:
        return False, None, _("用户不存在")
    return True, user, ''


def is_request_from_esb(request):
    """
    请求是否来自ESB
    """
    x_app_token = request.META.get('HTTP_X_APP_TOKEN')
    x_app_code = request.META.get('HTTP_X_APP_CODE')
    return x_app_code == 'esb' and x_app_token == settings.ESB_TOKEN


def read_user_import_xls(xls_file):
    str_file = StringIO.StringIO(xls_file.read())
    wbk = xlrd.open_workbook(file_contents=str_file.read())
    sheet = wbk.sheets()[0]

    user_list = []

    for i in range(sheet.nrows - 1, 0, -1):
        # StringIO可以接受Unicode或ASCII编码的字符串，但不能混用，否则在使用getvalue()时会出现UnicodeError错误
        # 手机号格式处理
        phone = sheet.row_values(i)[2]
        phone = "%s" % (int(phone) if isinstance(phone, float) else phone)
        # 将角色名转为对应code
        role = get_role_code_by_role_name(sheet.row_values(i)[4])
        user_list.append({
            'username': sheet.row_values(i)[0],
            'chname': sheet.row_values(i)[1],
            'phone': phone,
            'email': sheet.row_values(i)[3],
            'role': role
        })

    return user_list


def write_excel(head_list, records):
    wbk = xlwt.Workbook(encoding='gbk')
    # 设置 excel 文件格式
    sheet = wbk.add_sheet('Sheet1')
    for i in range(0, 22):
        sheet.col(i).width = 0x0d00 + 2000
    fnt = xlwt.Font()
    fnt.name = 'Arial'
    fnt.colour_index = 4
    fnt.bold = True
    style = xlwt.XFStyle()
    style.font = fnt
    # 标题栏
    for i, data in enumerate(head_list):
        sheet.write(0, i, data)
    # 查询库存数据
    try:
        for index, record in enumerate(records):
            for cell_index, cell_value in enumerate(record):
                sheet.write(index + 1, cell_index, cell_value)
    except Exception as e:
        logger.exception('export excel fail, error: {}'.format(e))
        return False, _("导出数据出现错误"), wbk

    return True, 'SUCCESS', wbk


def get_page_info(page, page_size, default_page_size=10):
    try:
        page = int(page)
        page_size = int(page_size)

        if page < 1:
            page = 1
        if page_size < 1:
            page_size = default_page_size
    except Exception:
        page = 1
        page_size = default_page_size

    return page, page_size


def get_role_code_by_role_name(role_name):
    """
    将角色名转换为角色编码
    """
    role_name_code_dict = dict([(_(i[1]), i[0]) for i in ROLECODE_CHOICES])
    try:
        role_name = u"%s" % role_name
        role_code = role_name_code_dict.get(role_name)
    except Exception as error:
        logger.exception("role name conversion role code error: {}".format(error))
        role_code = None
    return role_code


def get_role_name_by_role_code(role_code):
    """
    将角色编码转换为角色名
    """
    role_code_name_dict = dict(ROLECODE_CHOICES)
    return _(role_code_name_dict.get(role_code, ''))
