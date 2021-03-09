# -*- coding: utf-8 -*-
from django.utils.translation import ugettext as _


class BaseException(Exception):
    def __init__(self, message):
        self.message = message
        super(BaseException, self).__init__(self.message)

    def get_message(self):
        return self.message


class ESConnectionTimeout(BaseException):
    def __init__(self, timeout):
        self.message = _(u"请求Elasticsearch超时（read timeout=%s），请稍后重试") % timeout
        super(ESConnectionTimeout, self).__init__(self.message)


class ESHostEmptyException(BaseException):
    def __init__(self):
        self.message = _(u"系统未配置Elasticsearch地址，请联系系统负责人处理")
        super(ESHostEmptyException, self).__init__(self.message)


class ESConnectionException(BaseException):
    def __init__(self):
        self.message = _(u"连接Elasticsearch出现错误，请检查配置的Elasticsearch服务是否正常")
        super(ESConnectionException, self).__init__(self.message)


class ESSearchException(BaseException):
    def __init__(self):
        self.message = _(u"查询Elasticsearch出现错误，请联系系统负责人处理")
        super(ESSearchException, self).__init__(self.message)


class ESNotFoundException(BaseException):
    def __init__(self, index):
        self.message = _(u"查询Elasticsearch出现错误，请检查 index [%s] 是否存在") % index
        super(ESNotFoundException, self).__init__(self.message)
