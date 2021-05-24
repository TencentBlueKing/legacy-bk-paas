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

from future import standard_library

standard_library.install_aliases()
from builtins import object
import csv
import codecs
import io


def escape(s, fromtype, is_json):
    """Replace special characters "&", "<" and ">" to HTML-safe sequences.
    If the optional flag quote is true, the quotation mark character (")
    is also translated.
    rewrite the cgi method
    @param fromtype: 来源，0：views函数，1：middleware（对&做转换），默认是0
    @param is_json: 是否为json串（True/False） ，默认为False
    """
    # &转换
    if fromtype == 1 and not is_json:
        # Must be done first   !
        s = s.replace("&", "&amp;")
    # <>转换
    s = s.replace("<", "&lt;")
    s = s.replace(">", "&gt;")
    # 单双引号转换
    if not is_json:
        s = s.replace(" ", "&nbsp;")
        s = s.replace('"', "&quot;")
        s = s.replace("'", "&#39;")
    return s


def html_escape(str_escape, fromtype=0, is_json=False):
    """
    字符串转义为html代码
    @param str_escape: 需要解析的html代码
    @param fromtype: 来源，0：views函数，1：middleware
    @param is_json: 是否为json串
    """
    try:
        result_str = escape(str_escape, fromtype, is_json)
        return result_str
    except Exception:
        return str_escape


def unescape_message(s):
    try:
        # Must be done first!
        s = s.replace("&amp;", "&")
        s = s.replace("&lt;", "<")
        s = s.replace("&gt;", ">")
        s = s.replace("\\", "\\\\")
        s = s.replace("&nbsp;", "\ ")
        s = s.replace("&quot;", '"')
        s = s.replace("&#39;", "'")

        need_decode = '+-&|!(){}[]^"~?:/*'
        for i in need_decode:
            s = s.replace(i, "\%s" % i)
    except Exception:
        pass
    return s


class UnicodeWriter(object):
    """
    A CSV writer which will write rows to CSV file "f",
    which is encoded in the given encoding.
    """

    def __init__(self, f, dialect=csv.excel, encoding="utf-8", **kwds):
        # Redirect output to a queue
        self.queue = io.StringIO()
        self.writer = csv.writer(self.queue, dialect=dialect, **kwds)
        self.stream = f
        # 写入BOM，解决中文显示乱码
        self.stream.write("\xEF\xBB\xBF")
        self.encoder = codecs.getincrementalencoder(encoding)()

    def writerow(self, row):
        self.writer.writerow([s.encode("utf-8") for s in row])
        # Fetch UTF-8 output from the queue ...
        data = self.queue.getvalue()
        # data = data.decode("utf-8")
        # ... and reencode it into the target encoding
        data = self.encoder.encode(data)
        # write to the target stream
        self.stream.write(data)
        # empty queue
        self.queue.truncate(0)

    def writerows(self, rows):
        for row in rows:
            self.writerow(row)
