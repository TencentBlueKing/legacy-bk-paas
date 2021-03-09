# -*- coding: utf-8 -*-
from django.utils.translation import ugettext as _

import re

APP_MAKER_CODE_CONNECTOR = "_"
APP_MAKER_CODE_CHECK_PATTERN = re.compile(r"^[a-z][a-z0-9_]{1,15}$")
APP_MAKER_CODE_CHECK_MSG = _(u"轻应用ID只允许小写英文字母,下划线或数字,并且以字母开头")
