# -*- coding: utf-8 -*-
import json
from api.constants import ApiErrorCodeEnumV2


def InnerFeedback(data=None, result=True, code="00", message=""):  # noqa
    """
    内部接口之间交互的方式
    这里其实没做什么，只是规范了一下格式而已
    try catch 放在内部检查并给出详细的信息
    @param data: 接口真正返回的数据
    @param result: 是否成功
    @param code:
    @param message:
    @return:
    """
    _type_name = type(data).__name__
    if _type_name == "ValuesQuerySet":
        data = list(data)
    return {
        "data": data,
        "result": result,
        "code": code,
        "message": message,
    }


class InnerFeedBackClassV2(object):
    def __init__(self, data={}, code=0, message=""):
        _type_name = type(data).__name__
        if _type_name == "ValuesQuerySet":
            self.data = list(data)
        else:
            self.data = data
        self.code = code
        self.message = message

    def get_json(self):
        return {
            "bk_error_msg": self.message,
            "bk_error_code": self.code,
            "data": self.data,
            "result": self.code == ApiErrorCodeEnumV2.SUCCESS,
        }

    def __setitem__(self, key, value):
        self.__dict__[key] = value


def get_post_data(request):
    try:
        post_data = json.loads(request.body)
        return post_data
    except Exception:
        return {}
