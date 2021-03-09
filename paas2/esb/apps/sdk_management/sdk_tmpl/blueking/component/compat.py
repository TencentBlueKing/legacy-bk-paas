# -*- coding: utf-8 -*-
import sys

_ver = sys.version_info

is_py2 = _ver[0] == 2

is_py3 = _ver[0] == 3


if is_py2:
    from urlparse import urlparse

    str = unicode

elif is_py3:
    from urllib.parse import urlparse  # noqa

    str = str
