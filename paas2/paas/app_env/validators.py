# -*- coding: utf-8 -*-
from django.utils.translation import ugettext as _

import re


def validate_env_var(name):
    check_result = re.match(r"^[a-zA-Z0-9_]+$", name)
    if check_result:
        return True


def validate_id(id):
    if not id:
        return False, _(u"ID 不能为空")

    if not str(id).isdigit():
        return False, _(u"错误的ID值")

    return True, None


def validate_env_var_name(name):
    if not name:
        return False, _(u"变量名不能为空!")

    if not validate_env_var(name) or len(name) > 44:
        return False, _(u"请输入合法的变量名, 只允许字母数字下划线!")

    return True, None


def validate_env_var_value(value):
    if not value:
        return False, _(u"变量值不能为空!")
    if len(value) > 1000:
        return False, _(u"变量值不能超过1000个字符!")

    if '"' in value:
        return False, _(u"变量值不能包含引号!")
    # if not validate_env_var(value):
    # return False, u"请输入合法的变量值, 只允许字母数字下划线!"

    return True, None
