# -*- coding: utf-8 -*-
import re

from .base_utils import ChoicesEnum


RE_PATH_VARIABLE = re.compile(r"\{([A-Za-z0-9_-]+)\}")
RE_PATH_STAGE_VARIABLE = re.compile(r"\{stageVariables\.([A-Za-z0-9_-]+)\}")


class ApiTypeEnum(ChoicesEnum):

    ESB = 0
    OFFICIAL_API = 1

    CLOUDS_DMZ_API = 10
    CLOUDS_API = 11

    _choices_labels = (
        (ESB, u"ESB"),
        (OFFICIAL_API, u"官方云API"),
        (CLOUDS_DMZ_API, u"云API[隔离区]"),
        (CLOUDS_API, u"云API[非隔离区]"),
    )
